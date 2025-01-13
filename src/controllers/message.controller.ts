import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import {
  createMessage,
  getConvoMessages,
  populateMessage,
} from "../services/message.service";
import { updateLatestMessage } from "../services/conversation.service";

interface RequestWithUser extends Request {
  user: any;
}

// send message
export const sendMessage = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = req.user.userId;
    const { message, convoId, files } = req.body;
    if (!convoId || (!message && !files)) {
      throw createHttpError.BadRequest("Something went wrong");
    }
    const messageData = {
      sender: userId,
      message,
      conversation: convoId,
      files: files || [],
    };
    const newMessage = await createMessage(messageData);
    const populatedMessage = await populateMessage(newMessage._id);
    await updateLatestMessage(convoId, newMessage);

    res.json(populatedMessage);
  }
);

// get message
export const getMessage = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const convoId = req.params.convo_id;
    if (!convoId) {
      throw createHttpError.BadRequest("Something went wrong");
    }

    const messages = await getConvoMessages(convoId);
    res.json(messages);
  }
);
