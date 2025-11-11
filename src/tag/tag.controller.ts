import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './dto/tag.dto';
import { Auth } from '@/decorators/auth.decorator';

@Controller('user/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {
  }
  @Post('create/:taskId')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async createTag(@Body() tagDTO: TagDto, @Param('taskId') taskId: string) {
    return this.tagService.createTag(tagDTO, taskId);
  }
  @Get('all')
  @Auth()
  async getAllTags() {
    return this.tagService.getAllTags();
  }
  @Get(':id')
  @Auth()
  async getTagById(@Param('id') id: string) {
    return this.tagService.getTagByIds(id);
  }
  @Post('update/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  async updateTag(
    @Param('id') id: string,
    @Body() tagDto: TagDto,
  ) {
    return this.tagService.updateTag(id, tagDto.name, tagDto.color);
  }
  @Delete(':id')
  @HttpCode(200)
  @Auth()
  async deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
