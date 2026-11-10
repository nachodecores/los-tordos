# Los Tordos

Sitio p?blico existente, preparado para evolucionar hacia venta directa, log?stica, inventario y cobranzas.

## Desarrollo

Node >=22. Ejecutar npm ci y npm run dev. Validar con npm run lint y npm run build. El sitio p?blico no necesita PostgreSQL ni autenticaci?n.

## Separaci?n del tambo

El c?digo hist?rico fue retirado de las rutas operativas, junto con sus API, login, modelos e importadores. La demo independiente est? en ../lostordos-tambo-demo y el historial Git en ../lostordos-tambo-respaldo-privado. No se modific? la base remota, el archivo .env local ni la infraestructura.

Ver docs/separacion-tambo.md. La nueva base, cuentas y permisos todav?a no est?n implementados. No ejecutar migraciones hist?ricas contra la futura base comercial.
