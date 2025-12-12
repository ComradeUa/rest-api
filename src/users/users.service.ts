import { AuthDto } from '@/auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, include: { tasks: true } });
    return user;
  }
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    return user;
  }
  async createUser(dto: AuthDto) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: '',
        password: await hash(dto.password),
      },
      include: { tasks: true },
    });
    return user;
  }
  async getProfile(id: string) {
    const profile = await this.getById(id);
    if (!profile) return null;
    const totalTasks = profile.tasks.length;
    const completedTasks = await this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true,
      },
    });
    const todayStart = startOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 7));
    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString(),
        },
      },
    });
    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString(),
        },
      },
    });
    const { password, ...data } = profile;
    return {
      user: data,
      statistics: [
        { label: 'Total Tasks', value: totalTasks },
        { label: 'Completed Tasks', value: completedTasks },
        { label: "Today's Tasks", value: todayTasks },
        { label: "This Week's Tasks", value: weekTasks },
      ],
    };
  }
  async update(id: string, dto: UserDto) {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        name: true,
        email: true,
      },
    });
  }
}
