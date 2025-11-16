// routes/chatbotRoutes.js
import express from "express";
const router = express.Router();

// This should handle POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  try {
    const { message, language, conversationId } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Process the message (use your existing logic)
    const lowerMsg = message.toLowerCase().trim();
    let reply = "";
    
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      reply = "Hello! I'm Arogya Mitra. How can I help you with PM-JAY, hospitals, or bills today?";
    } else if (lowerMsg.includes("pm-jay") || lowerMsg.includes("pmjay") || lowerMsg.includes("eligibility")) {
      reply = "PM-JAY (Pradhan Mantri Jan Arogya Yojana) provides health insurance coverage. To check eligibility, I'll need some information. What would you like to know?";
    } else if (lowerMsg.includes("hospital") || lowerMsg.includes("doctor") || lowerMsg.includes("clinic")) {
      reply = "I can help you find hospitals. Would you like to search by location, specialty, or PM-JAY coverage?";
    } else if (lowerMsg.includes("bill") || lowerMsg.includes("invoice") || lowerMsg.includes("cost")) {
      reply = "I can help with bill scanning and fraud detection. You can upload a bill image and I'll analyze it for you.";
    } else {
      reply = "I'm here to help with PM-JAY eligibility, hospital finding, and bill fraud detection. What would you like to know?";
    }
    
    res.json({
      reply: reply,
      conversationId: conversationId || 'conv-' + Date.now(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ error: "Service unavailable" });
  }
});

export default router; 