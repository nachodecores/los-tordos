import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

function createLogoutResponse(request) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    303
  );
  response.cookies.set(getSessionCookie(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export async function GET(request) {
  return createLogoutResponse(request);
}

export async function POST(request) {
  return createLogoutResponse(request);
}
