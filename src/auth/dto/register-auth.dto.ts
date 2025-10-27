import { IsEmail, IsNumberString, IsString, MinLength, } from "class-validator";

export class RegisterAuthDto {
    @IsEmail()
    email: string;

    @IsString({message: 'password must be a string'})
    @MinLength(6, {message: 'password must be at least 6 characters long'})
    password: string;
    
    @IsString({message: 'name must be a string'})
    name: string;
}