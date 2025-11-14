import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  userId: String,
  imageUrl: String,
  extractedText: String
});

export default mongoose.model("Bill", billSchema);
