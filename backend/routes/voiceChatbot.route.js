import express from 'express';
import multer from 'multer';
import {
  askChatbot,
  convertSpeechToText,
  convertTextToSpeech,
  voiceChat,
  clearChatHistory,
  healthCheck
} from '../controllers/chatbot.controller.js';

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Text-based chat endpoint (matches your existing frontend)
router.post('/ask', askChatbot);

// Voice endpoints
router.post('/speech-to-text', upload.single('audio'), convertSpeechToText);
router.post('/text-to-speech', convertTextToSpeech);
router.post('/voice-chat', upload.single('audio'), voiceChat);

// Utility endpoints
router.post('/clear', clearChatHistory);
router.get('/health', healthCheck);

export default router;