import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsNotEmpty()
  password: string;
}
