
// Routes
import express from "express";
import "./utils/loadEnv.js"
import cors from "cors";
import connectDB from "./config/db.js";

// Existing routes
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";
// import chatbotRoutes from "./routes/chatbotRoutes.js";
// import { handleBotFrameworkMessage } from "./controllers/botFrameworkController.js";


// New voice chatbot routes
import voiceChatbotRoutes from "./routes/voiceChatbot.route.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Arogya Mitra Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      hospitals: "/api/hospitals",
      bills: "/api/bills",
      fraud: "/api/fraud",
      chat: "/api/chat",
      voiceChatbot: "/api/chatbot"
    }
  });
});

// API Routes - Existing
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/fraud", fraudRoutes);

// app.use("/api/chat", chatbotRoutes);

// API Routes - New Voice Chatbot
app.use("/api/chatbot", voiceChatbotRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);
// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
// <<<<<<< frontend-backend
// app.listen(PORT, () => {
//   console.log(`Bot server listening on port ${PORT}`);
//   console.log(`Bot endpoint: http://localhost:${PORT}/api/messages`);
// });
// =======
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Arogya Mitra Backend Server");
  console.log("=".repeat(60));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log("\n📋 Available Endpoints:");
  console.log("   Authentication:     /api/auth");
  console.log("   Hospitals:          /api/hospitals");
  console.log("   Bills:              /api/bills");
  console.log("   Fraud Detection:    /api/fraud");
  console.log("   Chat (Legacy):      /api/chat");
  console.log("\n🎤 Voice Chatbot Endpoints:");
  console.log("   Text Chat:          POST /api/chatbot/ask");
  console.log("   Speech-to-Text:     POST /api/chatbot/speech-to-text");
  console.log("   Text-to-Speech:     POST /api/chatbot/text-to-speech");
  console.log("   Voice Chat:         POST /api/chatbot/voice-chat");
  console.log("   Clear History:      POST /api/chatbot/clear");
  console.log("   Health Check:       GET  /api/chatbot/health");
  console.log("=".repeat(60) + "\n");
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('💤 HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('💤 HTTP server closed');
    process.exit(0);
  });
});

export default app;
