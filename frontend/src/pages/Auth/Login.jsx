import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const n = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await loginApi(form);
      console.log(res);
      login(res.data);
      n("/chat");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Login to Continue
      </h2>

      {/* Form Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <form onSubmit={handle} className="space-y-5">
          
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Error Message */}
          {err && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {err}
            </div>
          )}

          {/* Login Button */}
          <Button type="submit" className="w-full">
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>
      </div>

      {/* Bottom Text */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 font-medium hover:underline"
        >
          Register
        </a>
      </p>
    </div>
  );
}
