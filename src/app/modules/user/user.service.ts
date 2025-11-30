import AppError from "../../errorHelpers/AppError";
import { ERole, IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCodes from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  // if(isUserExist){
  //   throw new AppError(httpStatusCodes.BAD_REQUEST, "User already exist")
  // }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const autProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [autProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatusCodes.NOT_FOUND, "User does not exist.");
  }

  if (payload.email) {
    throw new AppError(
      httpStatusCodes.FORBIDDEN,
      "You can not change your email."
    );
  }

  if (payload.role) {
    if (decodedToken.role === ERole.USER) {
      throw new AppError(
        httpStatusCodes.FORBIDDEN,
        "Its forbidden for you to change the role."
      );
    }

    if (
      payload.role === ERole.SUPER_ADMIN &&
      decodedToken.role === ERole.ADMIN
    ) {
      throw new AppError(
        httpStatusCodes.FORBIDDEN,
        "Its forbidden for you to change the role."
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === ERole.USER) {
      throw new AppError(
        httpStatusCodes.FORBIDDEN,
        "Its forbidden for you to update this."
      );
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
};
