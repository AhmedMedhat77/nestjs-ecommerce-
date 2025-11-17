import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

