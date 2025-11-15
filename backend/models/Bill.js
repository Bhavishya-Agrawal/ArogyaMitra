import mongoose from "mongoose";

const BillReportSchema = new mongoose.Schema({
  userId: { type: String },  // ⬅ FIXED
  ocrText: String,
  frauds: Array
}, { timestamps: true });

export default mongoose.model("BillReport", BillReportSchema);
