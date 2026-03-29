import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface GetAccountsRequest {
  limit: number;
}

export interface AccountDto {
  account_id: number;
  limit: number;
  products: string[];
}

export interface GetAccountsResponse {
  accounts: AccountDto[];
}

export interface CreateAccountRequest {
  account_id: number;
  limit: number;
  products: string[];
}

export interface CreateAccountResponse {
  account: AccountDto;
}

export interface GetAccountByIdRequest {
  account_id: number;
}

export interface GetAccountByIdResponse {
  account: AccountDto;
}

export interface UpdateAccountLimitRequest {
  account_id: number;
  new_limit: number;
}

export interface UpdateAccountLimitResponse {
  account: AccountDto;
}

export interface AddProductToAccountRequest {
  account_id: number;
  product: string;
}

export interface AddProductToAccountResponse {
  account: AccountDto;
}

export interface RemoveProductFromAccountRequest {
  account_id: number;
  product: string;
}

export interface RemoveProductFromAccountResponse {
  account: AccountDto;
}

export interface AccountGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
  getAccounts(data: GetAccountsRequest): Observable<GetAccountsResponse>;
  createAccount(data: CreateAccountRequest): Observable<CreateAccountResponse>;
  getAccountById(
    data: GetAccountByIdRequest,
  ): Observable<GetAccountByIdResponse>;
  updateAccountLimit(
    data: UpdateAccountLimitRequest,
  ): Observable<UpdateAccountLimitResponse>;
  addProductToAccount(
    data: AddProductToAccountRequest,
  ): Observable<AddProductToAccountResponse>;
  removeProductFromAccount(
    data: RemoveProductFromAccountRequest,
  ): Observable<RemoveProductFromAccountResponse>;
}
