import { IsOptional, IsString } from "class-validator";

export class TagDto {
   @IsString()
   name: string;

   @IsOptional()
   @IsString()
   color?: string;
}
