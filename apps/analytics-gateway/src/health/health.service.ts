import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AccountGrpcService,
  ACCOUNTS_SERVICE,
  CustomerGrpcService,
  CUSTOMERS_SERVICE,
  PingResponse,
  TransactionGrpcService,
  TRANSACTIONS_SERVICE,
} from './constants/grpc-client.constants';

@Injectable()
export class HealthService implements OnModuleInit {
  private accountGrpcService: AccountGrpcService;
  private customerGrpcService: CustomerGrpcService;
  private transactionGrpcService: TransactionGrpcService;

  constructor(
    @Inject(ACCOUNTS_SERVICE)
    private readonly accountsClient: ClientGrpc,
    @Inject(CUSTOMERS_SERVICE)
    private readonly customersClient: ClientGrpc,
    @Inject(TRANSACTIONS_SERVICE)
    private readonly transactionsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.accountGrpcService =
      this.accountsClient.getService<AccountGrpcService>('AccountService');
    this.customerGrpcService =
      this.customersClient.getService<CustomerGrpcService>('CustomerService');
    this.transactionGrpcService =
      this.transactionsClient.getService<TransactionGrpcService>(
        'TransactionService',
      );
  }

  pingAccounts(): Observable<PingResponse> {
    return this.accountGrpcService.ping({});
  }

  pingCustomers(): Observable<PingResponse> {
    return this.customerGrpcService.ping({});
  }

  pingTransactions(): Observable<PingResponse> {
    return this.transactionGrpcService.ping({});
  }
}
