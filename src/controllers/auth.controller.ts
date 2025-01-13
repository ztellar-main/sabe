import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createUser, signUser } from "../services/auth.service";
import createHttpError from "http-errors";
import { generateToken, verifyToken } from "../services/token.service";
import { findUser } from "../services/user.service";

interface RequestWithUser extends Request {
  user: any;
}

// register user
export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, picture, status, password } = req.body;

    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    const accessToken = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "register success",
      user: {
        id: newUser._id,
        name: newUser.name,
        status: newUser.status,
        email: newUser.email,
        picture: newUser.picture,
        token: accessToken,
      },
    });
  }
);

// login user
export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await signUser(email, password);

    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "login success",
      user: {
        id: user._id,
        name: user.name,
        status: user.status,
        email: user.email,
        picture: user.picture,
        token: accessToken,
      },
    });
  }
);

// logout user
export const logout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    res.clearCookie("refreshtoken", { path: "/api/auth/refreshtoken" });
    res.json({
      message: "logged out",
    });
  }
);

// refresh token
export const refreshtoken = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
      throw createHttpError.Unauthorized("Please login");
    }

    const check: any = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await findUser(
      check.userId,
      "Something went wrong. Please try again later"
    );

    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        status: user.status,
        email: user.email,
        picture: user.picture,
      },
    });
  }
);
