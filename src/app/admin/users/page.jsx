import AdminShell from "@/components/admin/AdminShell";
import { requireActor } from "@/lib/auth/access";
import { ROLES } from "@/lib/auth/permissions.mjs";
import AuthForm from "@/components/auth/AuthForm";
import { inviteUser, resendInvitation, updateAccess } from "./actions";

function RoleFields({ selected = [], prefix }) {
  return <fieldset><legend>Roles</legend>{Object.entries(ROLES).map(([role, label]) =>
    <label key={role} htmlFor={prefix + role}><input id={prefix + role} name="roles" type="checkbox" value={role} defaultChecked={selected.includes(role)} />{label}</label>
  )}</fieldset>;
}
export default async function UsersPage() {
  const { supabase, profile } = await requireActor({ permission: "users.manage" });
  const [profilesResult, invitationsResult] = await Promise.all([
    supabase.from("staff_profiles").select("id,email,name,roles,active,onboarding_required").order("created_at"),
    supabase.from("staff_invitations").select("id,email,name,auth_user_id,delivery_status,created_at").order("created_at", { ascending: false }),
  ]);
  if (profilesResult.error || invitationsResult.error) return <AdminShell profile={profile}><h1>Usuarios</h1><p role="alert">No pudimos cargar los accesos. Intentá nuevamente más tarde.</p></AdminShell>;
  const profiles = profilesResult.data;
  const invitations = invitationsResult.data;
  return <AdminShell profile={profile}><div className="panel-users-page"><h1>Usuarios e invitaciones</h1>
    <p>Cada persona usa su propio correo y contraseña.</p>
    <div className="access-grid">
      <section className="access-box"><h2>Invitar a una persona</h2>
        <AuthForm action={inviteUser} submitLabel="Enviar invitación">
          <label>Nombre<input name="name" autoComplete="name" required maxLength={100} /></label>
          <label>Correo<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <RoleFields prefix="invite-" />
        </AuthForm>
      </section>
      <section className="access-box"><h2>Cuentas</h2>{profiles.map((profile) =>
        <details key={profile.id}><summary>{profile.name} · {profile.active ? (profile.onboarding_required ? "Pendiente de activación" : "Activa") : "Desactivada"}</summary>
          <p>{profile.email}</p>
          <AuthForm action={updateAccess} submitLabel="Guardar acceso">
            <input type="hidden" name="id" value={profile.id} />
            <label>Nombre<input name="name" defaultValue={profile.name} required maxLength={100} /></label>
            <RoleFields prefix={profile.id} selected={profile.roles} />
            <label className="access-checkbox"><input name="active" type="checkbox" defaultChecked={profile.active} />Acceso habilitado</label>
          </AuthForm>
        </details>
      )}</section>
    </div>
    <section className="access-box" style={{ marginTop: 24 }}><h2>Invitaciones</h2>
      {!invitations.length && <p>No hay invitaciones.</p>}
      {invitations.map((invitation) => {
        const profile = profiles.find((item) => item.id === invitation.auth_user_id);
        const complete = profile && !profile.onboarding_required;
        return <details key={invitation.id}><summary>{invitation.name} · {complete ? "Activada" : ({ pending: "Envío pendiente", sent: "Correo enviado", error: "Error de envío" }[invitation.delivery_status])}</summary>
          <p>{invitation.email}</p>
          {!complete && (!profile || profile.active) && <AuthForm action={resendInvitation} submitLabel="Reenviar enlace de acceso">
            <input type="hidden" name="id" value={invitation.id} />
          </AuthForm>}
        </details>;
      })}
    </section></div></AdminShell>;
}
