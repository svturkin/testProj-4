import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../enums/transaction-types.enum';

export interface TransactionDocument extends Document, Transaction {}

@Schema({ collection: 'transactions' })
export class Transaction {
  @ApiProperty({ description: 'Дата транзакции' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ description: 'ID создателя транзакции' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  user_id: string;

  @ApiProperty({ description: 'Сумма транзакции' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    description: 'Тип транзакции(income/expense)',
    enum: TransactionType,
  })
  @Prop({ required: true, enum: TransactionType })
  type: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
