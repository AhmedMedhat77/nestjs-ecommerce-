import { IUser } from './interface';

export * from './interface';
export * from './enums';

// common

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
