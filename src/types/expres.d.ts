// types/express/index.d.ts
import { Roles } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      roles: Roles;
    };
  }
}
