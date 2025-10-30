import { User } from '@models/index';
import { VerifyOtpDTO } from '../dto/verifyOTP.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyFactory {
  createUser(verifyOtpDto: VerifyOtpDTO) {
    const user = new User();
    user.email = verifyOtpDto.email;
    user.otp = verifyOtpDto.otp;
    return user;
  }
}
