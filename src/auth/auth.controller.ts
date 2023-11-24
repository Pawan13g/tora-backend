import { Body, Controller, Post, HttpCode, Get, Headers, Request, HttpStatus, ValidationPipe, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, LoginUser } from './auth.dto';
import { response } from 'shared/utils/gen-response';
import { AppResponse } from 'shared/contants/types';
import { User } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';
import { Public } from 'shared/utils/decorators';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }


    @Post("register") @Public()
    async registerUser(@Body(ValidationPipe) data: CreateUser): Promise<AppResponse<User>> {

        const { name, email, password, bank, accountNo, ifsc, sponserCode, phoneNo, cnfrmpswd } = data;

        if (!name || !email || !password || !cnfrmpswd || !bank || !accountNo || !ifsc || !sponserCode || !phoneNo)
            return response("unsufficient parameters", null, false)

        if (password !== cnfrmpswd)
            return response("both passwords does not match", null, false)

        try {
            const user = await this.authService.registerUser(data);
            return response("user created", user)
        } catch (error) {
            throw new BadRequestException(response(error.message, null, false))
        }
    }


    @HttpCode(HttpStatus.OK) @Post('login') @Public()
    async signIn(@Body(ValidationPipe) data: LoginUser): Promise<AppResponse<{ access_code: string }>> {

        const { email, password } = data;

        try {

            const access_code = await this.authService.signIn(email, password);
            return response("user authorized", `Bearer ${access_code}`)

        } catch (error) {

            if (error instanceof UnauthorizedException)
                throw new UnauthorizedException(response(error.message, null, false))

            else throw new BadRequestException("Error while authenticating")
        }

    }

    @Get('me')
    public async getAuthUser(@Request() req): Promise<AppResponse<User>> {
        return response("user profile", req.user)
    }
}