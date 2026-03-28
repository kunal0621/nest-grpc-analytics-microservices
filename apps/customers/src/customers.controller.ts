import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CustomersService } from './customers.service';
import {
  type GetCustomerRequest,
  type GetCustomerResponse,
  type CreateCustomerRequest,
  type CreateCustomerResponse,
  type UpdateCustomerRequest,
  type UpdateCustomerResponse,
  type ListCustomersRequest,
  type ListCustomersResponse,
  type AddAccountToCustomerRequest,
  type AddAccountToCustomerResponse,
  type RemoveAccountFromCustomerRequest,
  type RemoveAccountFromCustomerResponse,
} from '../../analytics-gateway/src/customers/constants/grpc-client.constants';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @GrpcMethod('CustomerService', 'Ping')
  ping(): { message: string } {
    return this.customersService.ping();
  }

  @GrpcMethod('CustomerService', 'GetCustomer')
  getCustomer(data: GetCustomerRequest): Promise<GetCustomerResponse> {
    return this.customersService.getCustomer(data);
  }

  @GrpcMethod('CustomerService', 'CreateCustomer')
  createCustomer(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    return this.customersService.createCustomer(data);
  }

  @GrpcMethod('CustomerService', 'UpdateCustomer')
  updateCustomer(data: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    return this.customersService.updateCustomer(data);
  }

  @GrpcMethod('CustomerService', 'ListCustomers')
  listCustomers(data: ListCustomersRequest): Promise<ListCustomersResponse> {
    return this.customersService.listCustomers(data);
  }

  @GrpcMethod('CustomerService', 'AddAccountToCustomer')
  addAccountToCustomer(
    data: AddAccountToCustomerRequest,
  ): Promise<AddAccountToCustomerResponse> {
    return this.customersService.addAccountToCustomer(data);
  }

  @GrpcMethod('CustomerService', 'RemoveAccountFromCustomer')
  removeAccountFromCustomer(
    data: RemoveAccountFromCustomerRequest,
  ): Promise<RemoveAccountFromCustomerResponse> {
    return this.customersService.removeAccountFromCustomer(data);
  }
}
