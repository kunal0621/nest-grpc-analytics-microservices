import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from '../transaction.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';
import {
  RecordTransactionResponse,
  GetTransactionsByAccountResponse,
  GetTransactionsBySymbolResponse,
  GetTransactionBucketSummaryResponse,
} from '../constants/grpc-client.constants';
import { RecordTransactionDto } from '../dto/record-transaction.dto';
import { GetTransactionsByAccountDto } from '../dto/get-transactions-by-account.dto';

@ApiTags('Transactions')
@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('transactions/ping')
  @ApiOperation({ summary: 'Ping the Transactions microservice via gRPC' })
  @ApiResponse({
    status: 200,
    description: 'Transactions service is reachable.',
  })
  pingTransactions(): Observable<PingResponse> {
    return this.transactionService.pingTransactions();
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Record a new transaction' })
  @ApiBody({ type: RecordTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction recorded successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transaction data.',
  })
  recordTransaction(
    @Body() data: RecordTransactionDto,
  ): Observable<RecordTransactionResponse> {
    return this.transactionService.recordTransaction(data);
  }

  @Get('transactions/account/:account_id')
  @ApiOperation({ summary: 'Get transactions for an account' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: String,
    description: 'Start date filter (ISO format)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: String,
    description: 'End date filter (ISO format)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully.',
  })
  getTransactionsByAccount(
    @Param('account_id', ParseIntPipe) account_id: number,
    @Query() query: GetTransactionsByAccountDto,
  ): Observable<GetTransactionsByAccountResponse> {
    return this.transactionService.getTransactionsByAccount({
      account_id,
      ...query,
    });
  }

  @Get('transactions/account/:account_id/symbol/:symbol')
  @ApiOperation({ summary: 'Get transactions for an account by symbol' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiParam({
    name: 'symbol',
    type: String,
    description: 'Stock symbol',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully.',
  })
  getTransactionsBySymbol(
    @Param('account_id', ParseIntPipe) account_id: number,
    @Param('symbol') symbol: string,
  ): Observable<GetTransactionsBySymbolResponse> {
    return this.transactionService.getTransactionsBySymbol({
      account_id,
      symbol,
    });
  }

  @Get('transactions/account/:account_id/summary')
  @ApiOperation({ summary: 'Get transaction bucket summary for an account' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction summary retrieved successfully.',
  })
  getTransactionBucketSummary(
    @Param('account_id', ParseIntPipe) account_id: number,
  ): Observable<GetTransactionBucketSummaryResponse> {
    return this.transactionService.getTransactionBucketSummary({ account_id });
  }
}
