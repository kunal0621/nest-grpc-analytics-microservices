import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class GetTransactionsBySymbolParamDto {
  @ApiProperty({
    description: 'Account ID to get transactions for',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;
}

export class GetTransactionsBySymbolDto {
  @ApiProperty({
    description: 'Stock symbol to filter by',
    type: String,
    example: 'AAPL',
  })
  @IsString()
  symbol: string;
}
