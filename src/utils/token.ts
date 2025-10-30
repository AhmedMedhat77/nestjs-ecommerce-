import { User } from '@models/index';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(user: User) {
    return await this.jwtService.signAsync(
      {
        email: user.email,
        role: user.role,
        _id: user._id,
      },
      { expiresIn: '1h' } as JwtSignOptions,
    );
  }
}
