import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindTasksQueryDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    public status?: TaskStatus;

    @IsOptional()
    @IsString()
    public assigneeId?: string;
}
