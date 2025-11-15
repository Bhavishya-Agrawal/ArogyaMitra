import express from "express";
import { getFraudReport } from "../controllers/fraudController.js";
import auth from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();
router.get("/:id", auth, asyncHandler(getFraudReport));
export default router;
