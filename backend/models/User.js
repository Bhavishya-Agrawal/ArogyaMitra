import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  aadhaar: String,
  password: String,
});

export default mongoose.model("User", userSchema);
