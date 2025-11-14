import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="font-semibold text-xl text-blue-600 tracking-tight"
        >
          Arogya Mitra
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm text-gray-800">
          
          <Link to="/chat" className="hover:text-blue-600 transition">
            Chat
          </Link>

          <Link to="/hospitals" className="hover:text-blue-600 transition">
            Hospitals
          </Link>

          <Link to="/scan" className="hover:text-blue-600 transition">
            Scan Bill
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="hover:text-blue-600 transition"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 transition">
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-blue-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
