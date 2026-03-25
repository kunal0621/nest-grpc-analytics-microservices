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

export interface AccountGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
  getAccounts(data: GetAccountsRequest): Observable<GetAccountsResponse>;
}
