import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortType } from '../enums/sort-types.enum';

export class GetFullAmountDto {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNotEmpty()
  userID: string;

  @ApiProperty({ description: 'Сортировка по дате(asc/desc)', enum: SortType })
  sort?: string;
}
