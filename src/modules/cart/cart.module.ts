import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '@models/Cart/cart.schema';
import { CartRepository } from '@models/Cart/cart.repository';
import { AuthModule } from '@modules/auth/auth.module';
import { UserMongoModule } from '@shared/index';
import { ProductModule } from '@modules/product/product.module';

@Module({
  imports: [
    AuthModule,
    UserMongoModule,
    ProductModule,
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartRepository, CartService],
})
export class CartModule {}
