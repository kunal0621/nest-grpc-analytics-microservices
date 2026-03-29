import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateAccountLimitParamDto {
  @ApiProperty({
    description: 'Account ID to update',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;
}

export class UpdateAccountLimitDto {
  @ApiProperty({
    description: 'New trading limit',
    type: Number,
    example: 15000,
  })
  @IsInt()
  @Min(0)
  new_limit: number;
}
