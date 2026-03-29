import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddAccountDto {
  @ApiProperty({
    description:
      'The unique numeric ID of the account to associate with this customer',
  })
  @IsInt()
  @IsNotEmpty()
  account_id: number;
}
