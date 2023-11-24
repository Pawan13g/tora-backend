import { $Enums } from "@prisma/client";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, IsEmail, IsBoolean, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';
import { CreateUser } from "src/auth/auth.dto";


/**
 * @description  data tranfer object for update user to validate incoming body 
 */


export class UpdateUser extends PartialType(CreateUser) { }