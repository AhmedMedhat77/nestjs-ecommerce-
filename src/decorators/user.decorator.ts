import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/types/interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<IUser> => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: Partial<IUser> }>();
    return request.user;
  },
);
