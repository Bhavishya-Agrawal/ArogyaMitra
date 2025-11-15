import React from "react";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Onboarding() {
  const { user } = useAuth();   // 👈 get logged-in user

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        <div className="p-6 md:p-12 text-center">

          {/* Logo */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg mb-6">
            <FaRobot className="w-10 h-10" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Welcome to <span className="text-blue-600">Arogya Mitra</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-8">
            Your AI health-companion for PM-JAY benefits, trusted hospitals & secure billing.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">

            {/* 👉 If user logged in → Move to chat page */}
            <Link
              to={user ? "/chat" : "/register"}   // 👈 FIXED
              className="
                px-8 py-3 
                bg-blue-600 text-white 
                rounded-xl 
                font-semibold 
                shadow-md 
                hover:bg-blue-700 
                transition
              "
            >
              {user ? "Continue" : "Get Started"}
            </Link>

            <Link
              to="/chat"
              className="
                px-8 py-3 
                border-2 border-gray-300 
                text-gray-900 
                bg-white rounded-xl 
                font-semibold 
                hover:border-blue-600 hover:text-blue-600 
                transition
              "
            >
              Open Chat
            </Link>
          </div>

          {/* Floating Chat Icon */}
          <div className="fixed bottom-6 right-6 z-50">
            <Link
              to="/chat"
              className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaRobot className="w-8 h-8" />
            </Link>
          </div>

          {/* Eligibility Button */}
          <div className="fixed top-24 right-8 z-50 animate-bounce">
            <Link
              to="/checkeligibility"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold shadow-lg transition"
            >
              Check Eligibility
            </Link>
          </div>
          <Link to='/aiassistant'>AiAssistant</Link>

          <p className="text-xs text-gray-500 mt-4">
            *Trusted by users for secure healthcare access. 100% confidentiality guaranteed.
          </p>

        </div>
      </div>
    </div>
  );
}
