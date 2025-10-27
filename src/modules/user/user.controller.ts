import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
@Controller('user')
export class UserController {
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
