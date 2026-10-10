"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // ✅ ICON KELUAR

const listLInk = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
  },
  {
    href: "/dashboard/admin/gallery",
    label: "Gallery",
  },
  {
    href: "/dashboard/admin/biographies",
    label: "Biographies",
  },
  {
    href: "/dashboard/admin/news",
    label: "News",
  },
  {
    href: "/dashboard/admin/albums",
    label: "Albums",
  },
]
interface linkProps {
  href: string;
  label: string;
}

export const LinkCover = ({ href, label }: linkProps) => {
  return (
    <Link href={href} className="hover:bg-gray-800 px-3 py-2 rounded">
      {label}
    </Link>
  );
};

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
          {listLInk.map ((link) => (
            <LinkCover key={link.href} href={link.href} label={link.label} />
          ))}
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
