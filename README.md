# Los Tordos

Sitio público existente y base de la futura plataforma de venta directa, logística, inventario y cobranzas.

## Desarrollo

Node recomendado: 22.13 o posterior para las herramientas de desarrollo actualizadas. Ejecutar `npm ci` y `npm run dev`. Validar con `npm run lint`, `npm test` y `npm run build`. Build y pruebas también se comprobaron con Node 22.10 instalado en este equipo.

El sitio público no necesita PostgreSQL ni autenticación. Las variables nuevas se documentan en .env.example; se configuran localmente en .env.local, nunca en Git.

## Acceso del equipo

El módulo de autenticación por invitación está implementado localmente con Supabase Auth. Para configuración, pruebas y activación, ver [docs/autenticacion.md](docs/autenticacion.md).

Sin las nuevas variables de entorno, el sitio público funciona y el acceso privado permanece cerrado. No se aplicaron migraciones ni se modificó el proyecto Supabase remoto. Según la decisión del usuario, se reutilizará el proyecto Supabase existente tras revisar su contenido y la limpieza de los objetos del tambo.

## Conservación del tambo

La demo independiente está en ../lostordos-tambo-demo y el historial Git completo en ../lostordos-tambo-respaldo-privado. Son carpetas locales externas a este repositorio; el push del sitio no las respalda.

El código ganadero fue retirado de las rutas operativas, junto con sus API, login, modelos e importadores. Ver [docs/separacion-tambo.md](docs/separacion-tambo.md).

## Contexto funcional

[Documento maestro](docs/documento-maestro.md). Las decisiones posteriores aprobadas por el usuario prevalecen. Ningún módulo adicional ni despliegue se realiza sin aprobación.

## Catalogo, clientes y borradores

Implementacion local de la primera entrega comercial. Activacion de la migracion y verificacion: [docs/modulo-comercial-clientes.md](docs/modulo-comercial-clientes.md). Administracion gestiona clientes y productos. No hay borradores manuales ni operativa de pedidos habilitada.

Mapa y cobertura: [guía de activación](docs/mapa-cobertura.md).

Stock por repartidor: [guía de activación](docs/stock-repartidores.md).
