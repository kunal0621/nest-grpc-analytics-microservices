import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  ping(): { message: string } {
    return { message: 'Accounts service is up and running!' };
  }
}
