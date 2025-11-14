import React from "react";
import { Link } from "react-router-dom";

export default function HospitalCard({ hospital }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-start">
        
        {/* Hospital Info */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {hospital.name}
          </h3>
          <p className="text-sm text-gray-600">
            {hospital.specialty || "General"}
          </p>
        </div>

        {/* Rating */}
        <div className="text-right">
          <div className="text-xs text-gray-500">Rating</div>
          <div className="font-bold text-blue-600">
            {hospital.rating ?? "N/A"}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        {hospital.address}
      </p>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/hospitals/${hospital._id}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
