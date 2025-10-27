import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(201)
  register(@Body() registerDto: RegisterDto) {
    if (registerDto.email === 'test@test.com') {
      throw new BadRequestException('Email already exists');
    }
    return 'User registered successfully !';
  }
}
