import speech from '@google-cloud/speech';
import textToSpeech from '@google-cloud/text-to-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log("Gemini key:", process.env.GOOGLE_GEMINI_API_KEY);

// Initialize Google Cloud clients
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_CREDENTIALS_PATH || './key.json'
});

const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_CREDENTIALS_PATH || './key.json'
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Chat history storage (use Redis or DB in production)
const chatHistories = new Map();

// System prompts for different languages
const SYSTEM_CONTEXTS = {
  en: `You are Arogya Mitra, a helpful assistant for PM-JAY (Pradhan Mantri Jan Arogya Yojana), India's national health insurance scheme. 

Key information about PM-JAY:
- Provides health coverage of ₹5 lakhs per family per year
- Covers over 50 crore beneficiaries (bottom 40% of India's population)
- Cashless and paperless treatment at empaneled hospitals
- Covers pre and post-hospitalization expenses
- No restrictions on family size, age, or gender
- Covers 1,949 procedures including surgeries, medical treatments, and day care procedures

You help users with:
- Information about PM-JAY scheme and eligibility
- Finding empaneled hospitals
- Understanding bills and treatment costs
- Claim processes and documentation
- Benefits and coverage details

Be concise, helpful, and empathetic. If you don't know something specific, guide them to visit www.pmjay.gov.in or call 14555.`,

  hi: `आप आरोग्य मित्र हैं, PM-JAY (प्रधानमंत्री जन आरोग्य योजना), भारत की राष्ट्रीय स्वास्थ्य बीमा योजना के लिए एक सहायक हैं।

PM-JAY के बारे में मुख्य जानकारी:
- प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवरेज प्रदान करता है
- 50 करोड़ से अधिक लाभार्थियों को कवर करता है (भारत की आबादी का निचला 40%)
- सूचीबद्ध अस्पतालों में कैशलेस और पेपरलेस उपचार
- अस्पताल में भर्ती होने से पहले और बाद के खर्चों को कवर करता है
- परिवार के आकार, उम्र या लिंग पर कोई प्रतिबंध नहीं
- सर्जरी, चिकित्सा उपचार और डे केयर प्रक्रियाओं सहित 1,949 प्रक्रियाओं को कवर करता है

आप उपयोगकर्ताओं की मदद करते हैं:
- PM-JAY योजना और पात्रता के बारे में जानकारी
- सूचीबद्ध अस्पताल ढूंढना
- बिल और उपचार लागत को समझना
- दावा प्रक्रिया और दस्तावेज़ीकरण
- लाभ और कवरेज विवरण

संक्षिप्त, सहायक और सहानुभूतिपूर्ण रहें। यदि आपको कुछ विशिष्ट नहीं पता है, तो उन्हें www.pmjay.gov.in पर जाने या 14555 पर कॉल करने का मार्गदर्शन करें।`
};

// Detect language from message
const detectLanguage = (message) => {
  // Simple detection: check for Hindi characters
  const hindiRegex = /[\u0900-\u097F]/;
  return hindiRegex.test(message) ? 'hi' : 'en';
};

// Fallback responses for common queries
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('eligibe')) {
    return "PM-JAY covers the bottom 40% of India's population based on SECC 2011 data. You can check your eligibility by visiting pmjay.gov.in or calling 14555.";
  } else if (msg.includes('hospital')) {
    return "You can find empaneled hospitals near you at pmjay.gov.in. There are over 27,000+ empaneled hospitals across India providing cashless treatment.";
  } else if (msg.includes('bill') || msg.includes('cost')) {
    return "PM-JAY provides cashless treatment up to ₹5 lakhs per family per year. All costs are covered directly by the scheme at empaneled hospitals. No bills to pay!";
  } else if (msg.includes('card') || msg.includes('document')) {
    return "You need your Ayushman Card for treatment. If you don't have it, you can get it made at Common Service Centers (CSC) or empaneled hospitals with your Aadhaar card.";
  } else if (msg.includes('claim')) {
    return "Claims are processed cashless at empaneled hospitals. You don't need to file claims - the hospital does it directly. Just show your Ayushman Card.";
  } else {
    return "I'm here to help with PM-JAY queries! You can ask about eligibility, finding hospitals, benefits, bills, or call 14555 for immediate assistance.";
  }
};

// @desc    Chat with AI bot
// @route   POST /api/chatbot/ask
// @access  Public
export const askChatbot = async (req, res) => {
  try {
    const { message, sessionId = 'default', language } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    // Detect or use provided language
    const detectedLang = language || detectLanguage(message);
    const systemContext = SYSTEM_CONTEXTS[detectedLang] || SYSTEM_CONTEXTS.en;

    // Get or create chat session with context
    const sessionKey = `${sessionId}_${detectedLang}`;
    let chat = chatHistories.get(sessionKey);
    if (!chat) {
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemContext }],
          },
          {
            role: "model",
            parts: [{ 
              text: detectedLang === 'hi' 
                ? "मैं समझता हूं। मैं आरोग्य मित्र हूं, PM-JAY प्रश्नों में मदद करने के लिए यहां हूं। मैं आपकी कैसे सहायता कर सकता हूं?"
                : "I understand. I'm Arogya Mitra, here to help with PM-JAY queries. How can I assist you today?" 
            }],
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });
      chatHistories.set(sessionKey, chat);
    }

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const answer = response.text();
    
    res.json({ 
      success: true,
      answer,
      sessionId,
      detectedLanguage: detectedLang
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Fallback response if Gemini fails
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.json({ 
      success: false,
      answer: fallbackResponse,
      error: 'Using fallback response'
    });
  }
};

// @desc    Convert speech to text
// @route   POST /api/chatbot/speech-to-text
// @access  Public
export const convertSpeechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No audio file provided' 
      });
    }

    const { language = 'auto' } = req.body;
    const audioBytes = req.file.buffer.toString('base64');

    // Language code mapping
    const langCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'auto': 'en-US' // default, will also try Hindi
    };

    const primaryLang = langCodes[language] || 'en-US';
    const alternativeLangs = language === 'auto' ? ['hi-IN', 'en-IN'] : [];

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: primaryLang,
        alternativeLanguageCodes: alternativeLangs,
        enableAutomaticPunctuation: true,
        model: 'default',
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (!transcription) {
      return res.status(400).json({ 
        success: false,
        error: 'No speech detected' 
      });
    }

    // Detect language from transcription
    const detectedLang = detectLanguage(transcription);

    res.json({ 
      success: true,
      text: transcription,
      detectedLanguage: detectedLang
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process audio: ' + error.message 
    });
  }
};

// @desc    Convert text to speech
// @route   POST /api/chatbot/text-to-speech
// @access  Public
export const convertTextToSpeech = async (req, res) => {
  try {
    const { text, language = 'en-IN' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false,
        error: 'No text provided' 
      });
    }

    // Voice configuration based on language
    const voiceConfig = {
      'en-IN': { name: 'en-IN-Neural2-A', gender: 'FEMALE' },
      'hi-IN': { name: 'hi-IN-Neural2-A', gender: 'FEMALE' },
      'en-US': { name: 'en-US-Neural2-F', gender: 'FEMALE' }
    };

    const voice = voiceConfig[language] || voiceConfig['en-IN'];

    const request = {
      input: { text },
      voice: {
        languageCode: language,
        name: voice.name,
        ssmlGender: voice.gender
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.95,
        pitch: 0.0,
        volumeGainDb: 0.0
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate speech: ' + error.message 
    });
  }
};

// @desc    Voice chat (speech -> text -> AI -> speech)
// @route   POST /api/chatbot/voice-chat
// @access  Public
export const voiceChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No audio file provided' 
      });
    }

    const { sessionId = 'default', language = 'en-IN' } = req.body;
    
    // Step 1: Convert speech to text
    const audioBytes = req.file.buffer.toString('base64');
    const sttRequest = {
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        alternativeLanguageCodes: ['hi-IN'],
        enableAutomaticPunctuation: true,
      },
    };

    const [sttResponse] = await speechClient.recognize(sttRequest);
    const transcription = sttResponse.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (!transcription) {
      return res.status(400).json({ 
        success: false,
        error: 'No speech detected' 
      });
    }

    // Step 2: Get chat response
    let chat = chatHistories.get(sessionId);
    if (!chat) {
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_CONTEXT }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm Arogya Mitra, here to help with PM-JAY queries." }],
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
      chatHistories.set(sessionId, chat);
    }

    const result = await chat.sendMessage(transcription);
    const response = await result.response;
    const answer = response.text();

    // Step 3: Convert response to speech
    const voiceConfig = {
      'en-IN': { name: 'en-IN-Neural2-A', gender: 'FEMALE' },
      'hi-IN': { name: 'hi-IN-Neural2-A', gender: 'FEMALE' }
    };
    const voice = voiceConfig[language] || voiceConfig['en-IN'];

    const ttsRequest = {
      input: { text: answer },
      voice: {
        languageCode: language,
        name: voice.name,
        ssmlGender: voice.gender
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.95,
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    
    // Return both text and audio
    res.json({
      success: true,
      transcription,
      answer,
      audio: ttsResponse.audioContent.toString('base64'),
      sessionId
    });
  } catch (error) {
    console.error('Voice chat error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// @desc    Clear chat history
// @route   POST /api/chatbot/clear
// @access  Public
export const clearChatHistory = (req, res) => {
  try {
    const { sessionId = 'default' } = req.body;
    chatHistories.delete(sessionId);
    
    res.json({ 
      success: true, 
      message: 'Chat history cleared' 
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// @desc    Health check for chatbot services
// @route   GET /api/chatbot/health
// @access  Public
export const healthCheck = (req, res) => {
  res.json({ 
    success: true,
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      speech: !!speechClient,
      tts: !!ttsClient,
      gemini: !!genAI
    }
  });
};