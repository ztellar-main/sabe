import createHttpError from "http-errors";
import MessageModel from "../models/message.model";

// create message
export const createMessage = async (messageData: any) => {
  const newMessage = await MessageModel.create(messageData);

  if (!newMessage) {
    throw createHttpError.BadRequest("Something went wrong");
  }
  return newMessage;
};

// populate message
export const populateMessage = async (messageId: any) => {
  const message = await MessageModel.findById(messageId)
    .populate({
      path: "sender",
      select: "name picture",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      populate: {
        path: "users",
        select: "name email picture status",
      },
    });

  if (!message) {
    throw createHttpError.BadRequest("Something went wrong");
  }

  return message;
};

// get convo messages
export const getConvoMessages = async (convoId: any) => {
  const messages = await MessageModel.find({ conversation: convoId })
    .populate({
      path: "sender",
      select: "name picture email status",
    })
    .populate({ path: "conversation" });

  if (!messages) {
    throw createHttpError.BadRequest("Something went wrong");
  }

  return messages;
};
