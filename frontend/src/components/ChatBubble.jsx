import React from "react";

export default function ChatBubble({ from = "bot", text }) {
  const isUser = from === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} py-1`}>
      <div
        className={`
          px-4 py-2 
          max-w-[75%] 
          rounded-xl 
          text-sm 
          shadow-sm
          ${isUser 
            ? "bg-blue-600 text-white" 
            : "bg-blue-50 text-gray-900 border border-gray-200"
          }
        `}
      >
        {text}
      </div>
    </div>
  );
}
