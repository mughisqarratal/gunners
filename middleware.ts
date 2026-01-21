import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id");
  const role = request.cookies.get("role");
  const pathname = request.nextUrl.pathname;

  // proteksi umum
  if (pathname.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // proteksi admin
  if (pathname.startsWith("/dashboard/admin")) {
    if (!userId || role?.value !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
