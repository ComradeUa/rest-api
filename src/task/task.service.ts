import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}
    async getTasksByUserId(userId: string) {
        const tasks = await this.prisma.task.findMany({ where: { userId } });
        return tasks;
    }
    async createTask(userId: string, taskDto: TaskDto) {
        const task = await this.prisma.task.create({
            data: {
               ...taskDto,
               userId: userId,
            },
        });
        return task;
    }
    async updateTask(taskId: string, userId: string, taskDto: TaskDto) {
        const updatedTask = await this.prisma.task.update({
            where: { id: taskId, userId: userId },
            data: taskDto
        });
        return updatedTask;
    }
    async deleteTask(taskId: string, userId: string) {
        await this.prisma.task.delete({
            where: { id: taskId, userId: userId },
        });
        return { message: 'Task deleted successfully' };
    }
}
