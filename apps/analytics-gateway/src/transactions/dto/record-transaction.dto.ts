import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, Min } from 'class-validator';

export class RecordTransactionDto {
  @ApiProperty({
    description: 'Account ID for the transaction',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;

  @ApiProperty({
    description: 'Stock symbol',
    type: String,
    example: 'AAPL',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Number of shares',
    type: Number,
    example: 100,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Price per share',
    type: String,
    example: '150.50',
  })
  @IsString()
  price: string;

  @ApiProperty({
    description: 'Transaction type',
    type: String,
    enum: ['buy', 'sell'],
    example: 'buy',
  })
  @IsEnum(['buy', 'sell'])
  transaction_code: string;
}
