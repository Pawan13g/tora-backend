import { DashTaskService } from './dash-task.service';

import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Query,
    Delete,
    ValidationPipe,
    ParseIntPipe,
    BadRequestException

} from '@nestjs/common';
import { AppResponse } from 'shared/contants/types';
import { DashboardTask, Prisma } from '@prisma/client';
import { response } from 'shared/utils/gen-response';
import { CreateDashTask } from './dash-task.dto'
@Controller('dash-task')
export class DashTaskController {
    constructor(private readonly dashTaskService: DashTaskService) { }

    @Post("")
    async createDashTask(@Body(ValidationPipe) data: CreateDashTask): Promise<AppResponse<DashboardTask>> {

        try {
            const task = await this.dashTaskService.createDashTask(data);
            return response("dashboard task created", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Get("")
    async findDashTasks(@Query("name") name: string): Promise<AppResponse<DashboardTask>> {

        try {
            // FILTERS
            const where: Prisma.DashboardTaskWhereInput = { isActive: true, name: { contains: name } }

            // ACTUAL TASKS 
            const data = await this.dashTaskService.getDashTasks({ where });

            return response(data.length ? "matches found" : "No match found", { pageCount: null, data })

        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Get("/all")
    async getAllDashTask(@Query("pageIndex", ParseIntPipe) pageIndex: number, @Query("pageSize", ParseIntPipe) pageSize: number): Promise<AppResponse<DashboardTask>> {

        try {
            // TOTAL TASKS
            const totalTasks = await this.dashTaskService.getDashTasksCount();

            // ACTUAL TASKS 
            const data = await this.dashTaskService.getDashTasks({ skip: (pageIndex - 1) * pageSize, take: pageSize, where: { isActive: true }, orderBy: { createdAt: 'desc' } });
            // TOTAL PAGES OF RESPONS
            const pageCount = Math.ceil(totalTasks / pageSize)

            return response(data.length ? "All dashboard tasks" : "No tasks found", { pageCount, data })
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }


    @Get("/:id")
    async getSingleDashTask(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<DashboardTask>> {

        try {
            const task = await this.dashTaskService.findDashTask({ id, isActive: true });

            return response(task ? "dashboard task found" : "No task found", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }
    }

    @Patch("/:id")
    async updateDashTaskInfo(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) data: any): Promise<AppResponse<DashboardTask>> {

        try {
            const task = await this.dashTaskService.updateDashTask({ id, data });
            return response("dashboard task updated", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Delete(":id")
    async deleteDashTask(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<DashboardTask>> {

        try {
            const task = await this.dashTaskService.deleteDashTask(id);
            return response("dashboard task deleted", task)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }
}
