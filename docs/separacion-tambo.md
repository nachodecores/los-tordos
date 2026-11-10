# Separaci?n del tambo

Fecha: 2026-11-10. Commit de origen: 500cf62a8950f0611f24bd443763c4a689e06272.

## Conservaci?n

- Demo: ../lostordos-tambo-demo, fuentes copiadas y verificadas antes de retirar originales; sin .env ni CSV reales. Seed nuevo con dos cuentas ficticias y seis animales.
- Historial: ../lostordos-tambo-respaldo-privado/lostordos-historial.bundle, generado con --all y validado con git bundle verify; checksum SHA256 junto al archivo. Es privado, puede contener datos hist?ricos y no es un respaldo de PostgreSQL.
- Las carpetas hermanas son locales: copiarlas a almacenamiento propio antes de descartar este equipo. No est?n dentro del commit del sitio comercial.

## Cambios en la aplicaci?n

Retiradas /admin y todas las API hist?ricas, autenticaci?n anterior, componentes ganaderos, cliente Prisma, esquema, migraciones, CSV, importadores y seed. El sitio p?blico y /subscriptions se conservan. No se cambiaron precios ni condiciones comerciales.

El sitio ya no importa el proveedor de sesi?n ni accede a la base anterior. .env permanece intacto e ignorado; las variables antiguas del hosting deben retirarse cuando se revise el despliegue. La base actual permanece sin cambios.

## Pr?ximo paso

Preparar una base comercial nueva y sus migraciones desde cero, y acordar cuentas y permisos. No aplicar migraciones del tambo a esa base. Antes de retirar definitivamente la base antigua, comprobar la demo con PostgreSQL local.

## Validaci?n

La comprobaci?n de migraciones, seed y navegaci?n autenticada de la demo requiere una base local dedicada. No se utiliz? la base existente para pruebas. El stack hist?rico de la demo requiere actualizaci?n antes de publicarlo.

### Resultados de la revision local

- npm run lint y npm run build: correctos en el sitio principal. El primer build fallo al cerrar un worker en Windows (EPERM); la repeticion finalizo correctamente.
- HTTP local: / y /subscriptions responden 200; /admin, /admin/login, /api/animales (GET y POST), /api/informes/proyecciones y /api/auth/session responden 404.
- package.json y lockfile consistentes; dependencias exclusivas del tambo retiradas.
- Demo: npm ci --ignore-scripts --offline completo, Prisma validate correcto y sintaxis del seed valida. No se aplicaron migraciones ni se ejecuto el seed.
- Se completo en la demo la migracion faltante de CategoriaVaca.vaquillona.
- ESLint de la demo: sin errores; conserva dos advertencias historicas de dependencias de useEffect. Repositorio Git independiente inicializado, sin commits ni publicacion.
