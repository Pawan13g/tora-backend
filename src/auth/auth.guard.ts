
// NestJS COMMON MODULES 
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

// NestJS CORE MODULES 
import { Reflector } from '@nestjs/core';

// Nest JWT TOKEN SERVICE 
import { JwtService } from '@nestjs/jwt';

// MODULE SERVICES
import { PrismaService } from 'shared/services/prisma.service';

// TYPES
import { Request } from 'express';

// CONSTANTS
import { IS_PUBLIC_KEY } from 'shared/utils/decorators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    /**
     * Global guard for all the endpoints that verify user is authorized to access the endpoints or not
     * @returns  Boolean - true if user is authorized, false if user is not authorized
     * @throws UnauthorizedException - if user is not authorized to access the endpoints
     */

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("Auth token not found");
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET_KEY
                }
            );

            const { id } = payload;

            request["user"] = await this.prisma.user.findUnique({ where: { id } });

        } catch {
            throw new UnauthorizedException("Unauthorized");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}