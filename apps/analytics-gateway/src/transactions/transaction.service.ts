import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PingResponse } from '../health/constants/grpc-client.constants';
import {
  TransactionGrpcService,
  RecordTransactionRequest,
  RecordTransactionResponse,
  GetTransactionsByAccountRequest,
  GetTransactionsByAccountResponse,
  GetTransactionsBySymbolRequest,
  GetTransactionsBySymbolResponse,
  GetTransactionBucketSummaryRequest,
  GetTransactionBucketSummaryResponse,
} from './constants/grpc-client.constants';
import { TRANSACTIONS_SERVICE } from '../health/constants/grpc-client.constants';

@Injectable()
export class TransactionService implements OnModuleInit {
  private transactionGrpcService: TransactionGrpcService;

  constructor(
    @Inject(TRANSACTIONS_SERVICE)
    private readonly transactionsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.transactionGrpcService =
      this.transactionsClient.getService<TransactionGrpcService>(
        'TransactionService',
      );
  }

  pingTransactions(): Observable<PingResponse> {
    return this.transactionGrpcService.ping({});
  }

  recordTransaction(data: RecordTransactionRequest): Observable<RecordTransactionResponse> {
    return this.transactionGrpcService.recordTransaction(data);
  }

  getTransactionsByAccount(data: GetTransactionsByAccountRequest): Observable<GetTransactionsByAccountResponse> {
    return this.transactionGrpcService.getTransactionsByAccount(data);
  }

  getTransactionsBySymbol(data: GetTransactionsBySymbolRequest): Observable<GetTransactionsBySymbolResponse> {
    return this.transactionGrpcService.getTransactionsBySymbol(data);
  }

  getTransactionBucketSummary(data: GetTransactionBucketSummaryRequest): Observable<GetTransactionBucketSummaryResponse> {
    return this.transactionGrpcService.getTransactionBucketSummary(data);
  }
}
