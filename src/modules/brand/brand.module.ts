import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from '@models/Brand/brand.schema';
import { BrandRepository } from '@models/Brand/brand.repository';
import { AuthModule } from '@modules/auth/auth.module';
import { UserMongoModule } from '@shared/index';

@Module({
  imports: [
    AuthModule,
    UserMongoModule,
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandRepository, BrandService],
})
export class BrandModule {}
