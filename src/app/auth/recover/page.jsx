import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { requestRecovery } from "../actions";
export default function RecoverPage() {
  return <><h1>Recuperá tu acceso</h1><p>Te enviaremos un enlace si tenés una cuenta habilitada.</p>
    <AuthForm action={requestRecovery} submitLabel="Enviar instrucciones">
      <label>Correo<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </AuthForm><p><Link href="/auth/login">Volver a ingresar</Link></p></>;
}
