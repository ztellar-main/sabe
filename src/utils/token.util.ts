import jwt from "jsonwebtoken";
import { logger } from "../configs/logger";
import createHttpError from "http-errors";

export const sign = async (payload: any, expiresIn: string, secret: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn,
      },
      (error, token) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const verify = async (token: string, secret: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: any, payload: any) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};
