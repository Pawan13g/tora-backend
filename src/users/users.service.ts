import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../shared/services/prisma.service';
import { Prisma, User } from '@prisma/client';

import { UpdateUser } from './users.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * @description Service for getting single user form data base
     * @param {number} id
     */

    async getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<Partial<User> | null> {
        const user = this.prisma.user.findUnique({
            where: userWhereUniqueInput,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                sponserCode: true,
                bank: true,
                accountNo: true,
                ifsc: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) throw Error('user not found');

        return user;
    }

    /**
     * @description Service for getting multiple users form data base
     */

    async getUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<Partial<any[]>> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                sponserCode: true,
                bank: true,
                accountNo: true,
                ifsc: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    /**
     * @description Service for updating a existing user in the database
     * @param {number} id
     * @param {UpdateUser} as Body of the request
    */

    async updateUser(params: { id: number; data: UpdateUser }): Promise<User> {
        const { id, data } = params;
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    /**
     * @description Service for deleting a user from the database
     * @param {number} id
    */

    async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) return Promise.reject();

        // make user inactive
        user.isActive = false;

        return this.prisma.user.update({ where: { id }, data: user });
    }
}
