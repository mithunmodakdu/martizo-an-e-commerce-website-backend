// src/types/jwt.ts
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface CustomJwtPayload extends JwtPayload {
  userId: Types.ObjectId;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
}
