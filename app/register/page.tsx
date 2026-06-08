"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { bebas, openSans, lora } from "../fonts";

export default function RegisterPage() {
  const router = useRouter();
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
      router.push("/login");
    } else {
      setMessage(data.error || "Registrasi gagal");
    }
  };

  return (
    <main className="bg-[#000000]">
      <section className="flex flex-col items-center justify-center min-h-screen bg-[url(/images/bg1.webp)] px-3 bg-fixed sm:bg-top bg-repeat-x sm:bg-size-[auto_915px] bg-position-[center_top_3rem] bg-size-[auto_290px]">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 flex flex-col gap-6"
          >
            <h1 className={`${bebas.className} text-3xl font-bold text-center`}>
              Register
            </h1>

            {/* Name */}
            <input
              type="text"
              placeholder="Nama"
              className={`${openSans.className} w-full h-12 rounded border px-3 text-base
              focus:outline-none focus:ring-2 focus:ring-[#F3B800]`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className={`${openSans.className} w-full h-12 rounded border px-3 text-base
              focus:outline-none focus:ring-2 focus:ring-[#F3B800]`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${openSans.className} w-full h-12 rounded border px-3 pr-10 text-base
                focus:outline-none focus:ring-2 focus:ring-[#F3B800]`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi Password"
                className={`${openSans.className} w-full h-12 rounded border px-3 pr-10 text-base
                focus:outline-none focus:ring-2 focus:ring-[#F3B800]`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${lora.className} w-full h-12 font-bold rounded flex items-center justify-center text-[#242424]
    bg-linear-to-r
    from-[#DC0000]
    via-[#F56A00]
    to-[#F3B800]
    hover:grayscale-150
    transition-all
    duration-300 cursor-pointer`}
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? "Loading..." : "Register"}
            </button>

            {message && (
              <p className="text-center text-sm text-blue-600">{message}</p>
            )}

            <p className={`${openSans.className} text-center`}>
              Login, jika sudah punya Akun!
            </p>
            <a
              href="/login"
              className={`${lora.className} w-full h-12 font-bold rounded flex items-center justify-center text-[#242424]
    bg-linear-to-r
    from-[#F3B800]
    via-[#F56A00]
    to-[#DC0000]
    hover:grayscale-150
    transition-all
    duration-300`}
            >
              Login
            </a>
          </form>
        </div>
      </section>
    </main>
  );
}
