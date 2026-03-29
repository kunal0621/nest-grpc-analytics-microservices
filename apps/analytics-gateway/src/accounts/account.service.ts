import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AccountGrpcService,
  AddProductToAccountRequest,
  AddProductToAccountResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  GetAccountByIdResponse,
  GetAccountsResponse,
  RemoveProductFromAccountRequest,
  RemoveProductFromAccountResponse,
  UpdateAccountLimitRequest,
  UpdateAccountLimitResponse,
} from './constants/grpc-client.constants';
import { ACCOUNTS_SERVICE } from '../health/constants/grpc-client.constants';
import { PingResponse } from '../health/constants/grpc-client.constants';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountGrpcService: AccountGrpcService;

  constructor(
    @Inject(ACCOUNTS_SERVICE)
    private readonly accountsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.accountGrpcService =
      this.accountsClient.getService<AccountGrpcService>('AccountService');
  }

  pingAccounts(): Observable<PingResponse> {
    return this.accountGrpcService.ping({});
  }

  getAccounts(limit: number): Observable<GetAccountsResponse> {
    return this.accountGrpcService.getAccounts({ limit });
  }

  createAccount(data: CreateAccountRequest): Observable<CreateAccountResponse> {
    return this.accountGrpcService.createAccount(data);
  }

  getAccountById(account_id: number): Observable<GetAccountByIdResponse> {
    return this.accountGrpcService.getAccountById({ account_id });
  }

  updateAccountLimit(
    data: UpdateAccountLimitRequest,
  ): Observable<UpdateAccountLimitResponse> {
    return this.accountGrpcService.updateAccountLimit(data);
  }

  addProductToAccount(
    data: AddProductToAccountRequest,
  ): Observable<AddProductToAccountResponse> {
    return this.accountGrpcService.addProductToAccount(data);
  }

  removeProductFromAccount(
    data: RemoveProductFromAccountRequest,
  ): Observable<RemoveProductFromAccountResponse> {
    return this.accountGrpcService.removeProductFromAccount(data);
  }
}
