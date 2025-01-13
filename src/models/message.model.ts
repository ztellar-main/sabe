import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "UserModel",
    },
    message: {
      type: String,
      trim: true,
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "ConversationModel",
    },
    files: [],
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

const MessageModel = mongoose.model("MessageModel", messageSchema);
export default MessageModel;
