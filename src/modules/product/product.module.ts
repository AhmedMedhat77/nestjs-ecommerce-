import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserMongoModule } from '@shared/index';
import { AuthModule } from '@modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@models/Product/product.schema';
import { ProductRepository } from '@models/Product/product.repository';
import { CategoryModule } from '@modules/category/category.module';
import { BrandModule } from '@modules/brand/brand.module';

@Module({
  imports: [
    UserMongoModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
