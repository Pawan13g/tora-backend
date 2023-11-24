import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from '@prisma/client';
import { IsString, IsEmail, IsBoolean, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * @description class for data tranfer object for login to validate incoming body 
 */

export class CreatePanelTask {

    @IsString()
    name: string;

    @IsString()
    amount: string;

    @IsString()
    kpi: string;

    @IsString()
    t_link: string;

    @IsBoolean()
    isActive: boolean = true;
}

export class UpdatePanelTask extends PartialType(CreatePanelTask) { }
