import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  NotContains,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @MaxLength(20)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
