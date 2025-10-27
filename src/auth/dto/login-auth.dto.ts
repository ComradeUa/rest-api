import { IsEmail, IsString, isString, MinLength } from "class-validator";

export class LoginAuthDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6, {message: 'password must be at least 6 characters long'})
  password: string;
}