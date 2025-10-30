import { User } from '@models/index';
import { RegisterDTO } from '../dto/register.dto';
import { Injectable } from '@nestjs/common';
import { ROLE_ENUM } from '../../../types/enums';
import { hashPassword } from 'src/utils';
import { generateOTP } from 'src/utils/otp';

@Injectable()
export class RegisterCustomerFactory {
  async createUser(registerDTO: RegisterDTO) {
    const user = new User();
    user.email = registerDTO.email;
    user.password = await hashPassword(registerDTO.password);
    user.fullname = registerDTO.fullname;
    user.phone = registerDTO.phone;
    user.address = registerDTO.address;
    user.isVerified = false;
    user.otp = generateOTP(5);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.role = ROLE_ENUM.CUSTOMER;
    return user;
  }
}
