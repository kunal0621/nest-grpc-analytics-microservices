import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../transaction.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

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
}
