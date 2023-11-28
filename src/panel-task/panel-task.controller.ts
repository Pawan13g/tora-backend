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
import { PanelTask, Prisma } from '@prisma/client';
import { response } from 'shared/utils/gen-response';
import { CreatePanelTask, UpdatePanelTask } from './panel-task.dto';
import { skip } from 'node:test';

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

    @Get("")
    async findTasks(@Query("name") name: string): Promise<AppResponse<PanelTask>> {

        try {
            // FILTERS
            const where: Prisma.PanelTaskWhereInput = { isActive: true, name: { contains: name } }

            // ACTUAL TASKS 
            const data = await this.panelTaskService.getTasks({ where });

            return response(data.length ? "matches found" : "No match found", { pageCount: null, data })

        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Get("/all")

    async getAllPanelTask(@Query("pageIndex", ParseIntPipe) pageIndex: number, @Query("pageSize", ParseIntPipe) pageSize: number): Promise<AppResponse<PanelTask>> {

        try {
            // TOTAL TASKS
            const totalTasks = await this.panelTaskService.getPanelTaskCount();

            // ACTUAL TASKS 
            const data = await this.panelTaskService.getTasks({ skip: (pageIndex - 1) * pageSize, take: pageSize, where: { isActive: true }, orderBy: { createdAt: 'desc' } });
            // TOTAL PAGES OF RESPONS
            const pageCount = Math.round(totalTasks / pageSize)

            return response(data.length ? "All tasks" : "No tasks found", { pageCount, data })
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }


    @Get("/:id")
    async getSinglePanelTask(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<PanelTask>> {

        try {
            const task = await this.panelTaskService.findTask({ id, isActive: true });

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
