import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  specialty: String,
  rating: Number,
});

export default mongoose.model("Hospital", hospitalSchema);
