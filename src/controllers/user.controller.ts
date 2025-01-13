import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { searchUsers as searchUsersService } from "../services/user.service";

interface RequestWithUser extends Request {
  user: any;
}

// search users
export const searchUsers = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const keyWord = req.query.search;
    const userId = req.user.userId;

    if (!keyWord) {
      throw createHttpError.BadRequest("Something went wrong");
    }

    const users = await searchUsersService(keyWord, userId);
    res.json(users);
  }
);
