"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password Baru
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 menit (300 detik)
  const [showPass, setShowPass] = useState(false);

  // Logic Countdown untuk Step 2
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // STEP 1: Kirim OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
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
      setStep(2);
      setTimer(300); // Reset timer ke 5 menit
    } else {
      setMessage(data.message || "Email tidak ditemukan");
    }
  };

  // STEP 2: Verifikasi OTP (Hanya lokal/logic pindah step)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setMessage("Masukkan 4 digit OTP");
      return;
    }
    setMessage("");
    setStep(3);
  };

  // STEP 3: Reset Password Final
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Password berhasil diubah! Silakan login.");
      window.location.href = "/login";
    } else {
      setMessage(data.message || "Gagal mereset password");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-[url(/images/bg.webp)] bg-cover px-3">
      <div className="w-full max-w-md pt-7">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-center">
            {step === 1 && "Lupa Kata Sandi"}
            {step === 2 && "Verifikasi OTP"}
            {step === 3 && "Kata Sandi Baru"}
          </h1>

          {/* FORM STEP 1: INPUT EMAIL */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 text-center">Masukkan email untuk menerima kode OTP 4 digit.</p>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full h-12 rounded border px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {loading ? "Mengirim..." : "Kirim OTP"}
              </button>
            </form>
          )}

          {/* FORM STEP 2: INPUT OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 text-center">Kode dikirim ke <span className="font-bold">{email}</span></p>
              <input
                type="text"
                maxLength={4}
                placeholder="0000"
                className="w-full h-14 rounded border px-3 text-center text-2xl tracking-[1rem] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="text-center text-sm">
                {timer > 0 ? (
                  <p className="text-gray-500">Kirim ulang dalam <span className="text-red-500 font-bold">{formatTime(timer)}</span></p>
                ) : (
                  <button type="button" onClick={handleRequestOtp} className="text-blue-600 font-bold">Kirim Ulang OTP</button>
                )}
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Verifikasi OTP
              </button>
            </form>
          )}

          {/* FORM STEP 3: INPUT PASSWORD BARU */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password Baru"
                  className="w-full h-12 rounded border px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <input
                type="password"
                placeholder="Konfirmasi Password Baru"
                className="w-full h-12 rounded border px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                {loading ? "Memproses..." : "Reset Password"}
              </button>
            </form>
          )}

          {message && (
            <p className="text-center text-sm text-red-600 font-medium italic">{message}</p>
          )}
          
          <button 
            type="button" 
            onClick={() => window.location.href = "/login"}
            className="text-center text-sm text-gray-500 hover:underline"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    </section>
  );
}