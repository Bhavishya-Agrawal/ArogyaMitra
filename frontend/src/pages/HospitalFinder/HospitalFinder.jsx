import React, { useEffect, useState } from "react";
import HospitalCard from "../../components/HospitalCard";
import { getHospitals } from "../../api/hospitalApi";
import Loader from "../../components/Loader";

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitals({ q: "" });
        setHospitals(res.data || []);
      } catch (e) {
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Nearby Hospitals
      </h2>

      {/* Loader */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Hospitals List */}
          {hospitals.length ? (
            <div className="grid grid-cols-1 gap-5">
              {hospitals.map((h) => (
                <HospitalCard key={h._id} hospital={h} />
              ))}
            </div>
          ) : (
            <div className="text-gray-700 text-center mt-10">
              No hospitals found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
