import React from "react";

export default function Loader() {
  return (
    <div className="py-10 flex justify-center">
      <div className="flex items-center gap-3 text-gray-600 text-sm">
        
        {/* Spinner */}
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        
        <span>Loading…</span>
      </div>
    </div>
  );
}
