import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class GetFullAmountDto {
  @ApiProperty({ description: 'Дата транзакций в формате yyyy-mm-dd' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
