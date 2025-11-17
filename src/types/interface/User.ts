import { ObjectId } from 'mongoose';
import { ROLE_ENUM } from '../enums';

export interface IUser {
  readonly _id: ObjectId;
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
