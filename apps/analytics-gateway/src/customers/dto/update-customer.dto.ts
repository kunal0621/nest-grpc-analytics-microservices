import { OmitType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends OmitType(CreateCustomerDto, [
  'username',
] as const) {}
