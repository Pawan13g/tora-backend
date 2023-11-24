import { $Enums } from '@prisma/client';
import { IsString, IsEmail, IsBoolean, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * @description class for data tranfer object for login to validate incoming body 
 */

export class CreateUser {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    cnfrmpswd: string;

    @IsString()
    password: string;

    @IsString() @MinLength(10) @MaxLength(10)
    phoneNo: string;

    @IsString()
    ifsc: string;

    @IsString()
    accountNo: string;

    @IsString()
    bank: string;

    @IsString()
    sponserCode: string;

    @IsEnum($Enums.role, { message: "valid role is required" })
    role: $Enums.role = "USER";

    @IsBoolean()
    isActive: boolean = true;
}

export class LoginUser {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

}