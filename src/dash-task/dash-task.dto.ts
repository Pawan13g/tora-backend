import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, IsBase64, IsNotEmpty, Min, IsBoolean, ValidateNested, IsNotEmptyObject, IsNumber, IsEnum } from 'class-validator';

/**
 * @description class for data tranfer object for dashboard tasks to validate incoming body 
 */

class picture {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    base64: string;
}

export class CreateDashTask {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    amount: string;

    @IsString()
    @IsNotEmpty()
    desc: string;

    @Type(() => picture)
    @ValidateNested({ each: true })
    picture: picture;

    @IsString()
    @IsNotEmpty()
    kpi: string;

    @IsString()
    @IsNotEmpty()
    t_link: string;

    @IsBoolean()
    isActive: boolean = true;
}

export class SubmitDashTask {

    @IsNumber() @Min(1)
    taskId: number;


    @IsNumber() @Min(1)
    userId: number;

    @Type(() => picture)
    @ValidateNested({ each: true })
    @IsNotEmptyObject()
    picture: picture;

}


export class UpdateTaskStatus {

    @IsEnum($Enums.status)
    status: string;
}


export class UpdateDashTask extends PartialType(CreateDashTask) { }
