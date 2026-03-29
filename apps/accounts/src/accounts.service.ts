import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  CreateAccountRequest,
  AccountDto,
  GetAccountsRequest,
  GetAccountsResponse,
  CreateAccountResponse,
  GetAccountByIdRequest,
  GetAccountByIdResponse,
  UpdateAccountLimitRequest,
  UpdateAccountLimitResponse,
  AddProductToAccountRequest,
  AddProductToAccountResponse,
  RemoveProductFromAccountRequest,
  RemoveProductFromAccountResponse,
} from '../../analytics-gateway/src/accounts/constants/grpc-client.constants';

const MAX_LIMIT = 9000;

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
    try {
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
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to retrieve accounts',
        status.INTERNAL,
      );
    }
  }

  async createAccount(
    data: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    try {
      // Check if account already exists
      const existingAccount = await this.accountModel
        .findOne({ account_id: data.account_id })
        .exec();

      if (existingAccount) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: `Account with id ${data.account_id} already exists`,
        });
      }

      const account = new this.accountModel({
        account_id: data.account_id,
        limit: data.limit,
        products: data.products || [],
      });

      const savedAccount: AccountDto = await account.save();

      return {
        account: {
          account_id: savedAccount.account_id,
          limit: savedAccount.limit,
          products: savedAccount.products,
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to create account',
        status.INTERNAL,
      );
    }
  }

  async getAccountById(
    data: GetAccountByIdRequest,
  ): Promise<GetAccountByIdResponse> {
    try {
      const account = await this.accountModel
        .findOne({ account_id: data.account_id })
        .select('account_id limit products -_id')
        .lean()
        .exec();

      if (!account) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Account with id ${data.account_id} not found`,
        });
      }

      return {
        account: {
          account_id: account.account_id,
          limit: account.limit,
          products: account.products ?? [],
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to retrieve account',
        status.INTERNAL,
      );
    }
  }

  async updateAccountLimit(
    data: UpdateAccountLimitRequest,
  ): Promise<UpdateAccountLimitResponse> {
    try {
      const account = await this.accountModel
        .findOneAndUpdate(
          { account_id: data.account_id },
          { limit: data.new_limit },
          { new: true },
        )
        .select('account_id limit products -_id')
        .lean()
        .exec();

      if (!account) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Account with id ${data.account_id} not found`,
        });
      }

      return {
        account: {
          account_id: account.account_id,
          limit: account.limit,
          products: account.products ?? [],
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to update account limit',
        status.INTERNAL,
      );
    }
  }

  async addProductToAccount(
    data: AddProductToAccountRequest,
  ): Promise<AddProductToAccountResponse> {
    try {
      const account = await this.accountModel
        .findOneAndUpdate(
          { account_id: data.account_id },
          { $addToSet: { products: data.product } },
          { new: true },
        )
        .select('account_id limit products -_id')
        .lean()
        .exec();

      if (!account) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Account with id ${data.account_id} not found`,
        });
      }

      return {
        account: {
          account_id: account.account_id,
          limit: account.limit,
          products: account.products ?? [],
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to add product to account',
        status.INTERNAL,
      );
    }
  }

  async removeProductFromAccount(
    data: RemoveProductFromAccountRequest,
  ): Promise<RemoveProductFromAccountResponse> {
    try {
      const account = await this.accountModel
        .findOneAndUpdate(
          { account_id: data.account_id },
          { $pull: { products: data.product } },
          { new: true },
        )
        .select('account_id limit products -_id')
        .lean()
        .exec();

      if (!account) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Account with id ${data.account_id} not found`,
        });
      }

      return {
        account: {
          account_id: account.account_id,
          limit: account.limit,
          products: account.products ?? [],
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to remove product from account',
        status.INTERNAL,
      );
    }
  }

  private toRpcException(
    error: unknown,
    context: string,
    fallbackCode: number,
  ): RpcException {
    if (error instanceof RpcException) {
      return error;
    }

    return new RpcException({
      code: fallbackCode,
      message: `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
