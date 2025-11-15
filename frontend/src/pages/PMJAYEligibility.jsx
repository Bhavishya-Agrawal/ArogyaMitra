import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Heart } from "lucide-react";

export default function PMJAYEligibility() {
  const [formData, setFormData] = useState({
    location: "",
    category: "",
    income: "",
    hasRation: "",
    rationType: "",
    occupation: "",
    housingType: "",
    landOwnership: "",
  });

  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkEligibility = () => {
    setIsChecking(true);

    setTimeout(() => {
      let eligible = false;
      let reasons = [];
      let category = "";

      if (formData.location === "rural") {
        if (
          formData.housingType === "kutcha" ||
          formData.occupation === "manual_labour" ||
          formData.landOwnership === "landless"
        ) {
          eligible = true;
          category = "SECC Rural Criteria";
          reasons.push(
            "Meets rural deprivation criteria under SECC database"
          );
        }
      }

      if (formData.location === "urban") {
        if (
          [
            "domestic_worker",
            "street_vendor",
            "construction_worker",
            "waste_picker",
          ].includes(formData.occupation)
        ) {
          eligible = true;
          category = "Urban Workers Category";
          reasons.push("Belongs to eligible urban occupation category");
        }
      }

      if (
        formData.hasRation === "yes" &&
        ["antyodaya", "bpl"].includes(formData.rationType)
      ) {
        eligible = true;
        category = "Ration Card Holder";
        reasons.push("Holds BPL/Antyodaya ration card");
      }

      if (formData.category === "sc_st") {
        eligible = true;
        category = "SC/ST Category";
        reasons.push("Belongs to Scheduled Caste/Scheduled Tribe");
      }

      if (formData.income === "below_1_lakh") {
        reasons.push("Family income suggests potential eligibility");
      }

      setResult({ eligible, category, reasons });
      setIsChecking(false);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      location: "",
      category: "",
      income: "",
      hasRation: "",
      rationType: "",
      occupation: "",
      housingType: "",
      landOwnership: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="p-4 bg-white rounded-full shadow-md mx-auto w-16 h-16 flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-blue-700 mt-4">
            PM-JAY Eligibility Checker
          </h1>

          <p className="text-gray-600 mt-2">
            Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat)
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-10">
          {!result ? (
            <>
              {/* 1: LOCATION */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Location</option>
                  <option value="rural">Rural</option>
                  <option value="urban">Urban</option>
                </select>
              </div>

              {/* 2: CATEGORY */}
              <div className="mt-4">
                <label className="font-semibold text-gray-700 mb-1 block">
                  Social Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc_st">SC/ST</option>
                </select>
              </div>

              {/* 3: INCOME */}
              <div className="mt-4">
                <label className="font-semibold text-gray-700 mb-1 block">
                  Annual Income
                </label>
                <select
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Income Range</option>
                  <option value="below_1_lakh">Below ₹1 lakh</option>
                  <option value="1_to_3_lakh">₹1–3 lakh</option>
                  <option value="above_3_lakh">Above ₹3 lakh</option>
                </select>
              </div>

              {/* 4: RATION */}
              <div className="mt-4">
                <label className="font-semibold text-gray-700 mb-1 block">
                  Do you have a Ration Card? *
                </label>
                <select
                  name="hasRation"
                  value={formData.hasRation}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.hasRation === "yes" && (
                <div className="mt-4">
                  <label className="font-semibold text-gray-700 mb-1 block">
                    Ration Card Type
                  </label>
                  <select
                    name="rationType"
                    value={formData.rationType}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                  >
                    <option value="">Select Type</option>
                    <option value="apl">APL</option>
                    <option value="bpl">BPL</option>
                    <option value="antyodaya">Antyodaya</option>
                  </select>
                </div>
              )}

              {/* 5: Occupation */}
              <div className="mt-4">
                <label className="font-semibold text-gray-700 mb-1 block">
                  Occupation
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Occupation</option>
                  <option value="manual_labour">Manual Labour</option>
                  <option value="domestic_worker">Domestic Worker</option>
                  <option value="street_vendor">Street Vendor</option>
                  <option value="construction_worker">Construction Worker</option>
                </select>
              </div>

              {/* Check Button */}
              <button
                onClick={checkEligibility}
                disabled={!formData.location || !formData.hasRation}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                {isChecking ? "Checking..." : "Check Eligibility"}
              </button>
            </>
          ) : (
            <>
              {/* RESULT CARD */}
              <div
                className={`p-8 rounded-2xl ${
                  result.eligible
                    ? "bg-green-50 border border-green-400"
                    : "bg-red-50 border border-red-400"
                }`}
              >
                <div className="flex justify-center mb-4">
                  {result.eligible ? (
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
                  )}
                </div>

                <h2
                  className={`text-2xl text-center font-bold ${
                    result.eligible ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.eligible ? "Likely Eligible!" : "Not Eligible"}
                </h2>

                {result.category && (
                  <p className="text-center font-semibold mt-2">
                    Category: {result.category}
                  </p>
                )}

                {result.reasons.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notes */}
              <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-xl p-5">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
                  <div className="text-gray-700 text-sm">
                    <p className="font-bold mb-2">Important Notes:</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>This is an indicative check only.</li>
                      <li>Final eligibility is based on SECC-2011 database.</li>
                      <li>
                        Verify officially at{" "}
                        <a className="text-blue-600" href="https://pmjay.gov.in">
                          pmjay.gov.in
                        </a>
                      </li>
                      <li>Helpline: 14555</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full mt-6 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Check Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
