import React, { useState } from "react";
import Button from "../../components/Button";
import { uploadBill } from "../../api/billApi";

export default function BillScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select an image of the bill.");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bill", file);

      const res = await uploadBill(fd);

      const ocrText = res.data.text || "";
      const normalizedText = ocrText.replace(/[¥$€]/g, "₹");
      setResult(normalizedText);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">

      {/* HEADER */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        🔍 Upload & Scan Your Hospital Bill
      </h2>

      {/* Card */}
      <form
        onSubmit={submit}
        className="
          bg-white/70 backdrop-blur-xl
          border border-gray-200 shadow-xl
          rounded-3xl p-8 
          transition-all
        "
      >
        {/* Upload Box */}
        <label
          htmlFor="fileInput"
          className="
            w-full p-10 border-2 border-dashed border-gray-300 rounded-2xl
            flex flex-col items-center justify-center cursor-pointer
            hover:border-blue-500 hover:bg-blue-50/40 transition
          "
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/833/833453.png"
            className="w-16 opacity-70 mb-3"
            alt="upload"
          />
          <p className="text-gray-600 text-lg font-medium">
            {file ? file.name : "Click to upload or drag & drop bill image"}
          </p>
        </label>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {/* Scan Button */}
        <Button
          type="submit"
          className="
            w-full mt-6 py-3 text-lg font-semibold
            bg-gradient-to-r from-blue-600 to-blue-800
            hover:from-blue-700 hover:to-blue-900
            shadow-lg hover:shadow-xl transition-all 
            rounded-xl text-white
          "
        >
          {loading ? "🔄 Scanning…" : "🚀 Upload & Scan"}
        </Button>
      </form>

      {/* OCR RESULT CARD */}
      {result && (
        <div
          className="
            mt-10 bg-white border border-gray-200 rounded-3xl
            shadow-xl p-6 animate-fade-in
          "
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">📄 OCR Result</h3>

            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="
                border px-3 py-1 rounded-lg text-sm
                hover:bg-gray-100 transition text-gray-700
              "
            >
              Copy
            </button>
          </div>

          <pre
            className="
              text-sm text-gray-800 whitespace-pre-wrap 
              bg-gray-50 p-4 mt-4 rounded-xl border
              shadow-inner
            "
          >
            {result || "No text extracted."}
          </pre>

          {/* Fraud Report Link */}
          <div className="mt-5 text-right">
            <a
              href="/fraud"
              className="
                text-blue-600 font-medium text-sm hover:underline
              "
            >
              View Fraud Report →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
