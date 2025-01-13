import express from "express";

const router = express.Router();

// controllers
import {
  register,
  login,
  logout,
  refreshtoken,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshtoken", authMiddleware, refreshtoken);

export default router;
