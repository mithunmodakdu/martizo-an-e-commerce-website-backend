import { Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route Not Found"
  })
}

export default notFound;