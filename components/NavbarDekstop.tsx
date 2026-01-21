"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type MenuItem = {
  name: string;
  href: string;
  auth?: boolean;
};

export default function NavbarDekstop() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, role, logout } = useAuth();

  const menu: MenuItem[] = [
    { name: "Home", href: "/" },
    { name: "Biographies", href: "/biographies" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news"},
  ];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    logout();
    router.push("/");
  };

  return (
    <nav className="hidden lg:block sticky top-0 z-30 bg-[#F3B800] shadow-md py-5 px-3.5">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={100}
            className="object-contain transition-transform duration-300 hover:scale-110"
            priority
          />
        </Link>

        {/* Menu */}
        <ul className="flex space-x-9 font-bold text-[#0F0E0E] items-center">
          {/* Hanya tampilkan menu jika bukan admin */}
          {role !== "admin" &&
            menu
              .filter((item) => !item.auth || isLoggedIn)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span className="relative inline-block group">
                        <span
                          className={`transition-colors duration-300 ${
                            isActive ? "text-[#DC0000]" : "group-hover:text-[#E0D9D9]"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`absolute left-0 -bottom-1 h-0.5 bg-black transition-all duration-300
                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}

          {/* Profil */}
          {isLoggedIn && (
            <li className="flex items-center gap-3">
              <Link href="/profile">
                <Image
                  src="/icons/avatar.png"
                  alt="Profile"
                  width={40}
                  height={50}
                  className="rounded hover:scale-110 transition-transform"
                />
              </Link>
            </li>
          )}

          {!isLoggedIn && (
            <li>
              <Link
                href="/register"
                className="inline-block bg-[#0F0E0E] rounded-full py-1 px-4 font-bold text-[#F3B800] hover:bg-amber-100 hover:text-[#0F0E0E]"
              >
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
