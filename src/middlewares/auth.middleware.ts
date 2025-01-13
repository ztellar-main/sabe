import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

interface RequestWithUser extends Request {
  user: any;
}

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers["authorization"];
  const accessToken: string = process.env.ACCESS_TOKEN_SECRET as string;
  if (!bearerToken) {
    return next(createHttpError.Unauthorized());
  }
  const token = bearerToken.split(" ")[1];

  jwt.verify(token, accessToken, (err, payload: any) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    }
    req.user = payload;
    next();
  });
};
