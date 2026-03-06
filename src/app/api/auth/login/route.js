import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, getSessionCookie } from "@/lib/session";

export async function POST(request) {
  try {
    const { nombre, password } = await request.json();

    if (!nombre || !password) {
      return NextResponse.json(
        { error: "Nombre y contraseña requeridos" },
        { status: 400 }
      );
    }

    const nombreNorm = nombre.trim();
    const usuario = await prisma.usuario.findFirst({
      where: {
        nombre: { equals: nombreNorm, mode: "insensitive" },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = await createSession({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    const response = NextResponse.json({ ok: true, nombre: usuario.nombre });
    response.cookies.set(getSessionCookie(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
