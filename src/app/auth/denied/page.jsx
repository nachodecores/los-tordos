import { logout } from "../actions";
export default function DeniedPage() {
  return <><h1>Acceso no habilitado</h1><p>Tu cuenta no tiene permiso para acceder a esta sección. Consultá a un administrador.</p>
    <form action={logout}><button>Cerrar sesión</button></form></>;
}
