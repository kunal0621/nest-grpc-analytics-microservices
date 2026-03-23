import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../account.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

@ApiTags('Accounts')
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('accounts/ping')
  @ApiOperation({ summary: 'Ping the Accounts microservice via gRPC' })
  @ApiResponse({ status: 200, description: 'Accounts service is reachable.' })
  pingAccounts(): Observable<PingResponse> {
    return this.accountService.pingAccounts();
  }
}
