import { Observable } from 'rxjs';

export const ACCOUNTS_SERVICE = 'ACCOUNTS_SERVICE';
export const CUSTOMERS_SERVICE = 'CUSTOMERS_SERVICE';
export const TRANSACTIONS_SERVICE = 'TRANSACTIONS_SERVICE';

export interface PingResponse {
  message: string;
}

export interface AccountGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}

export interface CustomerGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}

export interface TransactionGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}
