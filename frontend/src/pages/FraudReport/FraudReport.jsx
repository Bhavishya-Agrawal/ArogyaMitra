import React, { useEffect, useState } from "react";
import { getFraudReport } from "../../api/billApi";
import Loader from "../../components/Loader";

export default function FraudReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getFraudReport("latest");
        setReport(res.data);
      } catch (e) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!report) return <div>No fraud report available.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Fraud Report
      </h2>

      {/* Report Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        {report.frauds && report.frauds.length ? (
          <ul className="space-y-4">
            {report.frauds.map((f, i) => (
              <li
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="font-semibold text-lg text-gray-900">
                  {f.service}
                </div>

                <div className="text-sm text-gray-700 mt-1">
                  Charged: <span className="font-medium">₹{f.charged}</span> — Allowed:{" "}
                  <span className="font-medium">₹{f.allowed}</span>
                </div>

                <div className="text-red-600 text-sm mt-2">
                  {f.message}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-700">No fraud detected. Bill looks OK.</div>
        )}
      </div>
    </div>
  );
}
