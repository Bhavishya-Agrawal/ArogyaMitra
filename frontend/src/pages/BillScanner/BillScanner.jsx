import React, { useState } from "react";
import Button from "../../components/Button";
import { uploadBill } from "../../api/billApi";

export default function BillScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select an image of the bill.");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("bill", file);
      const res = await uploadBill(fd);
      setResult(res.data);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Scan Hospital Bill
      </h2>

      {/* Upload Form Card */}
      <form
        onSubmit={submit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5"
      >
        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
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
            focus:outline-none
          "
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {loading ? "Scanning…" : "Upload & Scan"}
        </Button>
      </form>

      {/* OCR Result */}
      {result && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            OCR Result
          </h3>

          <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-200">
            {result.text || "No text extracted."}
          </pre>

          <div className="mt-4 text-right">
            <a
              className="text-blue-600 text-sm font-medium hover:underline"
              href={`/fraud`}
            >
              View Fraud Report →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
