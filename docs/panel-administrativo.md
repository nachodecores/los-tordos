# Panel administrativo — primera entrega

Fecha: 2026-11-13. Alcance aprobado: estructura visual y navegación, sin datos operativos ficticios.

## Qué incluye

- Inicio con seis resúmenes para administración: sin reservar, reservados por entregar, entregados por cobrar, cobranzas realizadas, stock por repartidor y comisiones acumuladas.
- Área destacada para el mapa de pedidos y espacio para futuras alertas de plazos.
- Estados Próximamente para módulos que todavía no existen. No hay contadores, mapas ficticios, cobros, reservas ni controles operativos simulados.
- Navegación común Inicio / Usuarios / Mi cuenta. Usuarios solo aparece para administración.
- Mi cuenta permite consultar nombre, correo y roles; enlaza al cambio de contraseña existente.
- Cierre de sesión disponible en la cabecera, también en Usuarios.
- Diseño con los colores existentes de Los Tordos y adaptación a pantallas pequeñas. Los módulos en preparación se muestran como texto, no como botones operativos.

## Permisos

- Administración: seis resúmenes, mapa pendiente, alertas pendientes y usuarios.
- Reparto: mapa, pedidos disponibles, sus reservas y su stock; sin cobranzas, comisiones ni usuarios.
- Cobranzas: resúmenes de cobros; sin mapa ni inventario.
- Roles combinados: unión de los accesos autorizados.
- Logística y Distribución Mayorista fueron retirados. Roles vigentes: Administración, Reparto y Cobranzas.

Los filtros del menú no sustituyen los permisos: las páginas siguen ejecutando requireActor. Usuarios exige users.manage y sus acciones conservan la autorización existente.

## Archivos

- src/app/admin/page.jsx: inicio.
- src/app/admin/layout.jsx y panel.css: estructura base y estilos del panel.
- src/app/admin/account/page.jsx: Mi cuenta.
- src/app/admin/users/page.jsx: integración de usuarios en la navegación común.
- src/components/admin/AdminShell.jsx, AdminNav.jsx y PanelIcon.jsx: estructura compartida, navegación activa e iconos.
- src/lib/admin/panel.mjs: selección de contenido por permisos.
- tests/panel-permissions.test.mjs: separación de navegación y contenido por rol.
- CONTEXTO_PROYECTO.md: aprobación y estado actual.

Sin dependencias nuevas, migraciones, cambios de credenciales, servicios ni despliegue.

## Verificaciones

- npm run lint: correcto.
- npm test: 24 pruebas correctas, incluyendo políticas de base en memoria y cinco casos del panel.
- npm run build: correcto.
- HTTP local sin sesión: login 200; /admin, /admin/users y /admin/account redirigen al login.
- No se reutilizaron cookies ni credenciales personales para automatizar una sesión de navegador. La revisión visual autenticada y en celular queda para la cuenta del usuario.

## Cómo revisarlo

1. Mantener npm run dev en ejecución.
2. Abrir http://localhost:3000/admin e ingresar con la cuenta creada.
3. Revisar Inicio: seis tarjetas pendientes, mapa destacado, alertas y accesos disponibles.
4. Abrir Usuarios: comprobar que conserva las cuentas e invitaciones y muestra la navegación común.
5. Abrir Mi cuenta y comprobar datos y enlace de cambio de contraseña.
6. Reducir el ancho de la ventana o revisar desde un entorno móvil accesible: la navegación pasa a una fila y las tarjetas se apilan.
7. Cerrar sesión y confirmar que las páginas privadas vuelven a pedir acceso.

## Pendiente

Conectar información real al implementar pedidos, inventario, comisiones y cobranzas. Los plazos y alertas deben definirse e implementarse con ese modelo. No hay valores comerciales predeterminados ni cálculos de comisiones en este panel.
