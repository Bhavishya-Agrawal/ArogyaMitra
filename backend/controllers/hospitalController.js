import Hospital from "../models/Hospital.js";

export const getHospitals = async (req, res) => {
  const hospitals = await Hospital.find().limit(100);
  res.json(hospitals);
};

export const getHospital = async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return res.status(404).json({ message: "Not found" });
  res.json(hospital);
};
