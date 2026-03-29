import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListCustomersDto {
  @ApiProperty({
    description: 'Number of customers to fetch (e.g. 10)',
    type: Number,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Cursor to fetch the next set of customers',
    type: String,
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
