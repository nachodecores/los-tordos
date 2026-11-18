# Módulo 01: acceso por invitación

## Decisión vigente

Desde el 2026-11-12, el usuario decidió retirar el segundo factor del proyecto. Todos los perfiles acceden con correo y contraseña. No se solicita una aplicación autenticadora ni un QR. Esta decisión reemplaza la preferencia anterior del documento maestro.

Se conservan las invitaciones aprobadas, contraseñas administradas por Supabase Auth, recuperación por correo, roles combinables, desactivación de cuentas, validación de sesiones, políticas RLS y auditoría. Los consumidores no tienen cuentas. El panel implementado incluye acceso y administración de usuarios; los demás módulos siguen pendientes.

## Estado

Se reutiliza el proyecto Supabase existente. El usuario retiró las tablas del tambo, aplicó la migración inicial y configuró Auth, TOTP y plantillas durante la primera prueba. La cuenta administradora pudo confirmar el correo y avanzar hasta la antigua pantalla del autenticador.

La aplicación local ya no exige segundo factor. Falta aplicar en Supabase la migración de retiro y deshabilitar TOTP en Authentication > Multi-Factor. No se recrean cuentas ni se cambia la contraseña elegida.

## Migraciones, en orden

1. supabase/migrations/202611100001_staff_access.sql: perfiles, invitaciones, auditoría y controles iniciales.
2. supabase/migrations/202611120001_staff_schema_usage.sql: USAGE de public para authenticated.
3. supabase/migrations/202611120002_remove_mfa_requirement.sql: reemplaza private.has_access sin requisitos de segundo factor.

Las migraciones anteriores se conservan como historial: no se vuelven a ejecutar en una base donde ya fueron aplicadas. La tercera mantiene la sesión existente, perfil activo, alta completada y matriz de permisos. No modifica registros ni permite escrituras directas sobre las tablas.

## Configuración de Supabase

- Authentication > Sign In / Providers: registro público y acceso anónimo deshabilitados.
- Proveedor Email habilitado, confirmación de correo habilitada y contraseña mínima de 12 caracteres.
- Authentication > Multi-Factor > TOTP: Disabled. No activar otros métodos de segundo factor.
- Site URL para la prueba: http://localhost:3000.
- Redirect URL exacta: http://localhost:3000/auth/confirm.
- Antes del despliegue, ajustar las direcciones al dominio HTTPS y reconstruir la aplicación.
- El envío predeterminado sirve solo para pruebas a direcciones autorizadas del equipo y tiene límites bajos. Para usuarios reales se debe elegir y configurar SMTP propio; no se contrató ningún servicio.
- Si hubiera factores realmente verificados en otras cuentas, revisar su retiro mediante las herramientas oficiales de Auth. La aplicación no los consulta ni los exige; no borrar directamente tablas internas de Supabase.

## Configuración local

.env.local, excluido de Git:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
APP_URL=http://localhost:3000
```

La URL debe ser la base del proyecto, sin /rest/v1/ ni rutas adicionales. La clave publicable y la secreta no son intercambiables. SUPABASE_SECRET_KEY solo se usa en servidor para invitar. Si el proyecto solo ofrece claves legacy, anon corresponde a la variable publicable y service_role a la secreta. No compartir claves ni versionarlas.

DATABASE_URL, DIRECT_URL y AUTH_SECRET del tambo no son utilizados por este módulo. Reiniciar npm run dev después de configurar variables. El desarrollo y build utilizan Webpack.

## Plantillas de correo

Authentication > Email Templates > Invite user:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=invite">Activar mi acceso</a>
```

Reset password:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=recovery">Elegir una nueva contraseña</a>
```

GET no consume el enlace: se requiere pulsar Continuar. Las páginas de acceso llevan no-store y no-referrer. Revisar que el hosting no registre query strings sensibles y deshabilitar el seguimiento de enlaces del proveedor SMTP.

## Operativa

- Primera cuenta: preparar su aprobación con supabase/manual/bootstrap-first-admin.sql y luego invitar el mismo correo desde Auth > Users. No repetir el bootstrap una vez creada la cuenta.
- Altas posteriores: un administrador ingresa nombre, correo y roles desde /admin/users.
- La invitación queda registrada antes del envío. Si el correo falla, se puede reintentar desde la lista.
- El trigger de Auth asocia la cuenta solo a una invitación previamente aprobada; no otorga permisos desde user_metadata.
- La persona confirma el enlace, elige su contraseña y entra al panel.
- Un reenvío para una cuenta creada pero todavía sin activar utiliza recuperación de acceso.
- Los roles se leen de la base en cada operación. Una cuenta desactivada no puede usar la aplicación aunque conserve un JWT.
- Desactivar no borra la cuenta Auth. Para una baja definitiva, revocar también las sesiones desde el proveedor.
- Se impide quitar o desactivar al último administrador operativo. Cada persona utiliza sus propias credenciales.
- Las contraseñas solo son administradas por Supabase Auth; los administradores no las conocen.

## Permisos

| Rol | Permiso base |
| --- | --- |
| Administración | Usuarios, clientes, productos, cobertura, stock, entregas y cobranzas |
| Reparto | Stock propio y operación de entregas |
| Cobranzas | Gestión de cobranzas |

Stock propio ya está implementado; entregas y cobranzas mantienen contratos para módulos posteriores. Reparto no recibe acceso financiero por defecto.

Las páginas y acciones verifican Auth, perfil activo y sesión existente en auth.sessions. Proxy refresca cookies. Las RPC administrativas vuelven a comprobar permisos y estado actual; las tablas tienen RLS y rechazan escrituras directas de las cuentas de la aplicación. Los cambios de permisos y su auditoría son transaccionales. La auditoría no puede borrarse ni editarse desde la aplicación.

## Verificación

- npm run test:auth: reglas, sesiones, invitaciones, permisos y RLS en PostgreSQL en memoria.
- Las pruebas parten de public sin USAGE heredado y aplican todas las migraciones en orden.
- Administración y cobranzas deben poder operar con una sesión de contraseña, sin AAL2.
- Deben seguir bloqueados el acceso anónimo, la elevación de roles, cuentas inactivas, sesiones revocadas y altas incompletas.
- npm run lint y npm run build.
- Comprobar /auth/login, /admin y /admin/users. La antigua ruta /auth/mfa ya no existe.
- Prueba real: ingreso con la contraseña creada, acceso al panel, cierre de sesión y nuevo ingreso. No solicitar un correo nuevo si la contraseña ya fue creada.

## Archivos

- src/app/auth/ y src/components/auth/: ingreso, enlaces y contraseña.
- src/app/admin/: acceso privado y usuarios.
- src/lib/auth/, src/lib/supabase/ y src/proxy.js: autorización y sesiones.
- supabase/migrations/: esquema aditivo y correcciones.
- supabase/manual/: scripts revisables de inspección, retiro del tambo y primera invitación.
- tests/auth-*.test.mjs: seguridad y validaciones.
- .env.example, README.md y CONTEXTO_PROYECTO.md: configuración y decisiones.

La auditoría de dependencias de producción anterior no reportó vulnerabilidades. El tooling ESLint/TypeScript conserva avisos transitivos moderados documentados en la entrega inicial. Se recomienda Node 22.13 o posterior.

Fuentes técnicas: https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs y https://supabase.com/docs/guides/auth/auth-email-templates.

## Simplificación de roles

Solo Administración, Reparto y Cobranzas permanecen vigentes. Aplicar 202611130008_simplify_roles.sql después de 007. Se retiran Logística y Distribución Mayorista de formularios, autorizaciones SQL y restricciones de perfiles/invitaciones. La coordinación de entregas corresponde a administración (permiso interno deliveries.manage).

La migración conserva usuarios, stock, invitaciones y auditoría. En asignaciones mixtas retira solo los roles antiguos y registra el cambio; no otorga roles nuevos. Si un perfil o invitación quedara sin rol vigente, revierte todo y solicita revisar la asignación. La revisión y asignación deben ser explícitas: no se promocionan cuentas a administración automáticamente. Las migraciones históricas se conservan sin editar.
