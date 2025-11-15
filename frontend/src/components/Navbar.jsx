// src/components/Navbar.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // ⭐ Redirect instantly
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-semibold text-xl text-blue-600 tracking-tight">
          Arogya Mitra
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-800">

          <Link to="/chat" className="hover:text-blue-600 transition">Chat</Link>
          <Link to="/hospitals" className="hover:text-blue-600 transition">Hospitals</Link>
          <Link to="/scan" className="hover:text-blue-600 transition">Scan Bill</Link>

          {user ? (
            <>
              <Link to="/profile" className="hover:text-blue-600 transition">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link to="/register" className="hover:text-blue-600 transition">Register</Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 
          transform ${open ? "translate-x-0" : "translate-x-full"} 
          transition-transform duration-300 ease-out
        `}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-700 text-2xl"
        >
          <FaTimes />
        </button>

        <nav className="mt-16 flex flex-col gap-6 text-lg font-medium text-gray-800 px-6">

          <Link onClick={() => setOpen(false)} to="/chat">Chat</Link>
          <Link onClick={() => setOpen(false)} to="/hospitals">Hospitals</Link>
          <Link onClick={() => setOpen(false)} to="/scan">Scan Bill</Link>

          {user ? (
            <>
              <Link onClick={() => setOpen(false)} to="/profile">Profile</Link>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-red-600 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} to="/login">Login</Link>
              <Link onClick={() => setOpen(false)} to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
