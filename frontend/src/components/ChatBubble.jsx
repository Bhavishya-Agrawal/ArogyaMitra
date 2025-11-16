import React from "react";

export default function ChatBubble({ from = "bot", text }) {

  const formatText = (text) => {
    if (!text) return '';
    
    let formatted = text;
    
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');
    
    formatted = formatted.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
    
    formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
  
    formatted = formatted.replace(/^- (.+)$/gm, '• $1');
    formatted = formatted.replace(/^\* (.+)$/gm, '• $1');
    
    return formatted;
  };

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
        {formatText(text)}
      </div>
    </div>
  );
}
