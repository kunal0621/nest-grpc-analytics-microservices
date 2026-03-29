import { Controller, Get, Query } from '@nestjs/common';
import { AccountService } from '../account.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';
import { GetAccountsResponse } from '../constants/grpc-client.constants';
import { GetAccountsDto } from '../dto/get-accounts.dto';

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

  @Get('accounts')
  @ApiOperation({ summary: 'Fetch all accounts with a limit filter' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit to numbers <= 9000',
    example: 9000,
  })
  @ApiResponse({
    status: 200,
    description: 'List of accounts matching the limit filter.',
  })
  getAccounts(@Query() query: GetAccountsDto): Observable<GetAccountsResponse> {
    return this.accountService.getAccounts(query.limit ?? 9000);
  }
}
