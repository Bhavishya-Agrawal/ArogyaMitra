import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHospitalById } from "../../api/hospitalApi";
import Loader from "../../components/Loader";

import { MapPin, Star, Building2, BadgeInfo } from "lucide-react";

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitalById(id);
        console.log(res.data);
        setHospital(res.data);
      } catch (e) {
        setHospital(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!hospital)
    return <div className="text-center text-gray-600 mt-10">Hospital not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Image */}
        <img
          src={hospital.photoUrl || "https://dummyimage.com/600x400/cccccc/000000&text=Hospital"}
          alt={hospital.hospitalName}
          className="w-full h-56 object-cover"
        />

        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Title + Rating */}
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {hospital.hospitalName}
            </h2>

            {/* Rating Badge */}
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
              {hospital.rating || "N/A"}
            </div>
          </div>

          {/* Address */}
          <div className="flex gap-3 items-start bg-blue-50 rounded-xl p-3 border border-blue-100">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Address</p>
              <p className="text-gray-700">{hospital.address}</p>
            </div>
          </div>

          {/* Specialty */}
          <div className="flex gap-3 items-start bg-teal-50 rounded-xl p-3 border border-teal-100">
            <Building2 className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Speciality</p>
              <p className="text-gray-700">
                {hospital.speciality || hospital.specialty || "General"}
              </p>
            </div>
          </div>

          {/* Other Details */}
          <div className="flex gap-3 items-start bg-purple-50 rounded-xl p-3 border border-purple-100">
            <BadgeInfo className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">Additional Info</p>
              <p className="text-gray-700"><strong>Hospital ID:</strong> {hospital.hospitalId}</p>
              <p className="text-gray-700"><strong>District:</strong> {hospital.district}</p>
              <p className="text-gray-700"><strong>State:</strong> {hospital.state}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
