import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { SessionModule } from '@/session/session.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from '@/config/jwt.config';

@Module({
  imports: [UsersModule, SessionModule, ConfigModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: JwtConfigService
  })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
