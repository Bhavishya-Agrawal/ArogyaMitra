import React, { useState, useRef, useEffect } from "react";
import "../css/AIAssistant.css";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m your AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const query = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.answer || "No response from server.",
        url: data.url || null,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Error connecting to AI server." }
      ]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="ai-floating-btn" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {open && (
        <div className="ai-container">
          <div className="ai-header">
            <h3>AI Assistant</h3>
            <span onClick={() => setOpen(false)}>×</span>
          </div>

          <div className="ai-chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-messages ${msg.sender}`}>
                <p>{msg.text}</p>

                {msg.url && (
                  <a
                    href={msg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ai-link-btn"
                  >
                    Visit Page →
                  </a>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="ai-input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
