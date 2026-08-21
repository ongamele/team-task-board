import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    public constructor(private readonly usersService: UsersService) {}

    @Get()
    public findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
