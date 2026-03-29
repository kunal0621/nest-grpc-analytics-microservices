import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class AddProductToAccountParamDto {
  @ApiProperty({
    description: 'Account ID to modify',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;
}

export class AddProductToAccountDto {
  @ApiProperty({
    description: 'Product to add',
    type: String,
    example: 'InvestmentStock',
  })
  @IsString()
  product: string;
}
