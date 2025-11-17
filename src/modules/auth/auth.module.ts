import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserMongoModule } from '@shared/index';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterCustomerFactory } from './factory/registerFactory';
import { VerifyFactory } from './factory/verifyFactory';
import { LoginFactory } from './factory/loginFactory';
import { TokenService } from 'src/utils/token';
import { ResetPasswordFactory } from './factory/reset-password.factory';
import { PassportModule } from '@nestjs/passport';
import GoogleStrategy from 'src/stragies/google.stratgy';
import googleAuthConfig from '@config/google-auth-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserMongoModule,
    PassportModule,
    ConfigModule.forFeature(googleAuthConfig),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('TOKEN_SECRET'),
          signOptions: { expiresIn: '1h' },
          verifyOptions: { algorithms: ['HS256'] },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterCustomerFactory,
    VerifyFactory,
    LoginFactory,
    TokenService,
    ResetPasswordFactory,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
