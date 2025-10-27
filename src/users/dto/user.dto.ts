import { IsEmail,  IsOptional, IsString, Min, MinLength } from "class-validator";

export class UserDto {
    @IsEmail()
    @IsOptional()
    email?: string;
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    @MinLength(6, {message: 'password must be at least 6 characters long'})
    password?: string;

}