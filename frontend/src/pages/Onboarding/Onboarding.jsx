import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHospital,
  FaXRay,
  FaAmbulance,
  FaUserMd,
} from "react-icons/fa";
import gsap from "gsap";
import { getHospitals } from "../../api/hospitalApi";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [hospitalList, setHospitalList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  // GSAP Button Ref
  const btnRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
  if (!btnRef.current) return;

  // Ultra-fast floating movement
  gsap.to(btnRef.current, {
    y: -22,
    duration: 0.6,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
  });

  // Neon glow pulsing effect
  gsap.to(btnRef.current, {
    boxShadow: "0 0 40px rgba(0, 150, 255, 1)",
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "power3.inOut",
  });

  // Subtle fast vibration for energy effect
  gsap.to(btnRef.current, {
    x: 2,
    duration: 0.08,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // Elastic bounce rotation effect
  gsap.to(btnRef.current, {
    rotate: 3,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "elastic.inOut(1, 0.4)",
  });
}, []);


  // Fetch hospitals
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHospitals();
        setHospitalList(res.data || res);
      } catch {
        setHospitalList([]);
      }
    };
    load();
  }, []);

  // Search filter
  useEffect(() => {
    if (search.trim() === "") return setFiltered([]);

    const results = hospitalList.filter((h) =>
      h.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      h.district.toLowerCase().includes(search.toLowerCase()) ||
      h.state.toLowerCase().includes(search.toLowerCase()) ||
      h.speciality.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results.slice(0, 6));
  }, [search, hospitalList]);

  const handleSelect = (id) => {
    setSearch("");
    setFiltered([]);
    navigate(`/hospitals/${id}`);
  };

  return (
    <div className="font-sans mt-20">

      {/* ================================ */}
      {/* HERO SECTION */}
      {/* ================================ */}

      <section className="relative bg-gradient-to-r from-blue-50 via-blue to-blue-100 py-24 px-6 rounded-b-3xl rounded-t-xl shadow-sm">

        {/* Background glows */}
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-72 h-72 bg-blue-100 rounded-full blur-2xl opacity-40"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Your Health. Our Priority.
            <br />
            <span className="text-blue-600">PM–JAY Assistance Simplified</span>
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Find Ayushman Bharat hospitals, get AI medical support,
            and verify hospital bills securely.
          </p>

          {/* Search Box */}
          <div className="mt-8 flex justify-center relative">
            <div className="bg-white border border-gray-200 shadow-md rounded-full px-6 py-3 flex items-center gap-3 w-full md:w-96 hover:shadow-lg transition relative">
              <FaSearch className="text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search hospitals or specialties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-gray-700 outline-none"
              />
            </div>

            {filtered.length > 0 && (
              <div className="absolute top-16 bg-white border rounded-xl shadow-lg w-full md:w-96 text-left max-h-64 overflow-y-auto">
                {filtered.map((h) => (
                  <div
                    key={h.slNo}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => handleSelect(h.slNo)}
                  >
                    <p className="font-semibold text-gray-900">{h.hospitalName}</p>
                    <p className="text-gray-600 text-sm">
                      {h.district}, {h.state}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/chat"
              className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              Talk to AI Assistant
            </Link>

            <Link
              to="/hospitals"
              className="px-10 py-3 bg-white text-gray-900 rounded-xl shadow hover:bg-gray-300 transition transform hover:scale-105"
            >
              Find Hospitals
            </Link>
          </div>
        </div>
      </section>

      {/* ================================ */}
      {/* SERVICES */}
      {/* ================================ */}

      <section className="max-w-6xl mx-auto mt-24 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">About Ayushman Bharat</h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Explore the essential treatments and diagnostic services covered in empaneled hospitals.
        </p>

        <div className="grid md:grid-cols-4 gap-10 mt-14">
          {[
            { icon: <FaHospital />, title: "Hospital Admission", desc: "Cashless admission for covered treatments." },
            { icon: <FaUserMd />, title: "Doctor Consultation", desc: "Meet certified medical specialists." },
            { icon: <FaXRay />, title: "X-Ray / Diagnostics", desc: "Tests & diagnostics fully covered." },
            { icon: <FaAmbulance />, title: "Emergency Services", desc: "Get immediate medical help." },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border hover:border-blue-300 shadow-sm hover:shadow-lg hover:-translate-y-2 transition cursor-pointer"
            >
              <div className="text-blue-600 text-5xl">{s.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{s.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================ */}
      {/* AI SUPPORT */}
      {/* ================================ */}

      <section className="max-w-6xl mx-auto mt-28 px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 leading-snug">Get AI-Powered Healthcare Support</h2>

          <p className="text-gray-600 mt-4">
            Our AI helps you understand PM–JAY features, hospital availability,
            and identifies overpricing in medical bills.
          </p>

          <ul className="mt-6 text-gray-700 space-y-3">
            <li>✔ 24/7 AI medical assistant</li>
            <li>✔ Hospital & doctor information</li>
            <li>✔ Medical bill fraud detection</li>
            <li>✔ Ayushman card guidance</li>
          </ul>

          <Link
            to="/chat"
            className="inline-block mt-7 px-7 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Ask the AI Assistant
          </Link>
        </div>

        <img
          src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress"
          alt="AI Support"
          className="rounded-3xl shadow-xl"
        />
      </section>

      {/* ================================ */}
      {/* HOSPITAL IMAGES */}
      {/* ================================ */}

      <section className="max-w-6xl mx-auto mt-28 px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Ayushman Bharat Empaneled Hospitals
        </h2>

        <p className="text-gray-600 text-center mt-3">
          Hospitals across India providing world-class treatment under PM-JAY.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            "https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress",
            "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress",
            "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress",
          ].map((img, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition"
            >
              <img src={img} alt="Hospital" className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ================================ */}
      {/* HELP SECTION */}
      {/* ================================ */}

      <section className="mt-32 bg-gradient-to-r from-blue-50 to-white rounded-t-3xl py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">Need Help?</h2>

          <p className="text-gray-600 mt-4">
            Get instant help related to hospital admission, Ayushman card or medical billing.
          </p>

          <Link
            to="/chat"
            className="mt-10 inline-block px-10 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Contact Support
          </Link>
        </div>
      </section>

      {/* ================================================== */}
      {/* 🔵 GSAP FLOATING BUTTON */}
      {/* ================================================== */}

      <Link
        to="/checkeligibility"
        ref={btnRef}
        className="fixed bottom-6 right-6 z-50
                   px-6 py-3 bg-blue-600 text-white rounded-2xl 
                   shadow-xl hover:bg-blue-700 hover:shadow-2xl
                   transform hover:scale-110 transition-all duration-300
                   flex items-center gap-2 border border-blue-300"
      >
        <FaSearch className="text-lg" />
        Check Eligibility
      </Link>

    </div>
  );
}
