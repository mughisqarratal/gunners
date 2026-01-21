"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Link reset password telah dikirim ke email");
      setEmail("");
    } else {
      setMessage(data.error || "Terjadi kesalahan");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-cyan-800 px-3">
      <div className="w-full max-w-md pt-9">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-6"
        >
          <h1 className="text-2xl font-bold text-center">Lupa Kata Sandi</h1>

          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full h-12 rounded border px-3 text-base
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded bg-blue-600 text-white font-medium
              hover:bg-blue-700 disabled:opacity-60 transition
              flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Loading..." : "Kirim Link Reset"}
          </button>

          {message && (
            <p className="text-center text-sm text-blue-600">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
