import Link from "next/link";
import { requireActor } from "@/lib/auth/access";
import { ROLES } from "@/lib/auth/permissions.mjs";
import AdminShell from "@/components/admin/AdminShell";
import PanelIcon from "@/components/admin/PanelIcon";

export default async function AccountPage() {
  const { profile, user } = await requireActor();
  return <AdminShell profile={profile}>
    <div className="panel-page-heading"><p className="panel-eyebrow">Mi cuenta</p><h1>Tu acceso a Los Tordos</h1><p>Información de tu cuenta y seguridad de acceso.</p></div>
    <section className="panel-account-card" aria-labelledby="account-heading">
      <h2 id="account-heading">Datos de la cuenta</h2>
      <dl className="panel-account-data"><div><dt>Nombre</dt><dd>{profile.name}</dd></div><div><dt>Correo de acceso</dt><dd>{user.email}</dd></div><div><dt>Roles asignados</dt><dd>{profile.roles.map((role) => ROLES[role] || role).join(" · ")}</dd></div></dl>
      <Link href="/auth/password" className="panel-primary-link">Cambiar contraseña <PanelIcon name="arrow" /></Link>
      <p className="panel-muted">Para modificar tus datos o permisos, contactá a un administrador.</p>
    </section>
  </AdminShell>;
}
