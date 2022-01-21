import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IncomingHttpHeaders } from 'http';
const ms = require('ms');
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/users.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import { RefreshDto } from './dto/refresh.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  private async issueTokenPair(userId: string): Promise<TokensResponseDto> {
    const accessToken = await this.jwtService.signAsync(
      {},
      {
        subject: userId,
        expiresIn: this.configService.get<string>('accessTokenExpiresIn'),
      },
    );

    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  async login(
    user: User,
    headers: IncomingHttpHeaders,
    ip: string,
  ): Promise<TokensResponseDto> {
    const { accessToken, refreshToken } = await this.issueTokenPair(user.id);
    const refreshTokenExpiresIn = new Date(
      Date.now() + ms(this.configService.get<string>('refreshTokenExpiresIn')),
    );

    await this.sessionModel.create({
      user: user.id,
      userAgent: headers['user-agent'],
      refreshTokenExpiresIn,
      refreshToken,
      ip,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshDto: RefreshDto,
    headers: IncomingHttpHeaders,
    ip: string,
  ): Promise<TokensResponseDto> {
    const { refreshToken } = refreshDto;

    const oldSessionDocument = await this.sessionModel
      .findOne({
        refreshToken,
      })
      .exec();

    if (!oldSessionDocument) {
      throw new NotFoundException('Session not found');
    }

    await oldSessionDocument.remove();

    const isRefreshTokenExpired =
      Date.now() > oldSessionDocument.refreshTokenExpiresIn.getTime();

    if (isRefreshTokenExpired) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.issueTokenPair(oldSessionDocument.user.toString());

    const refreshTokenExpiresIn = new Date(
      Date.now() + ms(this.configService.get<string>('refreshTokenExpiresIn')),
    );

    await this.sessionModel.create({
      user: oldSessionDocument.user,
      refreshToken: newRefreshToken,
      userAgent: headers['user-agent'],
      refreshTokenExpiresIn,
      ip,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);

    if (!user) return null;

    const isPasswordsMatch = await (user as UserDocument).comparePassword(
      password,
    );

    if (!isPasswordsMatch) return null;

    return user;
  }

  deleteAllUserSessions(userId: MongooseSchema.Types.ObjectId) {
    return this.sessionModel.deleteMany({ user: userId }).exec();
  }
}
