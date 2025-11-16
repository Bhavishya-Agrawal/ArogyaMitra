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

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

router.post('/ask', askChatbot);

router.post('/speech-to-text', upload.single('audio'), convertSpeechToText);
router.post('/text-to-speech', convertTextToSpeech);
router.post('/voice-chat', upload.single('audio'), voiceChat);

router.post('/clear', clearChatHistory);
router.get('/health', healthCheck);

export default router;