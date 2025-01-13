import createHttpError from "http-errors";
import validate from "validator";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";

export const createUser = async (userData: any) => {
  const { name, email, picture, status, password } = userData;

  //   check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill in all the fields");
  }
  //   check name length
  if (
    !validate.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your name is between 2 and 16 characters"
    );
  }
  //   check status length
  if (status) {
    if (status.length > 32) {
      throw createHttpError.BadRequest(
        "Please make sure your status is less than 32 characters"
      );
    }
  }
  //   check if email address is valid
  if (!validate.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure your email address is valid"
    );
  }
  // check if user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address"
    );
  }

  //   check password length
  if (
    !validate.isLength(password, {
      min: 6,
      max: 32,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 32 characters"
    );
  }

  //   save user to database
  const newUser = await UserModel.create({
    name,
    email,
    picture,
    status: status || "Hey there ! I am using whatsapp",
    password,
  });

  return newUser;
};

export const signUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  //   check fields
  if (!email || !password) {
    throw createHttpError.BadRequest("Invalid email or password");
  }
  //   check email if exist
  if (!user) {
    throw createHttpError.NotFound("Invalid email or password");
  }
  //   compare password
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw createHttpError.NotFound("Invalid email or password");
  }

  return user;
};
