import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
    imports: [UsersModule],
    controllers: [UsersController],
    providers: [PrismaService, UsersService],
})
export class UsersModule { }
