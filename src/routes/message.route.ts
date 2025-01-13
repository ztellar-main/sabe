import express from "express";
const router = express.Router();

import { sendMessage, getMessage } from "../controllers/message.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

router.post("/", authMiddleware, sendMessage);
router.get("/:convo_id", authMiddleware, getMessage);

export default router;
