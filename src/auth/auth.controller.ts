import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  HttpCode,
  UsePipes,
  Headers,
  Ip,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { LoginDto } from './dto/login.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthService } from './auth.service';
import { User } from 'src/users/schemas/users.schema';

@ApiTags('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    type: TokensResponseDto,
    description: 'Аутентификация завершена успешно',
  })
  @ApiUnauthorizedResponse({
    description:
      'Не удалось пройти аутентификацию. Неправильный логин или пароль',
  })
  @ApiOperation({ summary: 'Аутентификация' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Headers() headers: IncomingHttpHeaders,
    @Ip() ip: string,
  ): Promise<TokensResponseDto> {
    const user = <User>req.user;

    return this.authService.login(user, headers, ip);
  }

  @ApiOkResponse({
    type: TokensResponseDto,
    description: 'Пара access/refresh токенов успешно обновлена',
  })
  @ApiUnauthorizedResponse({
    description: 'Сессия истекла, необходимо заново пройти аутентификацию',
  })
  @ApiNotFoundResponse({
    description: 'Сессия с данным refresh токеном не найдена',
  })
  @ApiOperation({ summary: 'Обновление пары access/refresh токенов' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: RefreshDto,
    @Headers() headers: IncomingHttpHeaders,
    @Ip() ip: string,
  ): Promise<TokensResponseDto> {
    return this.authService.refresh(refreshDto, headers, ip);
  }
}
