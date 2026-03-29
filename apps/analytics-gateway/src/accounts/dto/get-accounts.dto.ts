import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetAccountsDto {
  @ApiPropertyOptional({
    description: 'Limit to numbers <= 9000',
    type: Number,
    example: 9000,
    default: 9000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9000)
  limit?: number = 9000;
}
