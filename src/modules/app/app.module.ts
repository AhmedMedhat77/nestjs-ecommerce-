import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { CategoryModule } from '@modules/category/category.module';
import { BrandModule } from '@modules/brand/brand.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModule } from '@shared/index';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    BrandModule,
    // already registered in the use.mongo.module
    UserMongoModule,
    MongooseModule.forRootAsync({
      // inject the config service
      inject: [ConfigService],
      // use the config service to get the database url
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('database.url'),
        };
      },
    }),
    // To register the user model in the database
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //     discriminators: [{ name: Seller.name, schema: SellerSchema }],
    //   },
    // ]),
    ConfigModule.forRoot({
      // To globally access the config module
      isGlobal: true,
      // load the configuration file
      load: [configuration],
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
