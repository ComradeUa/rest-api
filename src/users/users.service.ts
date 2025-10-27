import { AuthDto } from '@/auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, include: {tasks: true} });
    return user;
  }
  async getById(id: string) {
   const user = await this.prisma.user.findUnique({where: {id}, include: {tasks: true}});
   return user;
  }
  async createUser(dto:AuthDto){
    const user =  await this.prisma.user.create({
      data:{
        email: dto.email,
        name: '',
        password: await hash(dto.password),
      },
      include: {tasks: true}
    });
    return user;
  }
  async getProfile(id:string){
   const profile = await this.getById(id);
   if (!profile) return null;
   const {password, ...data} = profile;
   return {
     ...data
   };
  }
  async updateUser(id:string, userDto: UserDto){
    if(userDto.password){
      userDto = {
        ...userDto,
        password: await hash(userDto.password),
      }
    }
    const updatedUser = await this.prisma.user.update({
      where: {id},
      data: userDto,
    });
    const {password, ...rest} = updatedUser;
    return rest;
  }
}
