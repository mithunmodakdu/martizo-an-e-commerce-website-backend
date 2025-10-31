import { ObjectId, Types } from "mongoose";

export enum ERole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER"
}

export enum EIsActive {
 ACTIVE = "ACTIVE",
 INACTIVE = "INACTIVE",
 BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: ERole;
  auths: IAuthProvider[];
  phone?: string;
  address?: string;
  avatar?: string;
  isActive: EIsActive;
  isDeleted: boolean;
  isVerified: boolean;
  

}