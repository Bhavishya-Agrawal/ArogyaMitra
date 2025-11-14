import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="text-center text-gray-700 mt-10">
        Please login to view your profile.
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your Profile
        </h2>

        {/* User Details */}
        <div className="text-gray-800 space-y-3 text-sm">

          <div>
            <span className="font-medium text-gray-700">Name:</span>{" "}
            <span className="text-gray-900">{user.name || "-"}</span>
          </div>

          <div>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            <span className="text-gray-900">{user.phone || "-"}</span>
          </div>

          <div>
            <span className="font-medium text-gray-700">Aadhaar:</span>{" "}
            <span className="text-gray-900">{user.aadhaar || "-"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
