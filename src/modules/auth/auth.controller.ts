import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';

import { AuthService } from './auth.service';
import { VerifyOtpDTO } from './dto/verifyOTP.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
// @UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  // @HttpCode(201)
  async register(@Body() registerDto: RegisterDTO) {
    return await this.authService.register(registerDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDTO) {
    await this.authService.verifyEmail(verifyOtpDto);
    return {
      message: 'Email verified successfully',
    };
  }
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const { token, user } = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      data: {
        token,
        user,
      },
    };
  }
}
