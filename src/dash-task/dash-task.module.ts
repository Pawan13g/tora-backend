import { Module } from '@nestjs/common';
import { DashTaskController } from './dash-task.controller';
import { DashTaskService } from './dash-task.service';
import { PrismaService } from 'shared/services/prisma.service';

@Module({
  controllers: [DashTaskController],
  providers: [PrismaService, DashTaskService]
})
export class DashTaskModule { }
