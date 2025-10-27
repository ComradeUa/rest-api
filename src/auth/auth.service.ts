import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { UsersService } from '@/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { SessionService } from '@/session/session.service';
@Injectable()
export class AuthService {
  EXPIRES_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly sessionService: SessionService
  ) {}
  async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    return user;
  }
  async issueToken(userId: string) {
    const data = { id: userId };
    const access_token = await this.jwtService.signAsync(data, { expiresIn: '1h' });
    const refresh_token = await this.jwtService.signAsync(data, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }
  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = await this.issueToken(user.id);
    await this.sessionService.createSession(user.id, tokens.refresh_token);
    return {
      user,
      ...tokens,
    };
  }
  async register(dto: AuthDto) {
    const userExist = await this.userService.getByEmail(dto.email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.userService.createUser(dto);
    const { password, ...user } = newUser;
    const tokens = await this.issueToken(user.id);
    await this.sessionService.createSession(user.id, tokens.refresh_token);
    return {
      user,
      ...tokens,
    };
  }
  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });
  }
    async getNewTokens(refreshToken: string) {
        const session = await this.sessionService.getSessionByRefreshToken(refreshToken);
        if(!session){
          throw new UnauthorizedException('Invalid session');
        }
        const result = await this.jwtService.verifyAsync(refreshToken);
        if(!result){
          throw new UnauthorizedException('Invalid refresh token');
        }
        const date_user  = await this.userService.getById(result.id);
        await this.sessionService.deleteSession(refreshToken)
        if(!date_user) {
          throw new UnauthorizedException('User not found');
        };

        const { password, ...user } = date_user;
        const tokens = await this.issueToken(user.id);
        await this.sessionService.createSession(user.id, tokens.refresh_token);
        return {
            user,
            ...tokens
        }
    }

}

