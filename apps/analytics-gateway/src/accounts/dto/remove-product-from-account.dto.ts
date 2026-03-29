import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class RemoveProductFromAccountDto {
  @ApiProperty({
    description: 'Account ID to modify',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;

  @ApiProperty({
    description: 'Product to remove',
    type: String,
    example: 'InvestmentStock',
  })
  @IsString()
  product: string;
}