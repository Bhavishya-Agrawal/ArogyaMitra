import React from "react";

export default function Input({ label, ...rest }) {
  return (
    <label className="block text-sm text-gray-900">
      {label && (
        <span className="mb-1 block font-medium">
          {label}
        </span>
      )}

      <input
        {...rest}
        className="
          w-full 
          p-3 
          border 
          border-gray-300 
          rounded-xl 
          bg-white 
          text-gray-900 
          shadow-sm 
          focus:ring-2 
          focus:ring-blue-600 
          focus:border-blue-600 
          focus:outline-none
          transition
        "
      />
    </label>
  );
}
