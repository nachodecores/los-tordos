"use client";
import { useActionState } from "react";
export default function AuthForm({ action, children, submitLabel, pendingLabel = "Procesando...", disabled = false }) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="access-form">
    {children}
    {state.error && <p role="alert" className="access-error">{state.error}</p>}
    {state.success && <p role="status" className="access-success">{state.success}</p>}
    <button type="submit" disabled={pending || disabled}>{pending ? pendingLabel : submitLabel}</button>
  </form>;
}
