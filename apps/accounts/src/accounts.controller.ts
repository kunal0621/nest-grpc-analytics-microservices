import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AccountsService } from './accounts.service';
import type {
  GetAccountsRequest,
  GetAccountsResponse,
  CreateAccountRequest,
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

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @GrpcMethod('AccountService', 'Ping')
  ping(): { message: string } {
    return this.accountsService.ping();
  }

  @GrpcMethod('AccountService', 'GetAccounts')
  async getAccounts(data: GetAccountsRequest): Promise<GetAccountsResponse> {
    return this.accountsService.getAccounts(data);
  }

  @GrpcMethod('AccountService', 'CreateAccount')
  async createAccount(
    data: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return await this.accountsService.createAccount(data);
  }

  @GrpcMethod('AccountService', 'GetAccountById')
  async getAccountById(
    data: GetAccountByIdRequest,
  ): Promise<GetAccountByIdResponse> {
    return await this.accountsService.getAccountById(data);
  }

  @GrpcMethod('AccountService', 'UpdateAccountLimit')
  async updateAccountLimit(
    data: UpdateAccountLimitRequest,
  ): Promise<UpdateAccountLimitResponse> {
    return await this.accountsService.updateAccountLimit(data);
  }

  @GrpcMethod('AccountService', 'AddProductToAccount')
  async addProductToAccount(
    data: AddProductToAccountRequest,
  ): Promise<AddProductToAccountResponse> {
    return await this.accountsService.addProductToAccount(data);
  }

  @GrpcMethod('AccountService', 'RemoveProductFromAccount')
  async removeProductFromAccount(
    data: RemoveProductFromAccountRequest,
  ): Promise<RemoveProductFromAccountResponse> {
    return await this.accountsService.removeProductFromAccount(data);
  }
}
