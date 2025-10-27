import { ROLE_ENUM } from 'src/types';

export class CreateUserDto {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  address: string;
  isVerified: boolean;
  role: ROLE_ENUM;
}
