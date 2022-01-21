import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CurrencyCode } from '../enum/currency.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Логин' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Код валюты пользователя', enum: CurrencyCode })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
