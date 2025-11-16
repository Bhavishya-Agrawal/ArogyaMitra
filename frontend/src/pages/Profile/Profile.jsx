import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Phone, IdCard } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-20 text-lg tracking-wide">
        Please login to view your profile.
      </div>
    );

  const info = user.user;

  return (
    <div className="max-w-md mx-auto mt-24 px-4 animate-fadeIn">

      {/* Header Title */}
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 drop-shadow-sm">
        Your <span className="text-blue-600">Profile</span>
      </h2>

      {/* Profile Card */}
      <div
        className="
          bg-white/70 
          backdrop-blur-xl 
          rounded-3xl 
          shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
          border border-gray-200 
          p-7 
          space-y-8
          transform transition-all
          hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]
          hover:-translate-y-1
        "
      >
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="
            w-24 h-24 
            rounded-full 
            bg-gradient-to-r from-blue-600 to-blue-400
            flex items-center justify-center 
            text-white 
            shadow-xl
            ring-4 ring-blue-100
            animate-avatarPulse
          ">
            <User className="w-12 h-12" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-5">

          {/* NAME */}
          <div
            className="
              p-4 rounded-xl 
              bg-blue-50 border border-blue-100 
              flex items-center gap-4
              shadow-sm hover:shadow-md transition
            "
          >
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Full Name
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                {info.name || "-"}
              </p>
            </div>
          </div>

          {/* PHONE */}
          <div
            className="
              p-4 rounded-xl 
              bg-teal-50 border border-teal-100 
              flex items-center gap-4
              shadow-sm hover:shadow-md transition
            "
          >
            <div className="bg-teal-100 p-2 rounded-full">
              <Phone className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Phone Number
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                {info.phone || "-"}
              </p>
            </div>
          </div>

          {/* AADHAAR */}
          <div
            className="
              p-4 rounded-xl 
              bg-purple-50 border border-purple-100 
              flex items-center gap-4
              shadow-sm hover:shadow-md transition
            "
          >
            <div className="bg-purple-100 p-2 rounded-full">
              <IdCard className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Aadhaar Number
              </p>
              <p className="text-gray-900 font-semibold text-lg tracking-wider">
                {info.aadhar || "-"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
