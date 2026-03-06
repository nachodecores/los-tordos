import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, getSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(getSessionCookie())?.value;

  if (!token) {
    return NextResponse.json({ usuario: null }, { status: 200 });
  }

  const payload = await verifySession(token);
  if (!payload) {
    return NextResponse.json({ usuario: null }, { status: 200 });
  }

  return NextResponse.json({
    usuario: {
      id: payload.id,
      nombre: payload.nombre,
      rol: payload.rol,
    },
  });
}
