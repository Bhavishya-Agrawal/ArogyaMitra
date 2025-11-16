import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "../../components/ChatBubble";
import Button from "../../components/Button";
// import { sendChat } from "../../api/chatbotApi";
import axios from "../../api/axios";
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello, I am Arogya Mitra! Ask me about PM-JAY, hospitals, or bills." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Voice states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true); // Auto-speak enabled by default
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);

  const languages = {
    en: { 
      name: 'English', 
      displayName: 'English',
      greeting: 'Hello, I am Arogya Mitra! Ask me about PM-JAY, hospitals, or bills.',
      speechCode: 'en-IN',
      voiceCode: 'en-IN'
    },
    hi: { 
      name: 'हिंदी',
      displayName: 'हिंदी', 
      greeting: 'नमस्ते, मैं आरोग्य मित्र हूँ! मुझसे PM-JAY, अस्पताल या बिल के बारे में पूछें।',
      speechCode: 'hi-IN',
      voiceCode: 'hi-IN'
    }
  };

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{ from: "bot", text: languages[selectedLanguage].greeting }]);
  }, [selectedLanguage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
    useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-speak bot responses
  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from === "bot" && lastMessage.text && !loading) {
        speakText(lastMessage.text);
      }
    }
  }, [messages, autoSpeak]);

  // Send text message
  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post('/chatbot/ask', {
        message: input,
        language: selectedLanguage
      });
      
      const botMsg = {
        from: "bot",
        text: res.data?.answer || "Sorry, no response."
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: selectedLanguage === 'hi' ? "सेवा उपलब्ध नहीं है।" : "Service unavailable." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start recording voice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert(selectedLanguage === 'hi' 
        ? "माइक्रोफ़ोन एक्सेस नहीं मिल सका। कृपया अनुमति दें।"
        : "Could not access microphone. Please grant permission.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process recorded audio
  const processAudio = async (audioBlob) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', selectedLanguage);

      const response = await axios.post('/chatbot/speech-to-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const transcribedText = response.data.text;
      
      if (transcribedText) {
        const userMsg = { from: "user", text: transcribedText };
        setMessages((prev) => [...prev, userMsg]);

        const chatRes = await axios.post('/chatbot/ask', {
          message: transcribedText,
          language: selectedLanguage
        });
        
        const botMsg = {
          from: "bot",
          text: chatRes.data?.answer || "Sorry, no response."
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Audio processing error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: selectedLanguage === 'hi' 
          ? "ऑडियो प्रोसेस नहीं कर सके। कृपया पुनः प्रयास करें।"
          : "Could not process audio. Please try again." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convert text to speech with Charon voice
  const speakText = async (text) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsSpeaking(true);
    
    try {
      const voiceLanguage = languages[selectedLanguage].voiceCode;
      const response = await axios.post('/chatbot/text-to-speech', 
        { 
          text, 
          language: voiceLanguage,
          voice: 'Charon' // Use Charon voice from Gemini
        },
        { responseType: 'blob' }
      );

      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        console.error("Audio playback error");
      };

      await audio.play();
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsSpeaking(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Chat with Arogya Mitra
        </h2>
        
        {/* Language Selector */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm h-[65vh] overflow-y-auto p-4 space-y-3"
      >
        {messages.map((m, i) => (
          <div key={i}>
            <ChatBubble from={m.from} text={m.text} />
            {/* Listen button for bot messages */}
            {m.from === "bot" && (
              <button
                onClick={() => speakText(m.text)}
                disabled={isSpeaking}
                className="ml-12 mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
                title={selectedLanguage === 'hi' ? "सुनें" : "Listen to response"}
              >
                <Volume2 className="w-3 h-3" />
                {selectedLanguage === 'hi' ? "सुनें" : "Listen"}
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-pulse">●</div>
            <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</div>
            <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-3">
        {/* Voice Input Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading || isSpeaking}
          className={`p-3 rounded-xl transition-all shadow-sm ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isRecording 
            ? (selectedLanguage === 'hi' ? "रोकें" : "Stop recording") 
            : (selectedLanguage === 'hi' ? "बोलें" : "Click to speak")
          }
        >
          {isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm"
            title={selectedLanguage === 'hi' ? "बोलना बंद करें" : "Stop speaking"}
          >
            <VolumeX className="w-6 h-6" />
          </button>
        )}

        {/* Text Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isRecording ? (selectedLanguage === 'hi' ? "सुन रहे हैं..." : "Listening...") :
            isSpeaking ? (selectedLanguage === 'hi' ? "बोल रहे हैं..." : "Speaking...") :
            (selectedLanguage === 'hi' ? "अपना सवाल लिखें…" : "Type your question…")
          }
          disabled={loading || isRecording || isSpeaking}
          className="flex-1 p-3 border border-gray-300 rounded-xl shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />

        {/* Send Button */}
        <Button onClick={send} disabled={loading || isRecording || isSpeaking || !input.trim()}>
          {loading ? "…" : (selectedLanguage === 'hi' ? "भेजें" : "Send")}
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="mt-2 text-center text-sm min-h-6">
        {isRecording && (
          <span className="text-red-600 animate-pulse font-medium">
            🎤 {selectedLanguage === 'hi' 
              ? `${languages[selectedLanguage].displayName} में रिकॉर्ड हो रहा है... अभी बोलें` 
              : `Recording in ${languages[selectedLanguage].displayName}... Speak now`
            }
          </span>
        )}
        {isSpeaking && (
          <span className="text-blue-600 font-medium">
            🔊 {selectedLanguage === 'hi' 
              ? `${languages[selectedLanguage].displayName} में बोल रहे हैं...` 
              : `Speaking in ${languages[selectedLanguage].displayName}...`
            }
          </span>
        )}
        {loading && !isRecording && !isSpeaking && (
          <span className="text-gray-600">
            {selectedLanguage === 'hi' ? "प्रोसेस हो रहा है..." : "Processing..."}
          </span>
        )}
      </div>
    </div>
  );
}