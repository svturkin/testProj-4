import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class GetFullAmountResponseDto {
  @ApiProperty({ description: 'Дата транзакций в формате yyyy-mm-dd' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Сумма транзакций' })
  @IsNotEmpty()
  sum: number;
}
