// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaHospitalSymbol } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🔵 Animated highlight indicator
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);

  const menuItems = [
  { name: "Chat", path: "/chat" },
  { name: "Hospitals", path: "/hospitals" },
  { name: "Scan Bill", path: "/scan" },
  { name: "Ayushman Info", path: "/aboutus" },  // ⭐ Added here
];


  if (user) {
    menuItems.push({ name: "Profile", path: "/profile" });
  }

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Active tab highlight animation
  useEffect(() => {
    const activeLink = navRef.current?.querySelector(".active-tab");

    if (activeLink) {
      setIndicatorStyle({
        width: activeLink.offsetWidth,
        left: activeLink.offsetLeft,
      });
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-white/70 backdrop-blur-xl shadow-lg" : "bg-white shadow-sm"}
      `}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
          <FaHospitalSymbol className="text-3xl" />
          Arogya Mitra
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12 relative" ref={navRef}>

          {/* 🔵 Animated Indicator */}
          <div
            className="absolute bottom-0 h-2 bg-blue-100 rounded-full transition-all duration-300"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          ></div>

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-2 px-1 text-sm font-medium relative transition-all
                ${
                  location.pathname === item.path
                    ? "text-blue-700 active-tab"
                    : "text-gray-700 hover:text-blue-600"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">

          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:text-red-800"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl text-gray-700" onClick={() => setOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 border-l
          transform ${open ? "translate-x-0" : "translate-x-full"}
          transition-transform duration-300
        `}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>

          <button onClick={() => setOpen(false)} className="text-2xl text-gray-700">
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-6 text-lg px-6 mt-6">

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`${
                location.pathname === item.path ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="text-red-600 text-left"
            >
              Logout
            </button>
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
