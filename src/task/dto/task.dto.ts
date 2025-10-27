import { IsEnum, IsOptional, IsString } from "class-validator";
import { Priority } from "generated/prisma";

export class TaskDto {
    @IsString()
    title: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsOptional()
    isCompleted?: boolean;
    @IsOptional()
    @IsEnum(Priority, {message: 'priority must be one of LOW, MEDIUM, HIGH'})
    priority?: Priority;
}