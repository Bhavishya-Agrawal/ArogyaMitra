import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => res.send("Arogya Mitra Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/chat", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
