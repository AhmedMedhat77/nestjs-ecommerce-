import { ROLE_ENUM } from 'src/types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class RegisterDTO {
  private readonly _id: ObjectId;
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  address: string;
  @IsEnum(ROLE_ENUM)
  @IsNotEmpty()
  role: ROLE_ENUM;
}
