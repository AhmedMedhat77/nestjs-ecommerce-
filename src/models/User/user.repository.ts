import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { User } from './user.schema';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UserRepository extends AbstractRepository<User> {
  // inject the user model from the database
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
  async createUser(createUserDto: CreateUserDto) {
    return await this.create(createUserDto);
  }
}
