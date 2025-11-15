import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { register as registerApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const n = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await registerApi(form);
      setMsg("Registration successful. Redirecting to login…");
      setTimeout(() => n("/login"), 1000);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Create Your Account
      </h2>

      {/* Form Box */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <form onSubmit={submit} className="space-y-5">

          {/* Full Name */}
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          {/* Aadhaar */}
          <Input
            label="Aadhaar Number"
            value={form.aadhaar}
            onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
          />

          {/* PASSWORD (NEW) */}
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {/* Status Message */}
          {msg && (
            <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 p-2 rounded-lg">
              {msg}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full">
            {loading ? "Creating Account…" : "Register"}
          </Button>

        </form>
      </div>

      {/* Bottom Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
