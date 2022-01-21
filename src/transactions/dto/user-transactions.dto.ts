import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortType } from '../enums/sort-types.enum';

export class UserTransactionsDto {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNotEmpty()
  userID: string;

  @ApiProperty({
    description: 'Номер страницы(максимум 10 транзакций на каждой)',
    default: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Сортировка по дате(asc/desc)',
    enum: SortType,
    default: 'desc',
  })
  sort: string;
}
