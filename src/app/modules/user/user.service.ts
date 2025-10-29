import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async(payload : Partial<IUser>) => {
  const {email, password, ...rest} = payload;
  
  const isUserExist = await User.findOne({email});

  if(isUserExist){
    throw new AppError(httpStatusCodes.BAD_REQUEST, "User already exist")
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const autProvider : IAuthProvider = {
    provider: "credentials",
    providerId: email as string
  }

  const user = await User.create({
    email, 
    password: hashedPassword,
    auths: [autProvider],
    ...rest
  });

  return user;
}

const getAllUsers = async() => {
  const users = await User.find();
  const countTotalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: countTotalUsers
    }
  };
}

export const UserServices = {
  createUser,
  getAllUsers
}