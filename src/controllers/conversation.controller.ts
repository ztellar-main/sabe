import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import {
  createChat,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from "../services/conversation.service";
import UserModel from "../models/user.model";
import { findUser } from "../services/user.service";
import ConversationModel from "../models/conversation.model";

interface RequestWithUser extends Request {
  user: any;
}

// create or open conversation
export const createOrOpenConversation = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = req.user.userId;
    const senderId = userId;
    const { receiverId } = req.body;
    // check if the receiver id is provided
    if (!receiverId) {
      throw createHttpError.BadGateway("Something went wrong");
    }
    // check if chat exist
    const existedConverastion = await doesConversationExist(
      senderId,
      receiverId
    );
    if (existedConverastion) {
      res.json(existedConverastion);
    } else {
      const receiverUser = await findUser(receiverId, "User does not exist");
      let convoData = {
        name: receiverUser.name,
        isGroup: false,
        users: [senderId, receiverId],
      };
      const newConvo: any = await createChat(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );

      res.json(populatedConvo);
    }
  }
);

// get user conversations
export const getUserConverstions = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = req.user.userId;

    const conversations = await getUserConversations(userId);
    res.json(conversations);
  }
);
