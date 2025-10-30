import { UserRepository } from '@models/index';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ROLE_ENUM } from '../../types/enums';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const decoded = await this.jwtService.verifyAsync<{
        userId: string;
        role: ROLE_ENUM;
      }>(token);
      const user = await this.userRepository.findOne({
        _id: decoded.userId,
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = user;
      return true;
    } catch (error: unknown) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Unauthorized',
      );
    }
  }
}
