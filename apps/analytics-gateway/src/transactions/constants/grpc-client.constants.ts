import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface TransactionDto {
  date: Date;
  amount: number;
  transaction_code: string;
  symbol: string;
  price: string;
  total: string;
}

export interface TransactionBucketDto {
  account_id: number;
  transaction_count: number;
  bucket_start_date: Date;
  bucket_end_date: Date;
  transactions: TransactionDto[];
}

export interface RecordTransactionRequest {
  account_id: number;
  symbol: string;
  amount: number;
  price: string;
  transaction_code: string;
}

export interface RecordTransactionResponse {
  success: boolean;
  bucket_id?: string;
}

export interface GetTransactionsByAccountRequest {
  account_id: number;
  start_date?: string;
  end_date?: string;
}

export interface GetTransactionsByAccountResponse {
  buckets: TransactionBucketDto[];
}

export interface GetTransactionsBySymbolRequest {
  account_id: number;
  symbol: string;
}

export interface GetTransactionsBySymbolResponse {
  buckets: TransactionBucketDto[];
}

export interface GetTransactionBucketSummaryRequest {
  account_id: number;
}

export interface GetTransactionBucketSummaryResponse {
  account_id: number;
  total_buckets: number;
  total_transactions: number;
  date_range: {
    earliest: Date;
    latest: Date;
  };
}
export interface TransactionGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
  recordTransaction(
    data: RecordTransactionRequest,
  ): Observable<RecordTransactionResponse>;
  getTransactionsByAccount(
    data: GetTransactionsByAccountRequest,
  ): Observable<GetTransactionsByAccountResponse>;
  getTransactionsBySymbol(
    data: GetTransactionsBySymbolRequest,
  ): Observable<GetTransactionsBySymbolResponse>;
  getTransactionBucketSummary(
    data: GetTransactionBucketSummaryRequest,
  ): Observable<GetTransactionBucketSummaryResponse>;
}
