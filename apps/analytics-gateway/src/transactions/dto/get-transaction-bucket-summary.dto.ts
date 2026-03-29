import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetTransactionBucketSummaryParamDto {
  @ApiProperty({
    description: 'Account ID to get summary for',
    type: Number,
    example: 12345,
  })
  @IsInt()
  @Min(1)
  account_id: number;
}
