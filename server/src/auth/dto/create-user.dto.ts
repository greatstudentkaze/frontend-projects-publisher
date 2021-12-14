import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    fullName: string;

    @IsString()
    activationCode: string;

    @IsString()
    @MinLength(8)
    password: string;
}