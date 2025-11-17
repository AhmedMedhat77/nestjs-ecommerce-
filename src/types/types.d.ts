import { IUser } from './interface';

declare global {
  namespace Express {
    interface Request {
      user: Partial<IUser>;
    }
  }
}

export {};
