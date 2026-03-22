import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  ping(): { message: string } {
    return { message: 'Transactions service is up and running!' };
  }
}
