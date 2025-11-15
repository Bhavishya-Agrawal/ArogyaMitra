import Tesseract from "tesseract.js";
import BillReport from "../models/Bill.js";
import { detectFraud } from "../utils/fraudLogic.js";

export const scanBill = async (req, res) => {
  try {
    const img = req.file.buffer;

    const result = await Tesseract.recognize(img, "eng");
    const text = result.data.text;

    const frauds = detectFraud(text);

    const report = await BillReport.create({
      userId: req.user._id,
      ocrText: text,
      frauds,
    });

    res.json({ text, frauds, id: report._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OCR failed" });
  }
};

export const getFraudReport = async (req, res) => {
  const r = await BillReport.findOne().sort({ createdAt: -1 });
  res.json(r);
};
