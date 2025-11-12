import { Body, Controller, Get, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '@/decorators/auth.decorator';
import { Request } from 'express';
import { CurrentUser } from '@/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user/profile')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Auth()
    @Get()
    async getProfile(@CurrentUser('id') id: string) {
        return this.usersService.getProfile(id);
    }
    @Auth()
    @Put()
    @UsePipes(new ValidationPipe())
    async updateProfile(@CurrentUser('id') id: string, @Body() userDto: UserDto) {
        return this.usersService.updateUser(id, userDto);
    }
}
