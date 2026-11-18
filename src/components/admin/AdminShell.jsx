import Link from "next/link";
import Image from "next/image";
import { ROLES } from "@/lib/auth/permissions.mjs";
import { getPanelContent } from "@/lib/admin/panel.mjs";
import { logout } from "@/app/auth/actions";
import AdminNav from "./AdminNav";
import PanelIcon from "./PanelIcon";

export default function AdminShell({ profile, children }) {
  const panel = getPanelContent(profile.roles);
  return <div className="panel-shell">
    <a href="#panel-content" className="panel-skip">Ir al contenido</a>
    <aside className="panel-sidebar">
      <Link href="/admin" className="panel-brand" aria-label="Los Tordos, inicio del panel">
        <Image src="/logos/logochicoamarillo.svg" alt="" width={37} height={43} />
        <span>LOS TORDOS<small>Panel de gestión</small></span>
      </Link>
      <AdminNav items={panel.navigation} />
      {panel.upcoming.length > 0 && <div className="panel-upcoming">
        <p className="panel-nav-caption">La operación</p>
        <ul>{panel.upcoming.map((item) => <li key={item.label}><PanelIcon name={item.icon} /><span>{item.label}</span><span className="panel-nav-soon">Pronto</span></li>)}</ul>
      </div>}
      <Link href="/" className="panel-public-link">Ver sitio público <PanelIcon name="arrow" /></Link>
    </aside>
    <div className="panel-workspace">
      <header className="panel-topbar">
        <div><p className="panel-user-name">{profile.name}</p><p className="panel-user-roles">{profile.roles.map((role) => ROLES[role] || role).join(" · ")}</p></div>
        <form action={logout}><button className="panel-logout">Cerrar sesión</button></form>
      </header>
      <div id="panel-content" className="panel-content" tabIndex={-1}>{children}</div>
      <footer className="panel-footer">Los Tordos <span>Gestión del equipo</span></footer>
    </div>
  </div>;
}
