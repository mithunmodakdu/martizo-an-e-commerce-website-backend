/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatusCodes from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("fake error")
    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      message: "User created successfully.",
      user
    });

  } catch (error : any) {
    next(error)
  }
}

export const UserControllers = {
  createUser
}