import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CustomerGrpcService,
  GetCustomerRequest,
  GetCustomerResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  ListCustomersRequest,
  ListCustomersResponse,
  AddAccountToCustomerRequest,
  AddAccountToCustomerResponse,
  RemoveAccountFromCustomerRequest,
  RemoveAccountFromCustomerResponse,
} from './constants/grpc-client.constants';
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

  getCustomer(data: GetCustomerRequest): Observable<GetCustomerResponse> {
    return this.customerGrpcService.getCustomer(data);
  }

  createCustomer(
    data: CreateCustomerRequest,
  ): Observable<CreateCustomerResponse> {
    return this.customerGrpcService.createCustomer(data);
  }

  updateCustomer(
    data: UpdateCustomerRequest,
  ): Observable<UpdateCustomerResponse> {
    return this.customerGrpcService.updateCustomer(data);
  }

  listCustomers(data: ListCustomersRequest): Observable<ListCustomersResponse> {
    return this.customerGrpcService.listCustomers(data);
  }

  addAccountToCustomer(
    data: AddAccountToCustomerRequest,
  ): Observable<AddAccountToCustomerResponse> {
    return this.customerGrpcService.addAccountToCustomer(data);
  }

  removeAccountFromCustomer(
    data: RemoveAccountFromCustomerRequest,
  ): Observable<RemoveAccountFromCustomerResponse> {
    return this.customerGrpcService.removeAccountFromCustomer(data);
  }
}
