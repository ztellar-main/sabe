import express from "express";
const router = express.Router();

import {
  createOrOpenConversation,
  getUserConverstions,
} from "../controllers/conversation.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

router.post("/", authMiddleware, createOrOpenConversation);

router.get("/", authMiddleware, getUserConverstions);

export default router;
