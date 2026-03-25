import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';

const MAX_LIMIT = 9000;

export interface AccountDto {
  account_id: number;
  limit: number;
  products: string[];
}

export interface GetAccountsRequest {
  limit: number;
}

export interface GetAccountsResponse {
  accounts: AccountDto[];
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  ping(): { message: string } {
    return { message: 'Accounts service is up and running!' };
  }

  async getAccounts(data: GetAccountsRequest): Promise<GetAccountsResponse> {
    const effectiveLimit = Math.min(data.limit ?? MAX_LIMIT, MAX_LIMIT);

    const docs = await this.accountModel
      .find({ limit: { $lte: effectiveLimit } })
      .select('account_id limit products -_id')
      .lean()
      .exec();

    const accounts: AccountDto[] = docs.map((doc) => ({
      account_id: doc.account_id,
      limit: doc.limit,
      products: doc.products ?? [],
    }));

    return { accounts };
  }
}
