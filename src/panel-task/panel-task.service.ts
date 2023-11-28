import { BadRequestException, Injectable } from '@nestjs/common';
import { PanelTask, Prisma } from '@prisma/client';
import { PrismaService } from 'shared/services/prisma.service';
import { CreatePanelTask, UpdatePanelTask } from './panel-task.dto';

@Injectable()
export class PanelTaskService {
    constructor(private prisma: PrismaService) { }


    /**
    * @description Service for getting totel number of counts in database
    */

    async getPanelTaskCount(where?: Prisma.PanelTaskWhereInput): Promise<Partial<Prisma.PrismaPromise<number>>> {
        return this.prisma.panelTask.count({ where });
    }

    /**
    * @description Service for finding tasks form data base
    * @param {any} searchQuery
    */

    async findTasks(
        searchQuery: any,
    ): Promise<PanelTask[] | []> {
        const task = this.prisma.panelTask.findMany({
            where: searchQuery,
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

        if (!task) throw Error('task not found');

        return task;
    }

    async findTask(
        panelTaskWhereUniqueInput: Prisma.PanelTaskWhereUniqueInput,
    ): Promise<Partial<PanelTask> | null> {
        const task = this.prisma.panelTask.findUnique({
            where: panelTaskWhereUniqueInput,
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

        if (!task) throw Error('task not found');

        return task;
    }


    /**
     * @description Service for getting multiple tasks form data base
     */

    async getTasks(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PanelTaskWhereUniqueInput;
        where?: Prisma.PanelTaskWhereInput;
        orderBy?: Prisma.PanelTaskOrderByWithRelationInput;
    }): Promise<Partial<any[]>> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.panelTask.findMany({
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
                t_link: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }


    /**
    * Cretes a new task by creating a new record in the database.
    * @param createTask - DTO containing Task details.
    * @returns Promise<PanelTask> - Newly created task record.
    * @throws BadRequestException if something goes wrong.
    */

    async createTask({
        name,
        amount,
        kpi,
        t_link,

    }: CreatePanelTask): Promise<PanelTask> {

        try {

            return await this.prisma.panelTask.create({
                data: {
                    name,
                    amount,
                    kpi,
                    t_link
                },
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException("There is a unique constraint violation, a new task cannot be created");
                }
            }
            else throw new BadRequestException("Error while creating task");
        }
    }


    /**
     * @description Service for updating a existing task in the database
     * @param {number} id
     * @param {UpdatePanelTask} as Body of the request
    */

    async updateTask(params: { id: number; data: UpdatePanelTask }): Promise<PanelTask> {
        const { id, data } = params;
        return this.prisma.panelTask.update({
            where: { id },
            data,
        });
    }

    /**
    * @description Service for deleting a task from the database
    * @param {number} id
   */

    async deleteTask(id: number): Promise<PanelTask> {
        const task = await this.prisma.panelTask.findUnique({ where: { id } });

        if (!task) return Promise.reject();

        // make task inactive
        task.isActive = false;

        return this.prisma.panelTask.update({ where: { id }, data: task });
    }

}
