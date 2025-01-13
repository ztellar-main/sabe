import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation name is required"],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
      default: "asd"
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel",
      },
    ],
    latest_message: {
      type: mongoose.Schema.ObjectId,
      ref: "MessageModel",
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "UserModel",
    },
  },
  {
    collection: "conversation",
    timestamps: true,
  }
);

const ConversationModel = mongoose.model(
  "ConversationModel",
  conversationSchema
);

export default ConversationModel;
