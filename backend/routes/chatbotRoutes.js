import express from "express";
import { askBot } from "../controllers/chatbotController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();
router.post("/ask", asyncHandler(askBot));
export default router;
