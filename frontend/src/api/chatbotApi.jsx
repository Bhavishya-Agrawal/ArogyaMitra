import axios from "./axios";

// Text chat - matches /api/chatbot/ask
export const sendChat = (msg, sessionId) => 
  axios.post("/chatbot/ask", { message: msg, sessionId });

// Speech to text - matches /api/chatbot/speech-to-text
export const speechToText = (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  return axios.post("/chatbot/speech-to-text", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Text to speech - matches /api/chatbot/text-to-speech
export const textToSpeech = (text, language = 'en-IN') => 
  axios.post("/chatbot/text-to-speech", { text, language }, {
    responseType: 'blob'
  });

// Voice chat - matches /api/chatbot/voice-chat
export const voiceChat = (audioBlob, sessionId, language = 'en-IN') => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('sessionId', sessionId);
  formData.append('language', language);
  return axios.post("/chatbot/voice-chat", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Clear history - matches /api/chatbot/clear
export const clearChatHistory = (sessionId) => 
  axios.post("/chatbot/clear", { sessionId });