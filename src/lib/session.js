import { sealData, unsealData } from "iron-session";

const COOKIE_NAME = "lostordos_session";

function getPassword() {
  return process.env.SESSION_SECRET || "fallback-dev-secret-change-in-prod-32ch";
}

export async function createSession({ id, nombre, rol }) {
  return sealData(
    { id, nombre, rol },
    { password: getPassword(), ttl: 60 * 60 * 24 * 7 }
  );
}

export async function verifySession(encrypted) {
  try {
    const payload = await unsealData(encrypted, { password: getPassword() });
    return payload && payload.id ? payload : null;
  } catch {
    return null;
  }
}

export function getSessionCookie() {
  return COOKIE_NAME;
}
