import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsIP, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty({ example: "ali", description: "Foydalanuvchining familiyasi" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: "ali@example.com", description: "Foydalanuvchining elektron pochtasi" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    
    @ApiProperty({ example: "1234", description: "Foydalanuvchining paroli" })
    @IsNotEmpty()
    password: string;


    @ApiProperty({ example: Role.USER, description: "Foydalanuvchi roli" })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

}


export class loginUserDto {
    @ApiProperty({ example: "ali@example.com", description: "Foydalanuvchi email manzili" })
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty({ example: "1234", description: "Foydalanuvchi paroli" })
    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    password: string;

    @ApiProperty({ example: '222.666.22' })
    ip: string;

    }






    export class SessionDto {
        @IsString()
        @IsNotEmpty()
        @IsIP()
        ip: string;
    }
    
    
    export class SendOtpDto {
        @IsNotEmpty()
        @IsEmail()
        email: string;
      }