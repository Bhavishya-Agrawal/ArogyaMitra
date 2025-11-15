import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, phone, aadhaar, password } = req.body;
  if (!phone || !password) return res.status(400).json({ message: "Phone and password required" });

  const exists = await User.findOne({ phone });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, phone, aadhaar, password: hash });
  res.json({ user: { id: user._id, name: user.name, phone: user.phone } });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ message: "Phone and password required" });

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user._id, name: user.name, phone: user.phone, aadhar:user.aadhaar }, token });
};
