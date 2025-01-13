import createHttpError from "http-errors";
import UserModel from "../models/user.model";

export const findUser = async (userId: any, error: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError.BadRequest(error);
  }
  return user;
};

export const searchUsers = async (keyWord: any, userId: any) => {
  const users = await UserModel.find({
    _id: { $ne: userId },
    $or: [
      { name: { $regex: keyWord, $options: "i" } },
      { email: { $regex: keyWord, $options: "i" } },
    ],
  });
  return users;
};
