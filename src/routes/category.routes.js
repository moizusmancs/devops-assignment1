import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createCategory } from "../controllers/category.controller.js";

const router = Router();

router.post("/categories", requireAuth, createCategory);

export default router;