import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
    let service: TasksService;
    let prisma: {
        task: {
            create: jest.Mock;
            findMany: jest.Mock;
            findUnique: jest.Mock;
            update: jest.Mock;
            delete: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            task: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('creates a task including its assignee', async () => {
            const createdTask = { id: '1', title: 'Write tests' };
            prisma.task.create.mockResolvedValue(createdTask);

            const result = await service.create({ title: 'Write tests' });

            expect(prisma.task.create).toHaveBeenCalledWith({
                data: { title: 'Write tests' },
                include: { assignee: true },
            });
            expect(result).toBe(createdTask);
        });
    });

    describe('findAll', () => {
        it('filters tasks by status and assignee', async () => {
            prisma.task.findMany.mockResolvedValue([]);

            await service.findAll({
                status: TaskStatus.todo,
                assigneeId: 'user-1',
            });

            expect(prisma.task.findMany).toHaveBeenCalledWith({
                where: { status: TaskStatus.todo, assigneeId: 'user-1' },
                include: { assignee: true },
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('updateStatus', () => {
        it('updates the status of an existing task', async () => {
            prisma.task.findUnique.mockResolvedValue({ id: '1' });
            const updatedTask = { id: '1', status: TaskStatus.done };
            prisma.task.update.mockResolvedValue(updatedTask);

            const result = await service.updateStatus('1', {
                status: TaskStatus.done,
            });

            expect(prisma.task.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { status: TaskStatus.done },
                include: { assignee: true },
            });
            expect(result).toBe(updatedTask);
        });

        it('throws NotFoundException when the task does not exist', async () => {
            prisma.task.findUnique.mockResolvedValue(null);

            await expect(
                service.updateStatus('missing', { status: TaskStatus.done }),
            ).rejects.toThrow(NotFoundException);
            expect(prisma.task.update).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('deletes an existing task', async () => {
            prisma.task.findUnique.mockResolvedValue({ id: '1' });
            const deletedTask = { id: '1' };
            prisma.task.delete.mockResolvedValue(deletedTask);

            const result = await service.remove('1');

            expect(prisma.task.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(result).toBe(deletedTask);
        });

        it('throws NotFoundException when the task does not exist', async () => {
            prisma.task.findUnique.mockResolvedValue(null);

            await expect(service.remove('missing')).rejects.toThrow(
                NotFoundException,
            );
            expect(prisma.task.delete).not.toHaveBeenCalled();
        });
    });
});
