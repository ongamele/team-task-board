import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const backendRoot = path.join(__dirname, '..');
const testDbFile = path.join(backendRoot, 'test.db');
const testDatabaseUrl = 'file:./test.db';

describe('Tasks (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;
    let assigneeId: string;

    beforeAll(() => {
        if (fs.existsSync(testDbFile)) {
            fs.rmSync(testDbFile);
        }

        execSync('npx prisma migrate deploy', {
            cwd: backendRoot,
            env: { ...process.env, DATABASE_URL: testDatabaseUrl },
            stdio: 'inherit',
        });

        process.env.DATABASE_URL = testDatabaseUrl;
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        prisma = moduleFixture.get(PrismaService);
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
        const assignee = await prisma.user.create({ data: { name: 'Ada' } });
        assigneeId = assignee.id;
    });

    afterEach(async () => {
        await app.close();
    });

    afterAll(() => {
        if (fs.existsSync(testDbFile)) {
            fs.rmSync(testDbFile);
        }
    });

    it('creates, lists, filters, updates, and deletes a task', async () => {
        const createResponse = await request(app.getHttpServer())
            .post('/tasks')
            .send({ title: 'Write e2e tests', assigneeId })
            .expect(201);

        expect(createResponse.body).toMatchObject({
            title: 'Write e2e tests',
            status: TaskStatus.todo,
            assigneeId,
        });
        const taskId = createResponse.body.id as string;

        const listResponse = await request(app.getHttpServer())
            .get('/tasks')
            .query({ status: TaskStatus.todo, assigneeId })
            .expect(200);

        expect(listResponse.body).toHaveLength(1);
        expect(listResponse.body[0].id).toBe(taskId);

        const updateResponse = await request(app.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .send({ status: TaskStatus.done })
            .expect(200);

        expect(updateResponse.body.status).toBe(TaskStatus.done);

        await request(app.getHttpServer())
            .delete(`/tasks/${taskId}`)
            .expect(200);

        await request(app.getHttpServer())
            .get('/tasks')
            .expect(200)
            .expect([]);
    });

    it('rejects a task without a title', async () => {
        await request(app.getHttpServer())
            .post('/tasks')
            .send({ description: 'missing title' })
            .expect(400);
    });

    it('returns 404 when updating the status of a missing task', async () => {
        await request(app.getHttpServer())
            .patch('/tasks/does-not-exist/status')
            .send({ status: TaskStatus.done })
            .expect(404);
    });
});
