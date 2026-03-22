import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  ping(): { message: string } {
    return { message: 'Customers service is up and running!' };
  }
}
