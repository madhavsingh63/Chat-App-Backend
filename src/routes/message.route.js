import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllUser, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getAllUser);
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
