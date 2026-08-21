import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { Task } from '@prisma/client';

import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    public constructor(private readonly tasksService: TasksService) {}

    @Post()
    public create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    public findAll(@Query() query: FindTasksQueryDto): Promise<Task[]> {
        return this.tasksService.findAll(query);
    }

    @Patch(':id/status')
    public updateStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        return this.tasksService.updateStatus(id, updateTaskStatusDto);
    }

    @Delete(':id')
    public remove(@Param('id') id: string): Promise<Task> {
        return this.tasksService.remove(id);
    }
}
