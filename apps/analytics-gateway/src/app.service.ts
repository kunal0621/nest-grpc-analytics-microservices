import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  ACCOUNTS_SERVICE,
  CUSTOMERS_SERVICE,
  TRANSACTIONS_SERVICE,
} from './grpc-client.constants';

export interface PingResponse {
  message: string;
}

interface AccountGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}

interface CustomerGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}

interface TransactionGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}

@Injectable()
export class AppService implements OnModuleInit {
  private accountGrpcService: AccountGrpcService;
  private customerGrpcService: CustomerGrpcService;
  private transactionGrpcService: TransactionGrpcService;

  constructor(
    @Inject(ACCOUNTS_SERVICE) private readonly accountsClient: object,
    @Inject(CUSTOMERS_SERVICE) private readonly customersClient: object,
    @Inject(TRANSACTIONS_SERVICE) private readonly transactionsClient: object,
  ) {}

  onModuleInit() {
    const accountsClient = this.accountsClient as ClientGrpc;
    const customersClient = this.customersClient as ClientGrpc;
    const transactionsClient = this.transactionsClient as ClientGrpc;

    this.accountGrpcService =
      accountsClient.getService<AccountGrpcService>('AccountService');
    this.customerGrpcService =
      customersClient.getService<CustomerGrpcService>('CustomerService');
    this.transactionGrpcService =
      transactionsClient.getService<TransactionGrpcService>(
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
