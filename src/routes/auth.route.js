import express from "express";

const router = express.Router();

// importing Controller
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// update user profile
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
