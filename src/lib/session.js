import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "lostordos_session";

function getSecret() {
  const s = process.env.SESSION_SECRET || "fallback-dev-secret-change-in-prod";
  return new TextEncoder().encode(s);
}

export async function createSession({ id, nombre, rol }) {
  return new SignJWT({ id, nombre, rol })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookie() {
  return COOKIE_NAME;
}
