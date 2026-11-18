export function validatePassword(password, confirmation) {
  if (typeof password !== "string" || [...password].length < 12) throw new Error("Usá una contraseña de al menos 12 caracteres.");
  if (new TextEncoder().encode(password).length > 72) throw new Error("La contraseña es demasiado larga. Probá una más corta.");
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");
  return password;
}
