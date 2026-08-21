import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    public constructor(private readonly prisma: PrismaService) {}

    public findAll(): Promise<User[]> {
        return this.prisma.user.findMany({ orderBy: { name: 'asc' } });
    }
}
