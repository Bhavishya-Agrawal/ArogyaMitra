import axios from "./axios";

export const sendChat = (msg, language = "en", conversationId = null) => 
  axios.post("/chatbot/ask", { 
    message: msg,             
    language: language,        
    conversationId: conversationId 
  });