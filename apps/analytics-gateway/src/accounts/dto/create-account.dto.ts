import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsString, Min, ArrayNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Unique account ID',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;

  @ApiProperty({
    description: 'Trading limit for the account',
    type: Number,
    example: 10000,
  })
  @IsInt()
  @Min(0)
  limit: number;

  @ApiProperty({
    description: 'Array of permitted products',
    type: [String],
    example: ['CurrencyService', 'Derivatives'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  products: string[];
}