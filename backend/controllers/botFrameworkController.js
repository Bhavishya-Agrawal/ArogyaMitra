import { adapter } from '../config/botConfig.js';

export const handleBotFrameworkMessage = async (req, res) => {
  try {
    // CRITICAL: Use processActivity, not process
    await adapter.processActivity(req, res, async (context) => {
      
      if (context.activity.type === 'message') {
        const messageText = context.activity.text || "";

        if (!messageText.trim()) {
          return;
        }

        const responseText = await processMessage(messageText);
        await context.sendActivity(responseText);

      } else if (context.activity.type === 'conversationUpdate') {
        if (context.activity.membersAdded) {
          for (const member of context.activity.membersAdded) {
            // Don't greet the bot itself
            if (member.id !== context.activity.recipient.id) {
              await context.sendActivity("Hello! I'm Arogya Mitra. How can I help you with PM-JAY, hospitals, or bills today?");
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in handleBotFrameworkMessage:', error);
    // Don't send response here - adapter handles it
  }
};

async function processMessage(messageText) {
  try {
    const lowerMessage = messageText.toLowerCase().trim();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm Arogya Mitra. How can I help you with PM-JAY, hospitals, or bills today?";
    }
    if (lowerMessage.includes("pm-jay") || lowerMessage.includes("pmjay") || lowerMessage.includes("eligibility")) {
      return "PM-JAY (Pradhan Mantri Jan Arogya Yojana) provides health insurance coverage. To check eligibility, I'll need some information. What would you like to know?";
    }
    if (lowerMessage.includes("hospital") || lowerMessage.includes("doctor") || lowerMessage.includes("clinic")) {
      return "I can help you find hospitals. Would you like to search by location, specialty, or PM-JAY coverage?";
    }
    if (lowerMessage.includes("bill") || lowerMessage.includes("invoice") || lowerMessage.includes("cost")) {
      return "I can help with bill scanning and fraud detection. You can upload a bill image and I'll analyze it for you.";
    }
    
    return "I'm here to help with PM-JAY eligibility, hospital finding, and bill fraud detection. What would you like to know?";
    
  } catch (error) {
    console.error("Error processing message:", error);
    return "I'm having trouble processing your message. Please try again.";
  }
}