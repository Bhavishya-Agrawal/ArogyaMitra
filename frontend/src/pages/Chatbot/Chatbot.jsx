import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "../../components/ChatBubble";
import Button from "../../components/Button";
import { sendChat } from "../../api/chatbotApi";
import axios from "../../api/axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Ask me about PM-JAY, hospitals, or bills." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);

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
      const res = await sendChat(input);
      const botMsg = {
        from: "bot",
        text: res.data?.answer || "Sorry, no response."
      };
      setMessages((prev) => [...prev, botMsg]);

      // Auto-speak response if voice is enabled
      if (voiceEnabled && res.data?.answer) {
        await speakText(res.data.answer);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Service unavailable. Please try again." }
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
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Could not access microphone. Please grant permission.");
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

      // Send to speech-to-text endpoint
      const response = await axios.post('/chatbot/speech-to-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const transcribedText = response.data.text;
      
      if (transcribedText) {
        // Add transcribed text as user message
        const userMsg = { from: "user", text: transcribedText };
        setMessages((prev) => [...prev, userMsg]);

        // Get bot response
        const chatRes = await sendChat(transcribedText);
        const botMsg = {
          from: "bot",
          text: chatRes.data?.answer || "Sorry, no response."
        };
        setMessages((prev) => [...prev, botMsg]);

        // Auto-speak response
        if (voiceEnabled && chatRes.data?.answer) {
          await speakText(chatRes.data.answer);
        }
      }
    } catch (error) {
      console.error("Audio processing error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Could not process audio. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convert text to speech
  const speakText = async (text) => {
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsSpeaking(true);
    
    try {
      const response = await axios.post('/chatbot/text-to-speech', 
        { text },
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

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* Title with Voice Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Chat with Arogya Mitra
        </h2>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Auto-speak responses</span>
        </label>
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
                className="text-gray-400 hover:text-blue-600 p-1 mt-1"
                title="Speak this message"
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-pulse">●</div>
            <div className="animate-pulse delay-100">●</div>
            <div className="animate-pulse delay-200">●</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question…"
          disabled={loading || isRecording}
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
            disabled:bg-gray-100
            disabled:cursor-not-allowed
          "
        />

        {/* Voice Input Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          className={`
            px-4 py-3 rounded-xl font-medium shadow-sm
            transition-all duration-200
            ${isRecording 
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isRecording ? "⏹️ Stop" : "🎤"}
        </button>

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="
              px-4 py-3 rounded-xl font-medium shadow-sm
              bg-orange-600 text-white hover:bg-orange-700
              transition-all duration-200
            "
            title="Stop speaking"
          >
            🔇 Stop
          </button>
        )}

        {/* Send Button */}
        <Button onClick={send} disabled={loading || isRecording || !input.trim()}>
          {loading ? "…" : "Send"}
        </Button>
      </div>

      {/* Status Indicator */}
      {isRecording && (
        <div className="mt-2 text-center text-sm text-red-600 font-medium">
          🎤 Recording... Speak now
        </div>
      )}
      {isSpeaking && (
        <div className="mt-2 text-center text-sm text-blue-600 font-medium">
          🔊 Speaking...
        </div>
      )}
    </div>
  );
}