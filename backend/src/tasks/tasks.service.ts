import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
    public constructor(private readonly prisma: PrismaService) {}

    public create(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.prisma.task.create({
            data: createTaskDto,
            include: { assignee: true },
        });
    }

    public findAll(query: FindTasksQueryDto): Promise<Task[]> {
        return this.prisma.task.findMany({
            where: {
                status: query.status,
                assigneeId: query.assigneeId,
            },
            include: { assignee: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    public async updateStatus(
        id: string,
        updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        await this.findOneOrThrow(id);

        return this.prisma.task.update({
            where: { id },
            data: { status: updateTaskStatusDto.status },
            include: { assignee: true },
        });
    }

    public async remove(id: string): Promise<Task> {
        await this.findOneOrThrow(id);

        return this.prisma.task.delete({ where: { id } });
    }

    private async findOneOrThrow(id: string): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return task;
    }
}
