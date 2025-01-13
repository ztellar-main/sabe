import express from "express";
const router = express.Router();

import { searchUsers } from "../controllers/user.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

router.get("", authMiddleware, searchUsers);

export default router;
