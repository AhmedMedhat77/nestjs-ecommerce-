import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  createUser(@Body() createUserDto: CreateUserDto): CreateUserDto {
    return createUserDto;
  }
}
