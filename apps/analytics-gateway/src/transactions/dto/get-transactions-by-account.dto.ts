import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class GetTransactionsByAccountDto {
  @ApiPropertyOptional({
    description: 'Start date filter (ISO format)',
    type: String,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date filter (ISO format)',
    type: String,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
