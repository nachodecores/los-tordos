import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { login } from "../actions";
import { isAuthConfigured } from "@/lib/supabase/config";
export default function LoginPage() {
  return <><h1>Ingresá a Los Tordos</h1><p>Acceso para el equipo y distribuidores invitados.</p>
    {isAuthConfigured() ? <AuthForm action={login} submitLabel="Ingresar">
      <label>Correo<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
      <label>Contraseña<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
    </AuthForm> : <p role="status">El acceso del equipo todavía no está habilitado.</p>}
    <p><Link href="/auth/recover">Olvidé mi contraseña</Link></p><p><Link href="/">Volver al sitio</Link></p>
  </>;
}
