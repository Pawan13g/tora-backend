import { PanelTaskService } from './panel-task.service';

import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Patch,
    Query,
    Delete,
    ValidationPipe,
    ParseIntPipe,
    BadRequestException

} from '@nestjs/common';
import { AppResponse } from 'shared/contants/types';
import { PanelTask } from '@prisma/client';
import { response } from 'shared/utils/gen-response';
import { CreatePanelTask, UpdatePanelTask } from './panel-task.dto';

@Controller('panel-task')
export class PanelTaskController {
    constructor(private readonly panelTaskService: PanelTaskService) { }


    @Post("")
    async createPanelTask(@Body(ValidationPipe) data: CreatePanelTask): Promise<AppResponse<PanelTask>> {

        try {
            const task = await this.panelTaskService.createTask(data);
            return response("task created", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Get("/all")

    async getAllPanelTask(@Query("pageIndex", ParseIntPipe) pageIndex: number, @Query("pageSize", ParseIntPipe) pageSize: number): Promise<AppResponse<PanelTask>> {

        try {
            const totalTasks = await this.panelTaskService.getPanelTaskCount();
            const tasks = await this.panelTaskService.getTasks({ skip: (pageIndex - 1) * pageSize, take: pageSize, where: { isActive: true } });

            const tasksPageCount = Math.round(totalTasks / pageSize)

            return response(tasks.length ? "All tasks" : "No tasks found", { tasksPageCount, tasks })
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }


    @Get("/:id")
    async getSinglePanelTask(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<PanelTask>> {

        try {
            const task = await this.panelTaskService.getTask({ id, isActive: true });

            return response(task ? "task found" : "No task found", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }
    }

    @Patch("/:id")
    async updatePanelTaskInfo(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) data: UpdatePanelTask): Promise<AppResponse<PanelTask>> {

        try {
            const task = await this.panelTaskService.updateTask({ id, data });
            return response("task updated", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Delete(":id")
    async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<PanelTask>> {

        try {
            const task = await this.panelTaskService.deleteTask(id);
            return response("task deleted", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

}
