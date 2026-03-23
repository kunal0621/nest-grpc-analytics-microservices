import { Controller, Get } from '@nestjs/common';
import { CustomerService } from '../customer.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

@ApiTags('Customers')
@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('customers/ping')
  @ApiOperation({ summary: 'Ping the Customers microservice via gRPC' })
  @ApiResponse({ status: 200, description: 'Customers service is reachable.' })
  pingCustomers(): Observable<PingResponse> {
    return this.customerService.pingCustomers();
  }
}
