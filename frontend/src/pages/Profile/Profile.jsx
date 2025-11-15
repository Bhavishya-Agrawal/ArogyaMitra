import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Phone, IdCard } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        Please login to view your profile.
      </div>
    );

  const info = user.user;

  return (
    <div className="max-w-md mx-auto mt-16 px-4">

      {/* Header Title */}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        👤 Your <span className="text-blue-600">Profile</span>
      </h2>

      {/* Card */}
      <div
        className="
          bg-white 
          rounded-3xl 
          shadow-lg 
          border border-gray-100 
          p-6 
          space-y-6
          transition 
          hover:shadow-xl
        "
      >
        
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="
            w-20 h-20 
            rounded-full 
            bg-blue-600 
            flex items-center justify-center 
            text-white 
            shadow-md
          ">
            <User className="w-10 h-10" />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">

          {/* Name */}
          <div className="
            flex items-center gap-3 
            p-3 
            bg-blue-50 
            rounded-xl 
            border border-blue-100
          ">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-gray-900 font-semibold">
                {info.name || "-"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="
            flex items-center gap-3 
            p-3 
            bg-teal-50 
            rounded-xl 
            border border-teal-100
          ">
            <Phone className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-gray-900 font-semibold">
                {info.phone || "-"}
              </p>
            </div>
          </div>

          {/* Aadhaar */}
          <div className="
            flex items-center gap-3 
            p-3 
            bg-purple-50 
            rounded-xl
            border border-purple-100
          ">
            <IdCard className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Aadhaar Number</p>
              <p className="text-gray-900 font-semibold">
                {info.aadhar || "-"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
