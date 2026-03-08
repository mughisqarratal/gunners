import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";

import NavbarDekstop from "@/components/NavbarDekstop";
import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "GNR Indonesia",
  description: "Website resmi Guns N' Roses Indonesia",
  icons: {
    icon: "/gnr.ico",
    shortcut: "/gnr.ico",
    apple: "/gnr.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_id");

  return (
    <html lang="id">
      <body>
        {/* ✅ AuthProvider AKTIF */}
        <AuthProvider initialLogin={isLoggedIn}>
          <NavbarMobile />
          <NavbarDekstop />

          <main className="min-h-screen">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
