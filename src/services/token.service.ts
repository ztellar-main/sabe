import { sign, verify } from "../utils/token.util";

export const generateToken = async (
  payload: any,
  expiresIn: string,
  secret: any
) => {
  let token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token: string, secret: any) => {
  let check = await verify(token, secret);
  return check;
};
