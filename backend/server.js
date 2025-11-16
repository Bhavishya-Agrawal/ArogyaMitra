import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import { handleBotFrameworkMessage } from "./controllers/botFrameworkController.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB
connectDB()

app.get("/", (req, res) => res.send("Arogya Mitra Backend Running"));

// Bot Framework messaging endpoint
// POST - handle actual bot messages
app.post("/api/messages", handleBotFrameworkMessage);

// GET - health check for Azure validation
app.get("/api/messages", (req, res) => {
  console.log("GET /api/messages - Health check");
  res.status(200).json({ 
    status: "Bot messaging endpoint is active",
    endpoint: "/api/messages",
    methods: ["GET", "POST"]
  });
});

// OPTIONS - CORS preflight (automatic with cors() middleware, but explicit is fine)
app.options("/api/messages", (req, res) => {
  res.status(200).end();
});

// Other API routes
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/chatbot", chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Bot server listening on port ${PORT}`);
  console.log(`Bot endpoint: http://localhost:${PORT}/api/messages`);
});