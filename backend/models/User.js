import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, unique: true, required: true },
  aadhaar: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
