import { NextResponse } from "next/server";
import { verifySession, getSessionCookie } from "@/lib/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Proteger /admin excepto /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(getSessionCookie())?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifySession(token);
    if (!payload) {
      const loginUrl = new URL("/admin/login", request.url);
      request.cookies.delete(getSessionCookie());
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
