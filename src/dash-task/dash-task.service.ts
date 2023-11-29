import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DashboardTask, DashboardTaskSubmission, Prisma } from '@prisma/client';
import * as fs from 'fs';
import { PrismaService } from 'shared/services/prisma.service';
import { CreateDashTask, SubmitDashTask, UpdateTaskStatus } from './dash-task.dto';
import * as path from 'path';
import { getUniqueFileName } from 'shared/utils/utils';
import { response } from 'shared/utils/gen-response';

@Injectable()
export class DashTaskService {
    constructor(private prisma: PrismaService) { }

    /**
   * @description Service for getting totel number of dashboard tasks count in database
   */

    async getDashTasksCount(where?: Prisma.DashboardTaskWhereInput): Promise<Partial<Prisma.PrismaPromise<number>>> {
        return this.prisma.dashboardTask.count({ where });
    }

    /**
    * @description Service for finding dashboard tasks form data base
    * @param {any} searchQuery
    */

    async findDashTasks(
        searchQuery: any,
    ): Promise<DashboardTask[] | []> {
        const task = this.prisma.dashboardTask.findMany({
            where: searchQuery,
            select: {
                id: true,
                name: true,
                amount: true,
                kpi: true,
                desc: true,
                picture: true,
                t_link: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!task) throw Error('dashboard task not found');

        return task;
    }

    async findDashTask(
        dashTaskWhereUniqueInput: Prisma.DashboardTaskWhereUniqueInput,
    ): Promise<Partial<DashboardTask> | null> {
        const task = this.prisma.dashboardTask.findUnique({
            where: dashTaskWhereUniqueInput,
            select: {
                id: true,
                name: true,
                amount: true,
                kpi: true,
                t_link: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!task) throw Error('dashboard task not found');

        return task;
    }


    /**
     * @description Service for getting multiple dashboard tasks form data base
     */

    async getDashTasks(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.DashboardTaskWhereUniqueInput;
        where?: Prisma.DashboardTaskWhereInput;
        orderBy?: Prisma.DashboardTaskOrderByWithRelationInput;
    }): Promise<Partial<any[]>> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.dashboardTask.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                amount: true,
                kpi: true,
                desc: true,
                picture: true,
                t_link: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }


    /**
    * Cretes a new task by creating a new dashboard task in the database.
    * @param createDashTask - DTO containing dashboard Task details.
    * @returns Promise<DashTask> - Newly created dashboard task record.
    * @throws BadRequestException if something goes wrong.
    */

    async createDashTask({
        name,
        amount,
        kpi,
        t_link,
        picture,
        desc
    }: CreateDashTask): Promise<DashboardTask> {

        try {

            let relativePath: string | null = null;

            if (picture) {
                const pictureBuffer = Buffer.from(picture.base64.split(",")[1], 'base64');
                const pictureName = getUniqueFileName(picture.name)
                relativePath = `images/${pictureName}`
                const picturePath = path.join(process.cwd(), 'uploads', relativePath);
                fs.writeFileSync(picturePath, pictureBuffer);
            }


            return await this.prisma.dashboardTask.create({
                data: {
                    name,
                    amount,
                    kpi,
                    t_link,
                    picture: relativePath,
                    desc
                },
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException("There is a unique constraint violation, a new task cannot be created");
                }
            }
            else throw new BadRequestException(error.message);
        }
    }


    /**
     * @description Service for updating a existing dashboard task in the database
     * @param {number} id
     * @param {UpdateDashTask} as Body of the request
    */

    async updateDashTask(params: { id: number; data: any }): Promise<DashboardTask> {
        const { id, data } = params;
        return this.prisma.dashboardTask.update({
            where: { id },
            data,
        });
    }


    /**
    * @description Service for deleting a dashboard task from the database
    * @param {number} id
    */

    async deleteDashTask(id: number): Promise<DashboardTask> {
        const task = await this.prisma.dashboardTask.findUnique({ where: { id } });

        if (!task) new Error("dashboard task now found")

        // make task inactive
        task.isActive = false;

        return this.prisma.dashboardTask.update({ where: { id }, data: task });
    }



    /**
     * @description Service for getting totel count of submissions of dashboard tasks in database
     */

    async getDashTaskSubmissionCount(where?: Prisma.DashboardTaskSubmissionWhereInput): Promise<Partial<Prisma.PrismaPromise<number>>> {
        return this.prisma.dashboardTaskSubmission.count({ where });
    }



    /**
    * @description Service for getting multiple dashboard task submissions form data base
    */

    async getDashTaskSubmissions(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.DashboardTaskSubmissionWhereUniqueInput;
        where?: Prisma.DashboardTaskSubmissionWhereInput;
        orderBy?: Prisma.DashboardTaskSubmissionOrderByWithRelationInput;
    }): Promise<Partial<any[]>> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.dashboardTaskSubmission.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    /**
     * @description Service for submitting a dashboard task request in the database
     * @param {SubmitDashTask}  as Body of the request
     */

    async submitDashTask({ userId, taskId, picture }: SubmitDashTask): Promise<DashboardTaskSubmission> {

        const pictureBuffer = Buffer.from(picture.base64.split(",")[1], 'base64');
        const pictureName = getUniqueFileName(picture.name)
        const relativePath = `images/submissions/dashboard_task/${pictureName}`
        const picturePath = path.join(process.cwd(), 'uploads', relativePath);
        fs.writeFileSync(picturePath, pictureBuffer);


        try {

            return await this.prisma.dashboardTaskSubmission.create({ data: { taskId, userId, picture: relativePath } });

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {

                if (error.code === 'P2002') {
                    throw new BadRequestException("There is a unique constraint violation, on userId, one user can submit a task only once");
                }
                else if (error.code === 'P2003') {
                    throw new BadRequestException("Foreign key constraint failed on the field taskId or userId make sure both of the records exists");
                }
            }

            throw new BadRequestException(response("Error while submitting the task", null, false))

        }

    }


    /**
    * @description Service for updateing a submission status of dashboard task 
    * @param {TaskId} as param of request
    * @param {status} as body of request 
    */

    async updateTaskStatus({ id, body: { status } }: { id: number, body: UpdateTaskStatus }): Promise<DashboardTaskSubmission> {

        const task = await this.prisma.dashboardTaskSubmission.findUnique({ where: { id } })

        if (!task) new NotFoundException(`task submission for ${id} is now found`)

        return await this.prisma.dashboardTaskSubmission.update({ where: { id }, data: { status: status as any } })

    }








}
