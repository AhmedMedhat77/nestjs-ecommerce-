import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(5)
  otp: string;
}
