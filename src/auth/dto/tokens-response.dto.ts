import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({
    description:
      'Токен используется для авторизации запросов на защищенные роуты',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'Токен используется для обновления пары access/refresh токенов',
  })
  refreshToken: string;
}
