import { Router } from "express";
import {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getDashboard,
  logout
} from "../controllers/auth.controller.js";
import { requireAuth, requireGuest } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/register", requireGuest, getRegister);
router.post("/register", requireGuest, postRegister);

router.get("/login", requireGuest, getLogin);
router.post("/login", requireGuest, postLogin);

router.get("/dashboard", requireAuth, getDashboard);
router.post("/logout", requireAuth, logout);

export default router;