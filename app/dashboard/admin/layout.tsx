"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // ✅ ICON KELUAR

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch (err) {
      console.error("Logout gagal", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-55 bg-[#0F0E0E] text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/dashboard/admin" className="hover:bg-gray-800 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link href="/dashboard/admin/users" className="hover:bg-gray-800 px-3 py-2 rounded">
            Users
          </Link>
          <Link href="/dashboard/admin/gallery" className="hover:bg-gray-800 px-3 py-2 rounded">
            Gallery
          </Link>
          <Link href="/dashboard/admin/biographies" className="hover:bg-gray-800 px-3 py-2 rounded">
            Biographies
          </Link>
          <Link href="/dashboard/admin/news" className="hover:bg-gray-800 px-3 py-2 rounded">
            News
          </Link>
        </nav>

        {/* 🔴 BUTTON LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-700 hover:bg-red-800 py-2 px-4 rounded
                     cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> {/* ✅ ICON */}
          Keluar
        </button>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
