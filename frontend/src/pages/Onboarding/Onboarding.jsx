import React from "react";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

export default function Onboarding() {
  return (
    <div className="max-w-3xl mx-auto text-center mt-20 px-4">

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Welcome to <span className="text-blue-600">Arogya Mitra</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-gray-700 text-base">
        Your AI assistant for PM-JAY benefits, hospital support, and bill protection.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex justify-center gap-4">

        {/* Primary Button */}
        <Link
          to="/register"
          className="
            px-6 
            py-2.5 
            bg-blue-600 
            text-white 
            rounded-xl 
            shadow-sm 
            hover:bg-blue-700 
            transition
          "
        >
          Get Started
        </Link>

        {/* Secondary Button */}
        <Link
          to="/chat"
          className="
            px-6 
            py-2.5 
            rounded-xl 
            border 
            border-gray-300 
            text-gray-900 
            bg-white
            hover:border-blue-600 
            hover:text-blue-600 
            transition
            shadow-sm
          "
        >
          Open Chat
        </Link>
        <div className="fixed bottom-6 right-6 z-50">
      <Link
        to="/chat"
        className="
          w-14 h-14 
          rounded-full 
          bg-blue-600 
          text-white 
          flex items-center justify-center 
          shadow-lg 
          hover:bg-blue-700 
          transition
        "
      >
        <FaRobot className="text-2xl" />
      </Link>
      </div>
      </div>
    </div>
  );
}
