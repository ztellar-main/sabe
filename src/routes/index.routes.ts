import express from "express";
const router = express.Router();

import authRoutes from "./auth.route";
import conversationRoutes from "./conversation.route";
import messageRoutes from "./message.route";
import userRoutes from "./user.route";

router.use("/auth", authRoutes);
router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);
router.use("/user", userRoutes);

export default router;
