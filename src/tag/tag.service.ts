import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TagDto } from './dto/tag.dto';

@Injectable()
export class TagService {
    constructor (private readonly prisma: PrismaService) {}

    async createTag(tagDTO: TagDto, task_id:string) {
        const existingTag = await this.prisma.tag.findFirst({
            where: {
                name: tagDTO.name,
            },
        });
        if (existingTag) {
            throw new Error('Tag with this name already exists');
        }
        const tags = await this.prisma.tag.create({
            data: {
                name: tagDTO.name,
                task_id: task_id,
                color: tagDTO.color ?? "#999999",
            },
        });
        return {message: 'Tag created successfully'};
    }

    async getAllTags() {
        return this.prisma.tag.findMany({
            orderBy:{name: 'asc'}
        });
    }
    async getTagByIds(tagId: string) {
        const tag = await this.prisma.tag.findUnique({
            where: {
                id: tagId,
            }
        });
        if(!tag){
            throw new NotFoundException('Tag not found');
        }
        return tag;
    }

    async deleteTag(tagId: string) {
        const tag = await this.prisma.tag.delete({
            where: {
                id: tagId,
            },
        });
        return { message: 'Tag deleted successfully' };
    }
    async updateTag(tagId: string, name: string, color?: string) {
        const updatedTag = await this.prisma.tag.update({
            where: {
                id: tagId,
            },
            data: {
                name,
                color,
            },
        });
        if(!updatedTag){
            throw new NotFoundException('Tag not found');
        }
        return updatedTag;
    }
}
