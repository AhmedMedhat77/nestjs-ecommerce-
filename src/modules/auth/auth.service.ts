import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { RegisterCustomerFactory } from './factory/registerFactory';
import { User, UserRepository } from '@models/index';
import { comparePassword, generateOTP, sendEmail } from 'src/utils';
import { VerifyOtpDTO } from './dto/verifyOTP.dto';
import { VerifyFactory } from './factory/verifyFactory';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { LoginFactory } from './factory/loginFactory';
import { TokenService } from 'src/utils/token';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ResetPasswordFactory } from './factory/reset-password.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly registerCustomerFactory: RegisterCustomerFactory,
    private readonly verifyFactory: VerifyFactory,
    private readonly loginFactory: LoginFactory,
    private readonly tokenService: TokenService,
    private readonly resetPasswordFactory: ResetPasswordFactory,
  ) {}
  async register(registerDTO: RegisterDTO): Promise<Partial<User>> {
    const user = await this.registerCustomerFactory.createUser(registerDTO);
    // check if the user already exists
    const existingUser = await this.userRepository.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // send email to the user
    try {
      if (!user.otpExpiry || !user.otp) {
        throw new BadRequestException('OTP is not generated or expired');
      }

      await sendEmail({
        from: 'E-commerce <noreply@e-commerce.com>',
        to: user.email,
        subject: 'Welcome to E-commerce',
        text: `Welcome to E-commerce. Your OTP is ${user.otp}. It will expire in ${new Date(user.otpExpiry).getTime() - new Date().getTime()} minutes.`,
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to send email: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
        error instanceof Error ? error.stack : undefined,
      );
    }

    const newUser = await this.userRepository.create(user);
    const {
      otp,
      otpExpiry,
      credentialsUpdatedAt,
      isVerified,
      isEmailVerified,
      isPhoneVerified,
      isAddressVerified,
      ...userData
    } = newUser.toObject();
    return userData;
  }

  async verifyEmail(verifyOtpDto: VerifyOtpDTO) {
    const FactoryUser = this.verifyFactory.createUser(verifyOtpDto);

    // 1 find user first by email to send custom error message
    const user = await this.userRepository.findOne({
      email: FactoryUser.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1.1 check if user is already verified
    if (user.isVerified) {
      throw new ConflictException('User already verified');
    }

    // 1.2 check for OTP AND OTP EXPIRY
    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid OTP or expired');
    }

    // 1.3 check for OTP MATCH
    if (user.otp !== FactoryUser.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 1.4 update user
    await this.userRepository.findOneAndUpdate(
      {
        email: FactoryUser.email,
      },
      {
        $set: { isEmailVerified: true, isVerified: true },
        $unset: { otp: '', otpExpiry: '' },
      },
    );

    return user;
  }
  async login(loginDto: LoginDTO) {
    const FactoryUser = this.loginFactory.createUser(loginDto);
    // 1 find user first by email to send custom error message
    const user = await this.userRepository.findOne({
      email: FactoryUser.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // 2 check if user is verified
    if (!user.isVerified) {
      throw new BadRequestException('User not verified');
    }
    // 3 check if password is correct
    const isPasswordCorrect = await comparePassword(
      FactoryUser.password,
      user.password,
    );
    // 4 check if password is correct
    if (!isPasswordCorrect) {
      throw new BadRequestException('credentials are incorrect');
    }
    // 5 generate token
    const token = await this.tokenService.generateToken(user);
    const {
      password,
      otp,
      otpExpiry,
      credentialsUpdatedAt,
      isVerified,
      isEmailVerified,
      isPhoneVerified,
      isAddressVerified,

      ...userData
    } = user.toObject();
    return {
      token,
      user: userData,
    };
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDTO) {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });
    // 1.1 check if user exists
    if (!user) {
      throw new NotFoundException('Invalid email');
    }
    // 1.2 check is email is verified and for current user
    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }
    // 1.3 Send email with OTP to reset password
    const otp = generateOTP(5);
    await this.userRepository.findOneAndUpdate(
      { email: user.email },
      { $set: { otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) } },
    );
    try {
      await sendEmail({
        from: 'E-commerce <noreply@e-commerce.com>',
        to: user.email,
        subject: 'Reset Password',
        text: `Your OTP is ${otp}. It will expire in ${new Date(user.otpExpiry || new Date()).getTime() - new Date().getTime()} minutes.`,
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to send email');
    }
    return {
      message: 'OTP sent to email',
      success: true,
    };
  }
  async resetPassword(resetPasswordDto: ResetPasswordDTO) {
    const FactoryUser =
      await this.resetPasswordFactory.resetPassword(resetPasswordDto);

    // 1.1 check if user exists
    const user = await this.userRepository.findOne({
      email: FactoryUser.email,
    });
    if (!user) {
      throw new NotFoundException('Invalid email');
    }
    // 1.2 check if OTP is correct
    if (user.otp !== FactoryUser.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    // 1.3 check if OTP has expired
    if (FactoryUser.otpExpiry && FactoryUser.otpExpiry < new Date()) {
      throw new BadRequestException('OTP has expired');
    }
    // 1.4 update user password
    await this.userRepository.findOneAndUpdate(
      { email: FactoryUser.email },
      {
        $set: {
          password: FactoryUser.password,
          credentialsUpdatedAt: new Date(),
          otp: undefined,
          otpExpiry: undefined,
        },
      },
    );
    return {
      message: 'Password reset successfully',
      success: true,
    };
  }

  async googleLogin(user: any) {
    // Generate token for Google authenticated user
    const token = await this.tokenService.generateToken(user);
    // Handle both Mongoose document and plain object
    const userObject = user.toObject ? user.toObject() : user;
    const {
      password,
      otp,
      otpExpiry,
      credentialsUpdatedAt,
      isVerified,
      isEmailVerified,
      isPhoneVerified,
      isAddressVerified,
      ...userData
    } = userObject;
    return {
      token,
      user: userData,
    };
  }
}
