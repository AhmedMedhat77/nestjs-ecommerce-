import { User } from '@models/index';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { hashPassword } from 'src/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordFactory {
  async resetPassword(resetPasswordDto: ResetPasswordDTO) {
    const user = new User();
    user.email = resetPasswordDto.email;
    user.otp = resetPasswordDto.otp;
    user.password = await hashPassword(resetPasswordDto.password);
    return user;
  }
}
