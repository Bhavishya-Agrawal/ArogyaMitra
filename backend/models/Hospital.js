import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  specialty: String,
  rating: Number,
  location: { type: { type: String }, coordinates: [Number] } // optional
});

HospitalSchema.index({ location: "2dsphere" });

export default mongoose.model("Hospital", HospitalSchema);
