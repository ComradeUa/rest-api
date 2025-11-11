import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { CurrentUser } from '@/decorators/user.decorator';
import { Auth } from '@/decorators/auth.decorator';

@Controller('user/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  async createTask(@Body() taskDto: TaskDto, @CurrentUser('id') userId: string) {
      return this.taskService.createTask(userId, taskDto);
  }
  @Get('get-tasks')
  @Auth()
  async getTasks(@CurrentUser('id') userId: string) {
      return this.taskService.getTasksByUserId(userId);
  }
  @Delete(':taskId')
  @HttpCode(200)
  @Auth()
  async deleteTask(@Param('taskId') taskId: string, @CurrentUser('id') userId: string) {
      return this.taskService.deleteTask(taskId, userId);
  }
}
