"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { signIn } from "next-auth/react";

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
    <main className="bg-[#000000]">
      <section className="flex flex-col items-center justify-center min-h-screen bg-[url(/images/bg1.webp)] px-3 bg-fixed sm:bg-top bg-repeat-x sm:bg-size-[auto_915px] bg-position-[center_top_3rem] bg-size-[auto_290px]">
        <div className="w-full max-w-md">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded bg-blue-600 text-white font-medium
            hover:bg-blue-700 disabled:opacity-60 transition
            flex items-center justify-center gap-2 cursor-pointer"
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

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <p className="text-center">Login, jika sudah punya Akun!</p>

            <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition cursor-pointer">
              <a href="/register">Register</a>
            </button>
            {/* <button
              onClick={() => signIn("google")}
              className="bg-white border p-2 rounded-xl flex items-center justify-center gap-2"
            >
              <img src="/google-icon.png" className="w-5" />
              Daftar dengan Google
            </button> */}
          </form>
        </div>
      </section>
    </main>
  );
}
