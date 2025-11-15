import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "../../components/ChatBubble";
import Button from "../../components/Button";
import {sendChat}  from "../../api/chatbotApi.jsx";
import axios from "../../api/axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Ask me about PM-JAY, hospitals, or bills." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);

  const languages = {
    en: { name: 'English', greeting: 'Hello! Ask me about PM-JAY, hospitals, or bills.' },
    hi: { name: 'हिंदी', greeting: 'नमस्ते! मुझसे PM-JAY, अस्पताल या बिल के बारे में पूछें।' }
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

  // Convert text to speech
  const speakText = async (text) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsSpeaking(true);
    
    try {
      const voiceLanguage = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      const response = await axios.post('/chatbot/text-to-speech', 
        { text, language: voiceLanguage },
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

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      
      {/* Header with Language Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Chat with Arogya Mitra
        </h2>
        
        {/* Language Selector */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="
          bg-white 
          border border-gray-200 
          rounded-2xl 
          shadow-sm 
          h-[65vh] 
          overflow-y-auto 
          p-4 
          space-y-2
        "
      >
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            <ChatBubble from={m.from} text={m.text} />
            {m.from === "bot" && (
              <button
                onClick={() => speakText(m.text)}
                className="text-gray-400 hover:text-blue-600 p-1 text-lg flex-shrink-0"
                title={selectedLanguage === 'hi' ? "सुनें" : "Listen"}
                disabled={isSpeaking}
              >
                🔊
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && send()}
          placeholder={selectedLanguage === 'hi' ? "अपना सवाल लिखें…" : "Type your question…"}
          className="
            flex-1 
            p-3 
            border 
            border-gray-300 
            rounded-xl 
            shadow-sm 
            text-gray-900 
            focus:ring-2 
            focus:ring-blue-600 
            focus:outline-none
          "
        />

        {/* Microphone Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          className={`
            px-4 py-3 rounded-xl font-medium shadow-sm transition-all
            ${isRecording 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={isRecording 
            ? (selectedLanguage === 'hi' ? "रोकें" : "Stop") 
            : (selectedLanguage === 'hi' ? "बोलें" : "Speak")
          }
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>

        <Button onClick={send}>
          {loading ? "…" : (selectedLanguage === 'hi' ? "भेजें" : "Send")}
        </Button>
      </div>

      {/* Status */}
      {isRecording && (
        <p className="mt-2 text-sm text-red-600 text-center">
          🎤 {selectedLanguage === 'hi' ? "रिकॉर्ड हो रहा है..." : "Recording..."}
        </p>
      )}
      {isSpeaking && (
        <button 
          onClick={stopSpeaking}
          className="mt-2 text-sm text-blue-600 text-center w-full hover:text-blue-800"
        >
          🔇 {selectedLanguage === 'hi' ? "बोलना बंद करें" : "Stop Speaking"}
        </button>
      )}
    </div>
  );
}