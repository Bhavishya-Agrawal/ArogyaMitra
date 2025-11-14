import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Onboarding/Onboarding";
import Chatbot from "./pages/Chatbot/Chatbot";
import HospitalFinder from "./pages/HospitalFinder/HospitalFinder";
import HospitalDetails from "./pages/HospitalFinder/HospitalDetails";
import BillScanner from "./pages/BillScanner/BillScanner";
import FraudReport from "./pages/FraudReport/FraudReport";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Wrapper */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/hospitals" element={<HospitalFinder />} />
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          <Route path="/scan" element={<BillScanner />} />
          <Route path="/fraud" element={<FraudReport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
