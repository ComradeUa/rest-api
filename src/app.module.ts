import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
@Module({
  imports: [AuthModule, UsersModule, TaskModule, ConfigModule.forRoot()],
})
export class AppModule {}
