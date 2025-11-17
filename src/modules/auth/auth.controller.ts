import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';

import { AuthService } from './auth.service';
import { VerifyOtpDTO } from './dto/verifyOTP.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth() {
    // This route initiates Google OAuth flow
    // Passport will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthCallback(@Req() req: any) {
    const { token, user } = await this.authService.googleLogin(req.user);
    return {
      message: 'Login successful',
      data: {
        token,
        user,
      },
    };
  }
}
