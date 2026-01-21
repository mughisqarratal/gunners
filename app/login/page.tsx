"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login gagal");

      // Update auth state + role
      login(data.role);

      // Redirect berdasarkan role
      if (data.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify min-h-screen text-center bg-cyan-800 px-3">
      <div className="w-full max-w-md pt-9">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/gnr.png"
            alt="Logo"
            width={160}
            height={60}
            className="w-40 sm:w-50 h-auto"
            priority
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center">Login</h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 rounded border px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 rounded border px-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded bg-blue-600 text-white font-medium
            hover:bg-blue-700 disabled:opacity-60 transition
            flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Loading..." : "Login"}
          </button>

          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline text-right"
          >
            Lupa kata sandi?
          </Link>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <p className="text-center">Login, jika sudah punya Akun!</p>

          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
            <a href="/register">Register</a>
          </button>
        </form>
      </div>
    </section>
  );
}
