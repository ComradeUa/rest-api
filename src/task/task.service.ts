import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}
    async getTasksByUserId(userId: string) {
       const task = await this.prisma.task.findMany({
            where: { userId: userId },
            include: { tag: true },
            orderBy: { createdAt: 'desc' },
        });
        if(!task){
            return [];
        }
        return task;
    }
    async createTask(userId: string, taskDto: TaskDto) {
        const task = await this.prisma.task.create({
            data: {
               title: taskDto.title,
               description: taskDto.description,
               priority: taskDto.priority,
               userId: userId
            },
        });
        return task;
    }
    async updateTask(taskId: string, userId: string, taskDto: TaskDto) {
        const {  tags,...data } = taskDto;
        const updatedTask = await this.prisma.task.update({
            where: { id: taskId, userId: userId },
            data,
        });
        return updatedTask;
    }
    async deleteTask(taskId: string, userId: string) {
    const existing = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existing) throw new NotFoundException('Task not found');

    await this.prisma.task.deleteMany({
      where: { id: taskId, userId },
    });
    return { message: 'Task deleted successfully' };  
  }
}
