import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @GrpcMethod('CustomerService', 'Ping')
  ping(): { message: string } {
    return this.customersService.ping();
  }
}
