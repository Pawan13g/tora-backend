// NestJS COMMON MODULES 
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

// Nest JWT TOKEN SERVICE 
import { JwtService } from '@nestjs/jwt';

// PASSWORD HASHING LIB
import * as bcrypt from 'bcrypt';

// DATABASE ORM UTILS
import { Prisma, User } from '@prisma/client';

// DTO (Data Transfer Object SCHEMA
import { CreateUser } from './auth.dto';

// MODULE SERVICES
import { PrismaService } from 'shared/services/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    /**
    * Registers a new user by creating a new record in the database.
    * @param createUser - DTO containing user details for registration.
    * @returns Promise<User> - Newly created user record.
    * @throws BadRequestException if unique email is not provided or something goes wrong.
    */

    async registerUser({
        name,
        email,
        password,
        bank,
        accountNo,
        ifsc,
        sponserCode,
        phoneNo,
    }: CreateUser): Promise<User> {

        try {
            const hsdPswd = await bcrypt.hash(password, 10);

            return await this.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hsdPswd,
                    bank,
                    accountNo,
                    ifsc,
                    sponserCode,
                    phoneNo,
                },
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException("There is a unique constraint violation, a new user cannot be created with this email");
                }
            }
            else throw new BadRequestException("Error while creating user");
        }
    }


    /**
     * Authenticates a user by verifying credentials and generating a JWT token.
     * @param email - email of the user to authenticate.
     * @param password - Password of the user to authenticate.
     * @returns Promise<{ accessToken: string }> - JWT access token upon successful authentication.
     * @throws UnauthorizedException if authentication fails.
     */

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        const isAuthSuccess = await bcrypt.compare(password, user.password)

        if (!isAuthSuccess)
            throw new UnauthorizedException("Invalid email or password");

        // Sign JWT Token
        return await this.jwtService.signAsync({ id: user.id, username: user.name });
    }

    /**
     * Return Authorized user by verifying JWT Token
     * @param {string} authToken - authToken of the user to authenticate.
     * @returns Promise<{ user: User }> - JWT access token upon successful authentication.
     * @throws UnauthorizedException if authentication fails.
     */

    async getAuthUser(authToken: string): Promise<User> {

        try {

            const payload = await this.jwtService.verifyAsync(
                authToken,
                {
                    secret: process.env.JWT_SECRET_KEY
                }
            );

            const { id } = payload;

            if (!id) throw new UnauthorizedException("Invalid token");

            const user = await this.prisma.user.findUnique({ where: { id } });

            if (!user) throw new UnauthorizedException("User not found");

            delete user.password;

            return user;

        } catch (error) {
            throw new UnauthorizedException("Invalid auth token");
        }
    }
}