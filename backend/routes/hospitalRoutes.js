import express from "express";
import { getHospitals, getHospital } from "../controllers/hospitalController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(getHospitals));
router.get("/:id", asyncHandler(getHospital));
export default router;
