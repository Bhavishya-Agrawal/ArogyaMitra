import mongoose from "mongoose";

const fraudSchema = new mongoose.Schema({
  billId: String,
  frauds: Array
});

export default mongoose.model("FraudReport", fraudSchema);
