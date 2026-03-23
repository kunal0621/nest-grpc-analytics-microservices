import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AccountGrpcService } from './constants/grpc-client.constants';
import { ACCOUNTS_SERVICE } from '../health/constants/grpc-client.constants';
import { PingResponse } from '../health/constants/grpc-client.constants';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountGrpcService: AccountGrpcService;

  constructor(
    @Inject(ACCOUNTS_SERVICE)
    private readonly accountsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.accountGrpcService =
      this.accountsClient.getService<AccountGrpcService>('AccountService');
  }

  pingAccounts(): Observable<PingResponse> {
    return this.accountGrpcService.ping({});
  }
}
