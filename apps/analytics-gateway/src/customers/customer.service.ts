import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CustomerGrpcService } from './constants/grpc-client.constants';
import { CUSTOMERS_SERVICE } from '../health/constants/grpc-client.constants';
import { PingResponse } from '../health/constants/grpc-client.constants';

@Injectable()
export class CustomerService implements OnModuleInit {
  private customerGrpcService: CustomerGrpcService;

  constructor(
    @Inject(CUSTOMERS_SERVICE)
    private readonly customersClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.customerGrpcService =
      this.customersClient.getService<CustomerGrpcService>('CustomerService');
  }

  pingCustomers(): Observable<PingResponse> {
    return this.customerGrpcService.ping({});
  }
}
