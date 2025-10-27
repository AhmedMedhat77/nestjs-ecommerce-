import { ROLE_ENUM } from '../enums';

export interface IUser {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  address: string;
  isVerified: boolean;
  role: ROLE_ENUM;
  otp?: string;
  otpExpiry?: Date;
  credentialsUpdatedAt?: Date;
}
