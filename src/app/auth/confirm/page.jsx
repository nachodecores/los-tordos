import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { confirmLink } from "../actions";
export default async function ConfirmPage({ searchParams }) {
  const params = await searchParams;
  const valid = ["invite", "recovery"].includes(params.type) && typeof params.token_hash === "string";
  return <><h1>Confirmá tu acceso</h1><p>Continuá para elegir tu contraseña. El enlace se utiliza una sola vez.</p>
    {valid ? <AuthForm action={confirmLink} submitLabel="Continuar">
      <input type="hidden" name="type" value={params.type} />
      <input type="hidden" name="token_hash" value={params.token_hash} />
    </AuthForm> : <p role="alert">El enlace está incompleto. Solicitá uno nuevo.</p>}
    <p><Link href="/auth/recover">Solicitar otro enlace</Link></p></>;
}
