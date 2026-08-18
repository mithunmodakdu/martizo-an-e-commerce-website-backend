import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      userId: Types.ObjectId;
      email: string;
      role: "SUPER_ADMIN" | "ADMIN" | "USER";
      
    }
  }
}

export {}; 