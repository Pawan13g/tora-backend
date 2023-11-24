import { Module } from '@nestjs/common';
import { PanelTaskService } from './panel-task.service';
import { PanelTaskController } from './panel-task.controller';
import { PrismaService } from 'shared/services/prisma.service';

@Module({
  providers: [PrismaService, PanelTaskService],
  controllers: [PanelTaskController]
})
export class PanelTaskModule {}
