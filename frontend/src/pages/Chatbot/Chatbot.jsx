import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "../../components/ChatBubble.jsx";
import { sendChat } from "../../api/chatbotApi.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { FaPaperPlane } from "react-icons/fa";

export default function Chatbot() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Welcome to Arogya Mitra! How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!input.trim() || loading) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await sendChat(userInput, lang, conversationId);

      const botMsg = {
        from: "bot",
        text: res.data?.reply || "⚠️ I couldn't understand that.",
      };

      setMessages((prev) => [...prev, botMsg]);

      if (res.data?.conversationId)
        setConversationId(res.data.conversationId);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Unable to reach server. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4">

      {/* --- HEADER --- */}
      <div
        ref={chatContainerRef}
        className="
          flex items-center gap-4 p-5 
          bg-white/60 backdrop-blur-xl 
          rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.08)]
          border border-white/40
        "
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
          className="w-14 h-14 rounded-3xl shadow-[4px_8px_20px_rgba(0,0,0,0.20)]"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900 drop-shadow-md">
            Arogya Mitra Assistant
          </h2>
          <p className="text-sm text-gray-600">AI Health Companion</p>
        </div>
      </div>

      {/* --- CHAT WINDOW (3D GLASS BOX) --- */}
      <div
        className="
          mt-6 p-5 h-[65vh] rounded-3xl overflow-y-auto
          bg-white/30 backdrop-blur-2xl 
          border border-white/40 
          shadow-[0_15px_35px_rgba(0,0,0,0.12)]
          space-y-3 relative
        "
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className="animate-fadeIn"
            style={{
              animationDuration: "0.4s",
              animationTimingFunction: "ease-out",
            }}
          >
            <ChatBubble from={m.from} text={m.text} />
          </div>
        ))}

        {loading && (
          <div
            className="
              bg-white/80 px-4 py-2 rounded-2xl w-fit shadow-lg 
              flex items-center gap-2 animate-pulse border border-gray-200
            "
          >
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce delay-300"></div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* --- INPUT AREA (3D Floating Bar) --- */}
      <div
        className="
          mt-5 w-full flex items-center gap-3 
          bg-white/70 backdrop-blur-xl 
          p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)]
          border border-white/50
        "
      >
        <input
          className="
            flex-1 px-4 py-3 rounded-xl bg-white/60
            shadow-inner text-gray-800 
            focus:ring-2 focus:ring-blue-500 outline-none
          "
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />

        <button
          onClick={send}
          className="
            p-4 rounded-xl bg-blue-600 text-white 
            shadow-[0_5px_15px_rgba(0,0,255,0.35)]
            hover:bg-blue-700 active:scale-95 transition-all
          "
        >
          <FaPaperPlane />
        </button>
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