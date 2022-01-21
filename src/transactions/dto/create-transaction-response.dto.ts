import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionResponseDto {
  @ApiProperty({ description: 'Код результата', default: 201 })
  @IsNotEmpty()
  code: number;

  @ApiProperty({ description: 'ID созданной транзакции' })
  @IsNotEmpty()
  transactionID: string;
}
