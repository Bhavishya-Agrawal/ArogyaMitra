import mongoose from "mongoose";

const FraudSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
  frauds: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("FraudReport", FraudSchema);
