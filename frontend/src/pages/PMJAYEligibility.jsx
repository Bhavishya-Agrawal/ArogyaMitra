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
    employmentType: "",
    housingType: "",
    landOwnership: "",
    hasVehicle: "",
    isTaxPayer: "",
    houseType: "",
    landSize: "",
  });

  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkEligibility = () => {
    setIsChecking(true);

    setTimeout(() => {
      let eligible = false;
      let reasons = [];
      let category = "";

      // ❌ GOVT RULE – Not Eligible Conditions
      if (formData.employmentType === "govt_employee") {
        return finish(false, "Government Employee", [
          "Government employees are not eligible for PM-JAY",
        ]);
      }

      if (formData.isTaxPayer === "yes") {
        return finish(false, "Taxpayer", [
          "Income tax payers are excluded from PM-JAY as per government rules",
        ]);
      }

      if (formData.hasVehicle === "yes") {
        return finish(false, "Vehicle Owner", [
          "Owning a 2/4 wheeler or tractor disqualifies PM-JAY eligibility",
        ]);
      }

      if (formData.houseType === "pucca_3plus") {
        return finish(false, "Asset Owner", [
          "Owning a pucca house with 3 or more rooms disqualifies eligibility",
        ]);
      }

      if (formData.landSize === "above_5_acres") {
        return finish(false, "Large Land Owner", [
          "Families owning more than 5 acres land are excluded from PM-JAY",
        ]);
      }

      // ✅ Rural SECC Eligibility
      if (formData.location === "rural") {
        if (
          formData.housingType === "kutcha" ||
          formData.landOwnership === "landless" ||
          formData.occupation === "manual_labour"
        ) {
          eligible = true;
          category = "Rural SECC Eligibility";
          reasons.push("Matches deprivation criteria under SECC");
        }
        if (formData.category === "sc_st") {
          eligible = true;
          reasons.push("SC/ST households included under SECC");
        }
      }

      // ✅ Urban Worker Eligibility (Govt Listed Occupations)
      if (formData.location === "urban") {
        const urbanEligibleJobs = [
          "street_vendor",
          "domestic_worker",
          "construction_worker",
          "waste_picker",
          "rickshaw_puller",
          "security_guard",
          "gardener",
          "sweeper",
          "electrician",
          "plumber",
          "tailor",
          "painter",
          "coolie",
          "auto_driver",
        ];

        if (urbanEligibleJobs.includes(formData.occupation)) {
          eligible = true;
          category = "Urban Informal Worker";
          reasons.push("Matches eligible occupation list by PM-JAY");
        }
      }

      // Ration Card Logic
      if (
        formData.hasRation === "yes" &&
        ["bpl", "antyodaya"].includes(formData.rationType)
      ) {
        eligible = true;
        category = "Ration Card Holder";
        reasons.push("BPL/Antyodaya ration card holders are eligible");
      }

      // Income Logic
      if (formData.income === "below_1_lakh") {
        reasons.push("Low income fits typical PM-JAY beneficiary profile");
      }

      finish(eligible, category || "General Eligibility", reasons);

      function finish(status, category, reasonsArr) {
        setResult({
          eligible: status,
          category,
          reasons: reasonsArr,
        });
        setIsChecking(false);
      }
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
      employmentType: "",
      housingType: "",
      landOwnership: "",
      hasVehicle: "",
      isTaxPayer: "",
      houseType: "",
      landSize: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="p-5 bg-white shadow-xl rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Heart className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-4xl font-extrabold text-blue-700 mt-4 tracking-tight">
            PM-JAY Eligibility Checker
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Government Verified Eligibility Indicators
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-blue-100">

          {!result ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Location */}
                <SelectField name="location" label="Location *" value={formData.location} onChange={handleChange}
                  options={{ rural: "Rural", urban: "Urban" }} />

                {/* Category */}
                <SelectField name="category" label="Social Category" value={formData.category} onChange={handleChange}
                  options={{ general: "General", obc: "OBC", sc_st: "SC/ST" }} />

                {/* Income */}
                <SelectField name="income" label="Annual Income" value={formData.income} onChange={handleChange}
                  options={{
                    below_1_lakh: "Below ₹1 lakh",
                    "1_to_3_lakh": "₹1–3 lakh",
                    above_3_lakh: "Above ₹3 lakh",
                  }} />

                {/* Employment */}
                <SelectField name="employmentType" label="Employment Type *" value={formData.employmentType}
                     onChange={handleChange}
                  options={{
                    govt_employee: "Government Employee ❌",
                    private_employee: "Private Employee",
                    self_employed: "Self-employed",
                    unemployed: "Unemployed",
                  }} />

                {/* Occupation */}
                <SelectField name="occupation" label="Occupation" value={formData.occupation} onChange={handleChange}
                  options={{
                    manual_labour: "Manual Labour",
                    street_vendor: "Street Vendor",
                    domestic_worker: "Domestic Worker",
                    construction_worker: "Construction Worker",
                    waste_picker: "Waste Picker",
                    rickshaw_puller: "Rickshaw Puller",
                    security_guard: "Security Guard",
                    painter: "Painter",
                    tailor: "Tailor",
                    electrician: "Electrician",
                    plumber: "Plumber",
                  }} />

                {/* Asset-Based Govt Rules */}
                <SelectField name="isTaxPayer" label="Are you an Income Tax Payer?" value={formData.isTaxPayer}
                  onChange={handleChange} options={{ yes: "Yes (Not Eligible)", no: "No" }} />

                <SelectField name="hasVehicle" label="Owns 2/4 wheeler / Tractor?" value={formData.hasVehicle}
                  onChange={handleChange} options={{ yes: "Yes (Not Eligible)", no: "No" }} />

                <SelectField name="houseType" label="House Type" value={formData.houseType} onChange={handleChange}
                  options={{
                    kutcha: "Kutcha (Eligible)",
                    pucca_1_2: "Pucca (1-2 rooms)",
                    pucca_3plus: "Pucca (3+ rooms ❌)",
                  }} />

                <SelectField name="landSize" label="Land Ownership" value={formData.landSize} onChange={handleChange}
                  options={{
                    landless: "Landless (Eligible)",
                    below_5_acres: "< 5 Acre",
                    above_5_acres: "> 5 Acre ❌",
                  }} />
              </div>

              {/* Submit Button */}
              <button
                onClick={checkEligibility}
                disabled={!formData.location || !formData.employmentType}
                className="
                  w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg
                  shadow-lg hover:bg-blue-700 transition
                "
              >
                {isChecking ? "Checking..." : "Check Eligibility"}
              </button>
            </>
          ) : (
            <>
              {/* RESULT */}
              <ResultCard result={result} />

              {/* ACTION BUTTONS */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button onClick={resetForm}
                  className="w-full sm:w-1/2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-black transition">
                  🔄 Check Again
                </button>

                <a href="https://beneficiary.nha.gov.in/" target="_blank"
                  className="w-full sm:w-1/2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition text-center">
                  💳 Make Ayushman Card
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------- Helper Components --------------------- */

function SelectField({ name, label, value, onChange, options }) {
  return (
    <div>
      <label className="font-semibold text-gray-700 mb-1 block">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl p-3 bg-gray-50"
      >
        <option value="">Select</option>
        {Object.entries(options).map(([key, val]) => (
          <option key={key} value={key}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <>
      <div className={`p-10 rounded-2xl ${result.eligible ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}`}>
        <div className="flex justify-center mb-4">
          {result.eligible ? (
            <CheckCircle className="w-20 h-20 text-green-600" />
          ) : (
            <XCircle className="w-20 h-20 text-red-600" />
          )}
        </div>

        <h2 className={`text-3xl text-center font-extrabold ${result.eligible ? "text-green-700" : "text-red-700"}`}>
          {result.eligible ? "Likely Eligible 🎉" : "Not Eligible ❌"}
        </h2>

        {result.category && (
          <p className="text-center text-lg mt-2 text-gray-700 font-bold">
            Category: {result.category}
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {result.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">•</span>
              <span className="text-gray-700 text-lg">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-xl p-5 shadow">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
          <div className="text-gray-700 text-sm">
            <p className="font-bold mb-2">Important Notes:</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>This result is an indicative assessment.</li>
              <li>Final eligibility depends on SECC-2011 government database.</li>
              <li>
                Verify officially at{" "}
                <a className="text-blue-600" href="https://pmjay.gov.in">
                  pmjay.gov.in
                </a>
              </li>
              <li>PM-JAY Helpline: 14555</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
