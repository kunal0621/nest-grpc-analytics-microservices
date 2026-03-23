import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../health.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../constants/grpc-client.constants';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly appService: HealthService) {}

  @Get('accounts/ping')
  @ApiOperation({ summary: 'Ping the Accounts microservice via gRPC' })
  @ApiResponse({ status: 200, description: 'Accounts service is reachable.' })
  pingAccounts(): Observable<PingResponse> {
    return this.appService.pingAccounts();
  }

  @Get('customers/ping')
  @ApiOperation({ summary: 'Ping the Customers microservice via gRPC' })
  @ApiResponse({ status: 200, description: 'Customers service is reachable.' })
  pingCustomers(): Observable<PingResponse> {
    return this.appService.pingCustomers();
  }

  @Get('transactions/ping')
  @ApiOperation({ summary: 'Ping the Transactions microservice via gRPC' })
  @ApiResponse({
    status: 200,
    description: 'Transactions service is reachable.',
  })
  pingTransactions(): Observable<PingResponse> {
    return this.appService.pingTransactions();
  }
}
