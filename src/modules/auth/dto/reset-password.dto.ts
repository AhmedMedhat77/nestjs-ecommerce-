import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(5)
  otp: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
