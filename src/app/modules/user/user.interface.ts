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
  provider: string;
  providerIdP: string;
}

export interface IUser {
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