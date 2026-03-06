import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Nombre y contraseña",
      credentials: {
        nombre: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nombre || !credentials?.password) return null;
        const nombreNorm = credentials.nombre.trim();
        const usuario = await prisma.usuario.findFirst({
          where: {
            nombre: { equals: nombreNorm, mode: "insensitive" },
          },
        });
        if (!usuario) return null;
        const valid = await bcrypt.compare(
          credentials.password,
          usuario.password_hash
        );
        if (!valid) return null;
        return {
          id: usuario.id,
          name: usuario.nombre,
          rol: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.rol = token.rol;
        session.user.nombre = token.name;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
