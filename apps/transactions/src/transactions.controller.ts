import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import type {
  RecordTransactionRequest,
  RecordTransactionResponse,
  GetTransactionsByAccountRequest,
  GetTransactionsByAccountResponse,
  GetTransactionsBySymbolRequest,
  GetTransactionsBySymbolResponse,
  GetTransactionBucketSummaryRequest,
  GetTransactionBucketSummaryResponse,
} from '../../analytics-gateway/src/transactions/constants/grpc-client.constants';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @GrpcMethod('TransactionService', 'Ping')
  ping(): { message: string } {
    return this.transactionsService.ping();
  }

  @GrpcMethod('TransactionService', 'RecordTransaction')
  async recordTransaction(
    data: RecordTransactionRequest,
  ): Promise<RecordTransactionResponse> {
    return this.transactionsService.recordTransaction(data);
  }

  @GrpcMethod('TransactionService', 'GetTransactionsByAccount')
  async getTransactionsByAccount(
    data: GetTransactionsByAccountRequest,
  ): Promise<GetTransactionsByAccountResponse> {
    return this.transactionsService.getTransactionsByAccount(data);
  }

  @GrpcMethod('TransactionService', 'GetTransactionsBySymbol')
  async getTransactionsBySymbol(
    data: GetTransactionsBySymbolRequest,
  ): Promise<GetTransactionsBySymbolResponse> {
    return this.transactionsService.getTransactionsBySymbol(data);
  }

  @GrpcMethod('TransactionService', 'GetTransactionBucketSummary')
  async getTransactionBucketSummary(
    data: GetTransactionBucketSummaryRequest,
  ): Promise<GetTransactionBucketSummaryResponse> {
    return this.transactionsService.getTransactionBucketSummary(data);
  }
}
