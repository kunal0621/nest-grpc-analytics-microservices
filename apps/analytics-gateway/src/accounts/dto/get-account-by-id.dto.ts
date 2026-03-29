import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetAccountByIdDto {
  @ApiProperty({
    description: 'Account ID to retrieve',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;
}