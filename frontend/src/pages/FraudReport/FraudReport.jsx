import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { getFraudReport } from "../../api/billApi";
import { useAuth } from "../../context/AuthContext";
import { AlertTriangle, FileText, Download, Phone, CheckCircle } from "lucide-react";

export default function FraudReport() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getFraudReport().then((res) => setData(res.data));
  }, []);

  if (!data)
    return (
      <p className="text-center text-gray-700 mt-10 animate-pulse">
        Loading fraud report…
      </p>
    );

  // ==========================
  // PDF GENERATION FUNCTION
  // ==========================
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Logo (simple text)
    doc.setFontSize(24);
    doc.text("Arogya Mitra", 10, 15);

    // Title
    doc.setFontSize(16);
    doc.text("Fraud Detection Report", 10, 28);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(10, 32, 200, 32);

    // User Info
    doc.setFontSize(13);
    doc.text(`Name: ${user?.user?.name || "N/A"}`, 10, 45);
    doc.text(`Phone: ${user?.user?.phone || "N/A"}`, 10, 53);
    doc.text(`Aadhaar: ${user?.user?.aadhaar || "N/A"}`, 10, 61);

    // Report info
    doc.text(`Report ID: ${data._id}`, 10, 75);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 10, 83);

    // Hospital (from OCR first line)
    const hospital = data.ocrText.split("\n")[0] || "Unknown Hospital";
    doc.setFontSize(14);
    doc.text("Hospital:", 10, 100);
    doc.setFontSize(12);
    doc.text(hospital.substring(0, 80), 10, 108);

    // FRAUD SECTION
    doc.line(10, 115, 200, 115);

    if (data.frauds.length === 0) {
      doc.setFontSize(16);
      doc.setTextColor(0, 150, 0);
      doc.text("No fraud detected.", 10, 130);
    } else {
      doc.setFontSize(16);
      doc.setTextColor(255, 0, 0);
      doc.text("⚠ FRAUD DETECTED", 10, 130);

      let y = 145;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      data.frauds.forEach((f, i) => {
        doc.text(`${i + 1}. Service: ${f.service}`, 10, y);
        doc.text(`Charged: ₹${f.charged}`, 10, y + 8);
        doc.text(`Allowed: ₹${f.allowed}`, 10, y + 16);
        doc.text(`Reason: ${f.message}`, 10, y + 24);
        y += 35;
      });
    }

    // Helpline
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 200);
    doc.text("Helpline: 14555", 10, 270);
    doc.setFontSize(11);
    doc.text("https://grievance.abdm.gov.in", 10, 278);

    doc.save(`Fraud_Report_${data._id}.pdf`);
  };

  // ==========================
  // UI SECTION
  // ==========================
  return (
    <div className="max-w-xl mx-auto mt-12 px-4">

      <h1 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <FileText className="text-blue-600" /> Fraud Report
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-4 mb-5">
        <button
          onClick={downloadPDF}
          className="
            flex items-center gap-2 px-4 py-2 bg-blue-600 
            text-white rounded-xl shadow-lg hover:bg-blue-700 
            transition-all
          "
        >
          <Download size={18} /> Download PDF
        </button>

        <a
          href="https://grievance.abdm.gov.in/grievance/v3/register"
          target="_blank"
          className="
            flex items-center gap-2 px-4 py-2 bg-red-600 
            text-white rounded-xl shadow-lg hover:bg-red-700
            transition-all
          "
        >
          <Phone size={18} /> Register Complaint
        </a>
      </div>

      {/* RESULT BOX */}
      {data.frauds.length === 0 ? (
        <div
          className="
            p-5 bg-green-50 border border-green-300 rounded-xl 
            shadow-md flex gap-3 items-start
          "
        >
          <CheckCircle className="text-green-600 mt-1" />
          <p className="text-green-700">No fraud detected in this bill.</p>
        </div>
      ) : (
        data.frauds.map((f, i) => (
          <div
            key={i}
            className="
              mt-4 p-5 bg-red-50 border border-red-300 rounded-xl
              shadow-md hover:shadow-lg transition-all
              "
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-600" />
              <h3 className="text-lg font-semibold text-red-700">
                Fraud Detected
              </h3>
            </div>

            <p><strong>Service:</strong> {f.service}</p>
            <p><strong>Charged:</strong> ₹{f.charged}</p>
            <p><strong>Allowed:</strong> ₹{f.allowed}</p>

            <p className="text-red-600 mt-1">{f.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
