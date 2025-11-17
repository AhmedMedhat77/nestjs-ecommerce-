import googleAuthConfig from '@config/google-auth-config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptionsWithRequest,
  Profile,
} from 'passport-google-oauth20';
import { UserRepository } from '@models/index';
import { PLATFORM_ENUM, ROLE_ENUM } from 'src/types/enums';
import { hashPassword } from 'src/utils/hash';

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    @Inject(googleAuthConfig.KEY)
    private readonly config: ConfigType<typeof googleAuthConfig>,
    private readonly userRepository: UserRepository,
  ) {
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;
    const email = emails?.[0]?.value;
    const name = displayName || emails?.[0]?.value?.split('@')[0] || 'User';
    const avatar = photos?.[0]?.value;

    if (!email) {
      throw new Error('Email not provided by Google');
    }

    // Check if user exists
    let user: any = await this.userRepository.findOne({ email });

    if (user) {
      // Update user if they logged in with Google before
      if (user?.platform !== PLATFORM_ENUM.GOOGLE) {
        // User exists but with local auth, update to Google
        await this.userRepository.findOneAndUpdate(
          { email },
          {
            $set: {
              platform: PLATFORM_ENUM.GOOGLE,
              avatar: avatar || user.avatar,
              isEmailVerified: true,
              isVerified: true,
            },
          },
        );
        user = await this.userRepository.findOne({ email });
      } else {
        // Update avatar if changed
        if (avatar && user.avatar !== avatar) {
          await this.userRepository.findOneAndUpdate(
            { email },
            { $set: { avatar } },
          );
          user = await this.userRepository.findOne({ email });
        }
      }
    } else {
      // Create new user with Google
      const hashedPassword = await hashPassword(`google_${id}_${Date.now()}`); // Generate a random password for Google users
      const newUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        fullname: name,
        role: ROLE_ENUM.USER,
        platform: PLATFORM_ENUM.GOOGLE,
        isVerified: true,
        isEmailVerified: true,
        avatar,
      });
      user = newUser;
    }

    if (!user) {
      throw new Error('Failed to create or retrieve user');
    }

    return user;
  }
}
