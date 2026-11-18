import "./access.css";
export const metadata = { title: "Acceso | Los Tordos", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";
export default function AuthLayout({ children }) {
  return <main className="access-root"><div className="access-card">{children}</div></main>;
}
