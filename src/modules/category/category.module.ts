import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '@models/Category/category.schema';
import { CategoryRepository } from '@models/Category/category.repository';
import { AuthModule } from '@modules/auth/auth.module';
import { UserMongoModule } from '@shared/index';

@Module({
  imports: [
    AuthModule,
    UserMongoModule,
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository, CategoryService],
})
export class CategoryModule {}

