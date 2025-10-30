import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/User/user.schema';
import { Seller, SellerSchema } from '../../models/seller/seller.schema';
import { SellerRepository, UserRepository } from '../../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          {
            name: Seller.name,
            schema: SellerSchema,
          },
        ],
      },
    ]),
  ],
  providers: [UserRepository, SellerRepository],
  exports: [UserRepository, SellerRepository],
})
export class UserMongoModule {}
