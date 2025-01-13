import createHttpError from "http-errors";
import ConversationModel from "../models/conversation.model";
import UserModel from "../models/user.model";

export const doesConversationExist = async (senderId: any, receiverId: any) => {
  let convos: any = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ],
  })
    .populate({ path: "users", select: "-password" })
    .populate({ path: "latest_message" })
    .populate({ path: "latest_message.sender", select: "-password" });

  if (!convos) {
    throw createHttpError.BadRequest("Oopps...Something went wrong");
  }

  //   populate message model
  convos = await UserModel.populate(convos, {
    path: "latest_message.sender",
    select: "name email picture status",
  });

  return convos[0];
};

// create conversation
export const createChat = async (convoData: any) => {
  const newConvo = await ConversationModel.create(convoData);
  if (!newConvo) {
    throw createHttpError.BadRequest("Oopps...Something went wrong");
  }
  return newConvo;
};

// populate new conversation
export const populateConversation = async (
  convoId: any,
  populatePath: any,
  populateSelect: any
) => {
  const convo = await ConversationModel.findOne({ _id: convoId }).populate({
    path: populatePath,
    select: populateSelect,
  });
  if (!convo) {
    throw createHttpError.NotFound("Something went wrong");
  }
  return convo;
};

// get user conversations
export const getUserConversations = async (userId: any) => {
  const conversations = await ConversationModel.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate({ path: "users", select: "-password" })
    .populate({ path: "admin", select: "-password" })
    .populate({ path: "latest_message" })
    .populate({ path: "latest_message.sender", select: "-password" })
    .sort({ updatedAt: -1 });

  return conversations;
};

// update latest message
export const updateLatestMessage = async (convoId: any, newMessage: any) => {
  await ConversationModel.findByIdAndUpdate(convoId, {
    latest_message: newMessage._id,
  });
};
