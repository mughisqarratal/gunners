"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(true);

  // ===== FORM STATE =====
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ===== VISIBILITY STATE =====
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ===== FETCH USER =====
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data);
      setEmail(data.email);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  // ===== LOGOUT =====
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    logout();
    router.refresh();
    router.push("/");
  };

  // ===== UPDATE EMAIL =====
  const handleUpdateEmail = async () => {
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: emailPassword }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.message || "Gagal update email");
      return;
    }

    alert("Email berhasil diubah, silakan login ulang");
    handleLogout();
  };

  // ===== UPDATE PASSWORD =====
  const handleUpdatePassword = async () => {
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(data.message || "Gagal update password");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    alert("Password berhasil diubah");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* ===== PROFILE INFO ===== */}
        <div className="bg-white rounded-xl shadow p-5 text-center mb-5">
          <h1 className="text-xl font-bold">Profile</h1>
          <p className="text-sm text-gray-500">{user.name}</p>
          <p className="text-sm">{user.email}</p>
        </div>

        {/* ===== UPDATE EMAIL ===== */}
        <div className="bg-white rounded-xl shadow p-5 grid gap-3 mb-5">
          <h2 className="font-semibold">Ganti Email</h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Email baru"
          />

          <div className="relative">
            <input
              type={showEmailPassword ? "text" : "password"}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm pr-10"
              placeholder="Password saat ini"
            />
            <button
              type="button"
              onClick={() => setShowEmailPassword(!showEmailPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={handleUpdateEmail}
            disabled={saving}
            className="w-full bg-black text-white py-2 rounded text-sm cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Update Email"}
          </button>
        </div>

        {/* ===== UPDATE PASSWORD ===== */}
        <div className="bg-white rounded-xl shadow p-5 grid gap-3 mb-5">
          <h2 className="font-semibold">Ganti Password</h2>

          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm pr-10"
              placeholder="Password lama"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm pr-10"
              placeholder="Password baru (min 8 karakter)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={saving}
            className="w-full bg-black text-white py-2 rounded text-sm cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Update Password"}
          </button>
        </div>

        {/* ===== ERROR ===== */}
        {message && (
          <p className="text-center text-sm text-red-600 mb-5">{message}</p>
        )}

        {/* ===== LOGOUT ===== */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded font-bold cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </section>
  );
}
