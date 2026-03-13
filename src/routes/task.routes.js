import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createTask,
  completeTask,
  deleteTask,
  assignTaskCategory
} from "../controllers/task.controller.js";

const router = Router();

router.post("/tasks", requireAuth, createTask);
router.post("/tasks/:id/complete", requireAuth, completeTask);
router.post("/tasks/:id/delete", requireAuth, deleteTask);
router.post("/tasks/:id/category", requireAuth, assignTaskCategory);

export default router;