import "../auth/access.css";
import "./panel.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Equipo | Los Tordos", robots: { index: false, follow: false } };
export default function AdminLayout({ children }) {
  // Cada página y acción comprueba permisos; la navegación no sustituye la autorización.
  return <main className="access-root admin-root">{children}</main>;
}
