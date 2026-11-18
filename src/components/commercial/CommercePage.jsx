import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { isSetupError } from "@/lib/commercial/errors.mjs";

export function PageHeading({ eyebrow, title, description, href, actionLabel }) {
  return <div className="commerce-heading"><div className="panel-page-heading">
    {eyebrow && <p className="panel-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}
  </div>{href && <Link href={href} className="panel-primary-link">{actionLabel}</Link>}</div>;
}
export function LoadError({ profile, error }) {
  return <AdminShell profile={profile}><h1>{isSetupError(error) ? "Sección pendiente de habilitar" : "No pudimos cargar esta sección"}</h1>
    <p>{isSetupError(error) ? "La estructura está preparada. Falta completar la configuración para empezar a guardar datos." : "Intentá nuevamente más tarde. No se modificaron tus datos."}</p>
    <Link href="/admin">Volver al inicio</Link></AdminShell>;
}
export function SavedNotice({ saved }) {
  return saved ? <p className="commerce-saved" role="status">Cambios guardados.</p> : null;
}
export function EmptyState({ children }) { return <div className="commerce-empty">{children}</div>; }
export function FormIds({ record }) {
  return <><input name="id" type="hidden" value={record?.id || ""} /><input name="version" type="hidden" value={record?.version || ""} /></>;
}
