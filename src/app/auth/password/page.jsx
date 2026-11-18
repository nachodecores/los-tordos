import AuthForm from "@/components/auth/AuthForm";
import { setPassword, logout } from "../actions";
import { requireActor } from "@/lib/auth/access";
export default async function PasswordPage() {
  await requireActor({ allowSetup: true });
  return <><h1>Elegí tu contraseña</h1><p>Usá una contraseña única de al menos 12 caracteres.</p>
    <AuthForm action={setPassword} submitLabel="Guardar contraseña">
      <label>Nueva contraseña<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required /></label>
      <label>Repetir contraseña<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={72} required /></label>
    </AuthForm><form action={logout}><button style={{ marginTop: 20 }}>Cerrar sesión</button></form></>;
}
