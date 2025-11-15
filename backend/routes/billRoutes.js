import express from "express";
import multer from "multer";
import { scanBill, getFraudReport } from "../controllers/billController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/scan", protect, upload.single("bill"), scanBill);
router.get("/report/latest", protect, getFraudReport);

export default router;
