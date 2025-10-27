import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  register(registerDto: RegisterDto): RegisterDto {
    const token = this.configService.get<string>('TOKEN_SECRET');
    
    return registerDto;
  }
}
