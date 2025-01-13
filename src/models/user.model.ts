import mongoose from "mongoose";
import validate from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "This email address already exist"],
      lowercase: true,
      validate: [validate.isEmail, "Please provide a valid email address"],
    },
    picture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Hey there ! I am using whatsapp",
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        6,
        "Please make sure your password is atleast 6 characters long",
      ],
      maxLength: [
        20,
        "Please make sure your password is less than 20 characters long",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      var salt = bcrypt.genSaltSync(12);
      var hashedPassword = bcrypt.hashSync(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;
