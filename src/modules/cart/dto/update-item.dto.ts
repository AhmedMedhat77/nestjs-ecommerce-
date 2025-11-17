import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

