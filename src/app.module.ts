import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    TaskModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
  ],
})
export class AppModule {}
