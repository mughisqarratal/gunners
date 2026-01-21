"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password dan ulangi password tidak sama");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Registrasi berhasil");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.error || "Registrasi gagal");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-[#0C0C0C] px-3">
      <div className="w-full max-w-md pt-9">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-6"
        >
          <h1 className="text-2xl font-bold text-center">Register</h1>

          {/* Name */}
          <input
            type="text"
            placeholder="Nama"
            className="w-full h-12 rounded border px-3 text-base
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 rounded border px-3 text-base
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 rounded border px-3 pr-10 text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Ulangi Password"
              className="w-full h-12 rounded border px-3 pr-10 text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded bg-blue-600 text-white font-medium
              hover:bg-blue-700 disabled:opacity-60 transition
              flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Loading..." : "Register"}
          </button>

          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}

          <p className="text-center">Login, jika sudah punya Akun!</p>
          <a
            href="/login"
            className="w-full h-12 rounded bg-blue-600 text-white
              flex items-center justify-center hover:bg-blue-700 transition"
          >
            Login
          </a>
        </form>
      </div>
    </section>
  );
}
