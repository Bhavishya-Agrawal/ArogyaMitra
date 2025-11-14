import React, { useState } from "react";
import ChatBubble from "../../components/ChatBubble";
import Button from "../../components/Button";
import { sendChat } from "../../api/chatbotApi";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Ask me about PM-JAY, hospitals, or bills." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Service unavailable." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Chat with Arogya Mitra
      </h2>

      {/* Chat Container */}
      <div
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
          <ChatBubble key={i} from={m.from} text={m.text} />
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question…"
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

        <Button onClick={send}>
          {loading ? "…" : "Send"}
        </Button>
      </div>
    </div>
  );
}
