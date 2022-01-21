import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TransactionType } from '../enums/transaction-types.enum';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Дата транзакции' })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: 'ID создателя транзакции' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Сумма транзакции' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Тип транзакции', enum: TransactionType })
  @IsNotEmpty()
  type: string;
}
