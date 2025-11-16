import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHospitalById } from "../../api/hospitalApi";
import Loader from "../../components/Loader";

import { MapPin, Star, Building2, BadgeInfo, Phone } from "lucide-react";

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitalById(id);
        setHospital(res.data);
      } catch {
        setHospital(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;

  if (!hospital)
    return (
      <div className="text-center text-gray-600 mt-20 text-lg">
        Hospital not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-24 px-4 animate-fadeIn">

      {/* CARD */}
      <div
        className="
          bg-white/80 
          backdrop-blur-lg 
          rounded-3xl 
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          border border-gray-200 
          overflow-hidden
          transform transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
        "
      >

        {/* IMAGE */}
        <div className="relative">
          <img
            src={
              hospital.photoUrl ||
              "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress"
            }
            alt={hospital.hospitalName}
            className="w-full h-56 object-cover"
          />

          {/* Rating Badge */}
          <div
            className="
              absolute top-4 right-4 
              bg-white/90 backdrop-blur-xl 
              px-4 py-1.5 
              rounded-full 
              flex items-center gap-2 
              shadow-md border
            "
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span className="font-semibold text-gray-800">
              {hospital.rating || "N/A"}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {hospital.hospitalName}
          </h2>

          {/* ADDRESS */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hospital.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex gap-3 items-start 
              bg-blue-50 border border-blue-100 
              p-4 rounded-2xl shadow-sm 
              hover:bg-blue-100 hover:shadow-md transition
              cursor-pointer
            "
          >
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />

            <div>
              <p className="text-sm font-medium text-gray-800">Address</p>
              <p className="text-gray-700 underline leading-snug">
                {hospital.address}
              </p>
            </div>
          </a>

          {/* SPECIALITY */}
          <div
            className="
              flex gap-3 items-start
              bg-teal-50 border border-teal-100 
              p-4 rounded-2xl shadow-sm
            "
          >
            <Building2 className="w-5 h-5 text-teal-600 mt-1" />

            <div>
              <p className="text-sm font-medium text-gray-800">Speciality</p>
              <p className="text-gray-700">
                {hospital.speciality || "General"}
              </p>
            </div>
          </div>

          {/* INFO SECTION */}
          <div
            className="
              flex gap-3 items-start
              bg-purple-50 border border-purple-100 
              p-4 rounded-2xl shadow-sm
            "
          >
            <BadgeInfo className="w-5 h-5 text-purple-600 mt-1" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Hospital Details</p>

              <p className="text-gray-700">
                <strong>ID:</strong> {hospital.hospitalId}
              </p>

              <p className="text-gray-700">
                <strong>District:</strong> {hospital.district}
              </p>

              <p className="text-gray-700">
                <strong>State:</strong> {hospital.state}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
