import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('database.url'),
        };
      },
    }),
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
