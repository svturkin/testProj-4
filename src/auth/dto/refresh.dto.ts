import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description:
      'Токен используется для получения новой пары access/refresh токенов',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
