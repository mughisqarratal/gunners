"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type MenuItem = {
  name: string;
  href: string;
  auth?: boolean;
};

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const menu: MenuItem[] = [
    { name: "Home", href: "/" },
    { name: "Biographies", href: "/biographies" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
  ];

  return (
    <nav className="lg:hidden sticky top-0 z-40 bg-[#F3B800] shadow-md">
      <div className="flex items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link href="/" onClick={closeMenu}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={170}
            height={50}
            className="object-contain"
            priority
          />
        </Link>

        {/* Toggle Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          className=""
        >
          <Image
            src={open ? "/icons/arrow.png" : "/icons/menu1.png"}
            alt={open ? "Close menu" : "Open menu"}
            width={35}
            height={0}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul className="flex flex-col bg-[#0F0E0E] text-white px-6 py-6 space-y-4 text-center font-bold gap-3">
          {menu
            .filter((item) => !item.auth || isLoggedIn)
            .map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={closeMenu}>
                    <span className="relative inline-block group pb-1">
                      <span
                        className={`transition-colors duration-300 ${
                          isActive
                            ? "text-[#F3B800]"
                            : "group-hover:text-[#FF004D]"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`absolute left-0 bottom-0.5 h-0.5 bg-[#F3B800] transition-all duration-300
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}

          {/* Sign Up hanya jika belum login */}
          {!isLoggedIn && (
            <li>
              <Link
                href="/register"
                onClick={closeMenu}
                className="inline-block bg-[#F3B800] rounded-full py-1 px-4 font-bold text-gray-900"
              >
                Sign Up
              </Link>
            </li>
          )}

          {/* ===== PROFILE (PALING BAWAH) ===== */}
          {isLoggedIn && (
            <li className="pt-4 border-t border-gray-700">
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center justify-center gap-1"
              >
                <Image
                  src="/icons/real.png"
                  alt="Profile"
                  width={45}
                  height={28}
                  className="border-white"
                />
                <span className="font-bold">Profile</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
