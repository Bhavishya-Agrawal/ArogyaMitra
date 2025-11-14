import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHospitalById } from "../../api/hospitalApi";
import Loader from "../../components/Loader";

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitalById(id);
        setHospital(res.data);
      } catch (e) {
        setHospital(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!hospital) return <div className="text-center text-gray-600 mt-10">Hospital not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900">
          {hospital.name}
        </h2>

        {/* Address */}
        <p className="text-sm text-gray-600 mt-2">
          {hospital.address}
        </p>

        {/* Specialty */}
        <div className="mt-4">
          <span className="font-medium text-gray-800">Specialty:</span>{" "}
          <span className="text-gray-700">
            {hospital.specialty || "General"}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-3">
          <span className="font-medium text-gray-800">Rating:</span>{" "}
          <span className="text-blue-600 font-semibold">
            {hospital.rating || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
