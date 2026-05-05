import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value;

  // Proteksi umum: semua /dashboard butuh token
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Proteksi admin: hanya role "admin" boleh akses /dashboard/admin
      if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (err) {
      // Token tidak valid atau expired → redirect ke login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};