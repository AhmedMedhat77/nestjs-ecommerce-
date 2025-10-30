import { User } from '@models/index';
import { LoginDTO } from '../dto/login.dto';

export class LoginFactory {
  createUser(loginDto: LoginDTO) {
    const user = new User();
    user.email = loginDto.email;
    user.password = loginDto.password;
    return user;
  }
}
