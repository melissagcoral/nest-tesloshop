import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @ApiProperty({
        description: 'email (unique)',
        nullable: false,
        minLength: 6,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'password',
        nullable: false,
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'fullName',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    fullName: string;

}