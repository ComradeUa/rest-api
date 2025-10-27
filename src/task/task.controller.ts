import { Body, Controller, Get, HttpCode, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
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
  @Get()
  @Auth()
  async getTasks(@CurrentUser('id') userId: string) {
      return this.taskService.getTasksByUserId(userId);
  }
}
