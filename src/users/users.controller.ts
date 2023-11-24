import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Patch,
    Delete,
    ValidationPipe,
    ParseIntPipe,
    BadRequestException

} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { response } from 'shared/utils/gen-response';
import { AppResponse } from 'shared/contants/types';
import { UpdateUser } from './users.dto';


@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get("user/:id")
    async getSingleUser(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<User>> {

        try {
            const user = await this.usersService.getUser({ id });
            return response("user found", user)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }
    }


    @Patch("user/:id")
    async updateUserInfo(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) data: UpdateUser): Promise<AppResponse<User>> {

        try {
            const user = await this.usersService.updateUser({ id, data });
            return response("user info updated", user)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }

    @Delete("user/:id")
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<AppResponse<User>> {

        try {
            const user = await this.usersService.deleteUser(id);
            return response("user deleted", user)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }

    }
}
