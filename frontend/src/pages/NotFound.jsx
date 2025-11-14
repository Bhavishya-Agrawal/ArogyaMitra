import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center mt-20 px-4">

      {/* Emoji / Icon */}
      <div className="text-6xl mb-6">😕</div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-gray-600">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <div className="mt-8">
        <Link
          to="/"
          className="
            px-6 py-2.5 
            rounded-xl 
            bg-blue-600 
            text-white 
            shadow-sm 
            hover:bg-blue-700 
            transition
          "
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
