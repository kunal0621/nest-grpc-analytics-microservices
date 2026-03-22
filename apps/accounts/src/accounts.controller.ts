import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AccountsService } from './accounts.service';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @GrpcMethod('AccountService', 'Ping')
  ping(): { message: string } {
    return this.accountsService.ping();
  }
}
