import { model, Schema } from "mongoose";
import { EIsActive, ERole, IAuthProvider, IUser } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(ERole),
      default: ERole.USER,
    },
    auths: [authProviderSchema],
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    avatar: { type: String },
    isActive: {
      type: String,
      enum: Object.values(EIsActive),
      default: EIsActive.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model<IUser>("User", userSchema);
