import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @GrpcMethod('TransactionService', 'Ping')
  ping(): { message: string } {
    return this.transactionsService.ping();
  }
}
