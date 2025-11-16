import React, { useEffect, useState } from "react";
import HospitalCard from "../../components/HospitalCard";
import { getHospitals } from "../../api/hospitalApi";
import Loader from "../../components/Loader";
import { SlidersHorizontal } from "lucide-react";

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [ratingRange, setRatingRange] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");

  const specialityOptions = [
    "Eye Care Hospital",
    "Dental",
    "Multi-speciality",
    "Cardiac",
    "Neuro",
    "Orthopedic",
    "General"
  ];

  const ratingOptions = [
    { value: "1-2", label: "1 ★ – 2 ★" },
    { value: "2-3", label: "2 ★ – 3 ★" },
    { value: "3-4", label: "3 ★ – 4 ★" },
    { value: "4-5", label: "4 ★ – 5 ★" }
  ];

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitals();
        const list = res.data || res;
        setHospitals(list);
        setFiltered(list);
      } catch {
        setHospitals([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Apply Filters
  useEffect(() => {
    let data = hospitals;

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (h) =>
          h.hospitalName.toLowerCase().includes(s) ||
          h.speciality.toLowerCase().includes(s)
      );
    }

    if (location.trim()) {
      const l = location.toLowerCase();
      data = data.filter(
        (h) =>
          h.district.toLowerCase().includes(l) ||
          h.state.toLowerCase().includes(l)
      );
    }

    if (ratingRange) {
      const [min, max] = ratingRange.split("-").map(Number);
      data = data.filter(
        (h) => Number(h.rating) >= min && Number(h.rating) <= max
      );
    }

    if (specialityFilter) {
      data = data.filter(
        (h) =>
          h.speciality.toLowerCase() === specialityFilter.toLowerCase()
      );
    }

    setFiltered(data);
    setPage(1);
  }, [search, location, ratingRange, specialityFilter, hospitals]);

  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setRatingRange("");
    setSpecialityFilter("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4">

      {/* ===================================================== */}
      {/* HERO IMAGE SECTION */}
      {/* ===================================================== */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg mb-10">
        <img
          src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress"
          className="w-full h-64 object-cover brightness-75"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="text-4xl font-extrabold drop-shadow-lg">
            Search Trusted Hospitals
          </h2>
          <p className="text-lg mt-2 max-w-xl opacity-90">
            Find Ayushman Bharat & PM-JAY empaneled hospitals across India.
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <SlidersHorizontal className="text-blue-600" size={22} />
        <h2 className="text-3xl font-semibold text-gray-900">
          Find Nearby Hospitals
        </h2>
      </div>

      {/* FILTER BOX */}
      <div
        className="
          bg-white/70 backdrop-blur-xl 
          shadow-[0_10px_25px_rgba(0,0,0,0.07)]
          border border-gray-200
          rounded-3xl p-6 md:p-7 
          space-y-5 
          transition-all
        "
      >
        {/* Search + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search hospital or speciality…"
            className="
              p-3 rounded-xl border border-gray-300 
              shadow-sm focus:ring-2 focus:ring-blue-500
              transition bg-white/80
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search by District / State…"
            className="
              p-3 rounded-xl border border-gray-300 
              shadow-sm focus:ring-2 focus:ring-blue-500
              bg-white/80
            "
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Rating + Speciality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="
              p-3 rounded-xl border 
              shadow-sm bg-white/80
              focus:ring-2 focus:ring-blue-500 
            "
            value={ratingRange}
            onChange={(e) => setRatingRange(e.target.value)}
          >
            <option value="">Filter by Rating</option>
            {ratingOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            className="
              p-3 rounded-xl border shadow-sm 
              bg-white/80 focus:ring-2 focus:ring-blue-500
            "
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
          >
            <option value="">Filter by Speciality</option>
            {specialityOptions.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="
            w-full md:w-48 p-3 bg-gray-800 text-white 
            rounded-xl shadow-md hover:bg-black transition
          "
        >
          Clear Filters
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {paginated.length ? (
            <>
              {/* Hospital Cards */}
              <div className="grid grid-cols-1 gap-5 mt-8">
                {paginated.map((h) => (
                  <HospitalCard key={h.slNo} hospital={h} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8 bg-white p-3 rounded-xl shadow">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
                >
                  Previous
                </button>

                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-700 text-center mt-10 text-lg">
              No hospitals match your filters 😕
            </div>
          )}
        </>
      )}
    </div>
  );
}
