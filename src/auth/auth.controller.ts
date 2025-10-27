import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { type Response } from 'express';
import { type Request } from 'express';
import { Auth } from '../decorators/auth.decorator';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('login')
    async login(@Body(new ValidationPipe()) dto: AuthDto, @Res({passthrough: true}) res: Response) {
        const { refresh_token, ...response } = await this.authService.login(dto);
        this.authService.addRefreshTokenToResponse(res, refresh_token);
        return response
    }
    @Post('register')
    async register(@Body(new ValidationPipe())  dto: AuthDto, @Res({passthrough: true}) res: Response) {
        const {refresh_token, ...response} = await this.authService.register(dto);
        this.authService.addRefreshTokenToResponse(res, refresh_token);
        return response;
    }
   @Post('logout')
   async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
     const refreshTokenFromReq = req.cookies[this.authService.REFRESH_TOKEN_COOKIE_NAME];
     if(!refreshTokenFromReq){
       this.authService.removeRefreshTokenFromResponse(res);
       throw new UnauthorizedException('No refresh token found');
     }
     this.authService.removeRefreshTokenFromResponse(res);
     return { message: 'Logged out successfully' };
   }
   @Post('login/access-token')
   async getNewToken(@Req() req: Request, @Res({passthrough: true}) res: Response) {
       const refreshTokenFromReq = req.cookies[this.authService.REFRESH_TOKEN_COOKIE_NAME];
       if(!refreshTokenFromReq){
        this.authService.removeRefreshTokenFromResponse(res);
        throw new UnauthorizedException('No refresh token found');
       }
       const {refresh_token, ...response} = await this.authService.getNewTokens(refreshTokenFromReq);
       this.authService.addRefreshTokenToResponse(res, refresh_token);
       return response ;
   }
}
