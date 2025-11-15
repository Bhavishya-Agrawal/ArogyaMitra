import React, { useEffect, useState } from "react";
import HospitalCard from "../../components/HospitalCard";
import { getHospitals } from "../../api/hospitalApi";
import Loader from "../../components/Loader";

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");  // ⭐ NEW

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitals();
        const list = res.data || res;
        setHospitals(list);
        setFiltered(list);
      } catch (e) {
        setHospitals([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // FILTERS: search + location + rating
  useEffect(() => {
    let data = hospitals;

    // search by hospitalName OR speciality
    if (search.trim() !== "") {
      data = data.filter(
        (h) =>
          h.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
          h.speciality.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filter by district or state
    if (location.trim() !== "") {
      data = data.filter(
        (h) =>
          h.district.toLowerCase().includes(location.toLowerCase()) ||
          h.state.toLowerCase().includes(location.toLowerCase())
      );
    }

    // ⭐ filter by min rating (4.5, 4.0, 3.5 etc.)
    if (minRating !== "") {
      data = data.filter((h) => Number(h.rating) >= Number(minRating));
    }

    setFiltered(data);
    setPage(1);
  }, [search, location, minRating, hospitals]);

  // Pagination logic
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = filtered.slice(start, end);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Nearby Hospitals
      </h2>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row mb-6 gap-4">

        {/* Search by name */}
        <input
          type="text"
          placeholder="Search hospital or speciality..."
          className="border px-3 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Location filter */}
        <input
          type="text"
          placeholder="Enter location (District/State)"
          className="border px-3 py-2 rounded w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* ⭐ Rating filter */}
        <select
          className="border px-3 py-2 rounded w-full md:w-48"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Filter by Rating</option>
          <option value="4.5">4.5 ★ & Up</option>
          <option value="4.0">4.0 ★ & Up</option>
          <option value="3.5">3.5 ★ & Up</option>
          <option value="3.0">3.0 ★ & Up</option>
        </select>
      </div>

      {/* Loader */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {paginated.length ? (
            <>
              <div className="grid grid-cols-1 gap-5">
                {paginated.map((h) => (
                  <HospitalCard key={h.slNo} hospital={h} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
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
            <div className="text-gray-700 text-center mt-10">
              No hospitals found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
