"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { 
  LogOut, Eye, EyeOff, User, Mail, Lock, Camera, Settings, X, ChevronRight 
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [user, setUser] = useState<{ name?: string; email?: string; image?: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ===== FORM STATE =====
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ===== VISIBILITY STATE =====
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ===== LOADING STATE PER ACTION =====
  const [loadingAction, setLoadingAction] = useState<"name" | "email" | "password" | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    logout();
    router.refresh();
    router.push("/");
  };

  const handleUpdateName = async () => {
    if (name.trim().length < 3) {
      return Swal.fire({ icon: "warning", title: "Oops!", text: "Nama minimal 3 karakter", confirmButtonColor: "#000" });
    }
    
    setLoadingAction("name");
    try {
      const res = await fetch("/api/profile/name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, name }));
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Nama kamu sudah diperbarui.", confirmButtonColor: "#000" });
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message || "Gagal update nama", confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email || !emailPassword) {
      return Swal.fire({ icon: "warning", title: "Peringatan", text: "Email dan Password wajib diisi", confirmButtonColor: "#000" });
    }

    setLoadingAction("email");
    try {
      const res = await fetch("/api/profile/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: emailPassword }),
      });
      
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Email Terupdate", text: "Silakan login kembali dengan email baru.", confirmButtonColor: "#000" }).then(() => {
          handleLogout();
        });
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message, confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire("Error", "Gagal menghubungi server", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      return Swal.fire({ icon: "warning", title: "Password Lemah", text: "Password baru minimal 8 karakter", confirmButtonColor: "#000" });
    }

    setLoadingAction("password");
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        Swal.fire({ icon: "success", title: "Berhasil", text: "Password berhasil diperbarui", confirmButtonColor: "#000" });
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: data.message, confirmButtonColor: "#000" });
      }
    } catch (err) {
      Swal.fire("Error", "Gagal menghubungi server", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main  className="bg-[#000000]">
    <div className="min-h-screen relative overflow-hidden bg-[url(/images/bg1.webp)] px-3 bg-fixed sm:bg-top bg-repeat-x sm:bg-size-[auto_915px] bg-position-[center_top_3rem] bg-size-[auto_290px]">
      {/* ===== MAIN CONTENT ===== */}
      <section className="max-w-md mx-auto px-3 py-35">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center relative overflow-hidden ">
          <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
          
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {user.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500 mb-6">{user.email}</p>

          <div className="space-y-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <Settings size={20} />
                <span className="font-medium">Pengaturan Akun</span>
              </div>
              <ChevronRight size={18} />
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-3 bg-gray-100 hover:bg-gray-200 p-4 rounded-md transition-all cursor-pointer"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      </section>

      {/* ===== SIDEBAR OVERLAY ===== */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR DRAWER ===== */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Pengaturan Akun</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Ubah Nama */}
            <div>
              <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={name} 
                  disabled={loadingAction !== null}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none disabled:bg-gray-50"
                />
                <button 
                  onClick={handleUpdateName} 
                  disabled={loadingAction !== null}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold disabled:bg-gray-400 min-w-17.5 cursor-pointer"
                >
                  {loadingAction === "name" ? "..." : "Simpan"}
                </button>
              </div>
            </div>

            {/* Ubah Email */}
            <div className="pt-4 border-t">
              <label className="text-sm font-bold mb-2 flex items-center gap-2">
                <Mail size={16} /> Ganti Email
              </label>
              <div className="space-y-2">
                <input 
                  type="email" 
                  value={email} 
                  disabled={loadingAction !== null}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 text-sm outline-none disabled:bg-gray-50"
                  placeholder="Email baru"
                />
                <div className="relative">
                  <input 
                    type={showEmailPassword ? "text" : "password"}
                    value={emailPassword}
                    disabled={loadingAction !== null}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm pr-10 outline-none disabled:bg-gray-50"
                    placeholder="Konfirmasi Password"
                  />
                  <button onClick={() => setShowEmailPassword(!showEmailPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                    {showEmailPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button 
                  onClick={handleUpdateEmail} 
                  disabled={loadingAction !== null}
                  className="w-full bg-black text-white py-2 rounded-xl text-sm font-bold disabled:bg-gray-400 cursor-pointer"
                >
                  {loadingAction === "email" ? "Memproses..." : "Update Email"}
                </button>
              </div>
            </div>

            {/* Ubah Password */}
            <div className="pt-4 border-t pb-10">
              <label className=" text-sm font-bold mb-2 flex items-center gap-2">
                <Lock size={16} /> Ganti Password
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    disabled={loadingAction !== null}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm pr-10 outline-none disabled:bg-gray-50"
                    placeholder="Password Lama"
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    disabled={loadingAction !== null}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm pr-10 outline-none disabled:bg-gray-50"
                    placeholder="Password Baru"
                  />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button 
                  onClick={handleUpdatePassword} 
                  disabled={loadingAction !== null}
                  className="w-full bg-black text-white py-2 rounded-xl text-sm font-bold disabled:bg-gray-400 cursor-pointer"
                >
                  {loadingAction === "password" ? "Memproses..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    </main>
  );
}