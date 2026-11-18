# Contexto actual de Los Tordos

## Referencias y prioridad

- [Documento maestro](docs/documento-maestro.md): contexto inicial.
- [Actualización del modelo comercial y operativo — 2026-11-13](docs/actualizacion-modelo-comercial-2026-11-13.md): reemplaza las definiciones anteriores incompatibles.
- Las decisiones posteriores aprobadas por el usuario prevalecen. Cada módulo requiere propuesta y aprobación antes de implementarse.

## Estado confirmado

El proyecto conserva el sitio público en Next.js. El tambo se separó como demo para portfolio y respaldo Git privado en carpetas hermanas; ver [separación](docs/separacion-tambo.md). El usuario retiró los objetos ganaderos de Supabase mediante SQL. Las carpetas hermanas no se incluyen en el push del repositorio principal.

La sección /subscriptions y su componente exclusivo se retiraron por aprobación del usuario el 2026-11-11. No ofrecer suscripciones sin una definición comercial nueva.

## Acceso

Supabase Auth utiliza el proyecto existente. El usuario aplicó las migraciones de acceso y confirmó que puede cerrar sesión, ingresar con correo y contraseña y administrar usuarios. El envío de correo sigue usando el servicio de prueba; SMTP para usuarios reales está pendiente.

El 2026-11-12 el usuario decidió retirar completamente el segundo factor. No exigir TOTP, QR ni aplicaciones autenticadoras sin nueva aprobación. Se conservan invitaciones, roles, cuentas activas, validación de sesiones, RLS y auditoría. Ver [autenticación](docs/autenticacion.md).

Los roles implementados todavía incluyen mayorista, que quedó obsoleto para el alcance nuevo. Revisar uso y proponer su retiro antes de modificar cuentas o permisos. No confundir su presencia técnica con una funcionalidad comercial vigente.

## Modelo comercial vigente

- Provolone de aproximadamente 450 g; presentación todavía por desarrollar. Precio y comisión definitiva pendientes. No convertir ejemplos económicos anteriores en parámetros de producción.
- Un canal comercial centralizado: los colaboradores son repartidores autorizados con mercadería propiedad de Los Tordos, no compradores mayoristas independientes.
- Todos los pedidos se registran por WhatsApp empresarial, incluidos clientes captados por repartidores. La web dirige a ese canal; no hay formularios externos de compra.
- Cobertura editable dentro de Montevideo. Reserva libre y atómica, sin territorios ni horarios exclusivos. Prioridades por captación y comisiones de captación no están aprobadas.
- Inventario por repartidor, con movimientos trazables y sin stock negativo. Entregar descuenta cantidades automáticamente.
- Entrega registrada una sola vez: descontar stock, calcular comisión, generar cuenta por cobrar y preparar aviso de WhatsApp. La notificación debe reintentarse sin duplicar operaciones.
- Pago posterior a entrega: opciones de enlace electrónico o transferencia Santander. No exigir comprobantes ni usar QR presencial.
- Confirmación del proveedor de pago mediante integración segura, cuando se elija; las transferencias bancarias siguen requiriendo conciliación humana.
- Comisión preliminar de $100 por paquete entregado, configurable y no definitiva. Falta decidir si se liquida por entregas o por ventas cobradas. No implementar esa decisión pendiente.
- El repartidor no cobra. Los socios pueden intervenir en pedidos y reservas.

## Próximo módulo: panel administrativo

El usuario aprobó esta primera entrega el 2026-11-13 y la estructura visual ya está implementada localmente. Ver [panel administrativo](docs/panel-administrativo.md). No se implementaron los módulos operativos ni se cambió Supabase. Inicio sencillo, acceso destacado al mapa y navegación según permisos. Resúmenes previstos: pedidos sin reservar, reservados pendientes, entregados por cobrar, cobranzas realizadas, stock por repartidor y comisiones acumuladas.

Mientras no existan los módulos operativos, usar estados Próximamente; no inventar cantidades ni presentar controles inactivos como funcionales. No agregar servicios, migraciones comerciales, pagos o automatizaciones dentro de la entrega visual del panel.

No publicar versiones ni cambiar infraestructura sin autorización. No hay aprobación para implementar todas las decisiones del nuevo documento de una vez.

## Plazos y alertas de pedidos — 2026-11-13

[Actualización completa](docs/plazos-alertas-pedidos-2026-11-13.md). Tres límites configurables desde administración: confirmación a reserva, reserva a entrega y entrega a confirmación del pago. Las alertas iniciales se muestran a los socios en el panel e identifican pedido, responsable si lo hay, estado y tiempo transcurrido. Las intervenciones son manuales; no cancelar ni reasignar automáticamente.

Cada cambio de estado registra fecha, hora y responsable. Preparar una evolución hacia notificaciones futuras, sin implementar ahora envíos ni infraestructura adicional. El pedido sin reservar no tiene repartidor asignado; no inventar un responsable.

Revisión del repositorio: todavía no hay tablas, servicios ni pantallas operativas de pedidos; solo acceso, invitaciones y auditoría de usuarios. Propuesta mínima para el módulo de pedidos: fechas de sus hitos, historial de eventos y configuración persistente de los tres plazos; calcular alertas al consultar el panel en la primera versión. Separar estado de entrega y de pago.

Pendientes antes de implementar: valores iniciales y unidades de los plazos, tratamiento de liberaciones/reasignaciones/nuevos intentos de entrega y efecto de cambiar un plazo sobre pedidos existentes. No asumir que la reserva o reasignación reinicia el tiempo. No agregar estos cambios al alcance visual del panel sin autorización.

## Propuesta de módulo comercial — 2026-11-13

El usuario confirmó que solo administración podrá cargar pedidos manualmente como excepción. La compra habitual sigue en WhatsApp. Cada pedido manual registra responsable, fecha y motivo; conserva las validaciones de cantidad, precio y cobertura. Una carga incompleta queda en borrador, fuera del reparto.

Se preparó [la propuesta de productos, clientes y pedidos](docs/propuestas/modelo-comercial.md) y un borrador SQL para revisión, fuera de supabase/migrations y con ROLLBACK. No se aplicó a Supabase ni habilita operaciones comerciales. El próximo alcance propuesto es catálogo, clientes, direcciones y borradores manuales; aún requiere aprobar esta propuesta antes de modificar código de aplicación o crear la migración operativa.

## Módulo comercial 03A implementado localmente — 2026-11-13

El usuario aprobó catálogo, clientes, direcciones y borradores manuales. La implementación está en el panel con permisos comerciales dedicados, exclusivos de administración en esta etapa. Incluye cálculos en servidor, motivo de carga, historial, idempotencia y control de versiones.

[Guía del módulo](docs/modulo-comercial-clientes.md). Migración aplicable: supabase/migrations/202611130001_commercial_drafts.sql, preparada y probada en memoria, todavía no aplicada a Supabase. El borrador de docs/propuestas es un antecedente, no el archivo para ejecutar.

No se precargaron precios, pesos ni comisiones. No se habilitaron confirmaciones, reservas, entregas, cobros ni notificaciones. Esas operaciones siguen pendientes de sus módulos y decisiones comerciales. Pasaron lint, build y 48 pruebas; falta la validación con la base real después de aplicar la migración.

### Moneda única (2026-11-13)

Todas las operaciones comerciales serán en UYU, por decisión del usuario. Sin selector de moneda. Ajuste local y migración 202611130002_uyu_only.sql preparados; aplicación remota pendiente. No convierte importes ni elimina registros. Simplificar a una dirección por cliente se propuso y espera confirmación; aún se conservan varias.

El usuario confirmó una sola dirección editable por cliente. Preparada migración 202611130003_single_customer_address.sql y simplificación de ficha/borrador. No elimina direcciones ni reescribe pedidos. Sustituye la decisión pendiente indicada arriba; aplicación remota pendiente.

### Alcance vigente: sin borradores manuales (2026-11-13)

Esta decisión reemplaza la aprobación anterior de pedidos manuales. El usuario solicita solo agregar y editar clientes desde administración, con una dirección editable. Se retiraron rutas, navegación, formularios, acciones y permisos de borradores. Productos se conserva. Las migraciones hasta 003 fueron aplicadas por el usuario; 004 retira la RPC manual y acceso a tablas de pedidos, sin borrar información. Pendiente de aplicar en Supabase. La creación de pedidos se revisará al implementar WhatsApp.

### Ficha unificada de clientes

Implementación autorizada: un único formulario y guardado transaccional de contacto, dirección y observaciones; mantiene dirección única y control de versiones. Migración 202611130005_customer_form.sql preparada, pendiente de aplicar. El usuario confirmó aplicada 004. El teléfono se ingresa en altas manuales; su captura automática desde WhatsApp corresponde a la futura integración.

### Mapa y cobertura (2026-11-13)

El usuario autorizó continuar con ubicación y cobertura. Preparados mapa Leaflet 1.9.4, una zona comercial general editable solo por administración, punto manual por cliente, clasificación interior/exterior/borde y controles SQL/RLS. Sin geocodificación ni zona precargada. Nueva migración 202611130006_coverage.sql pendiente de aplicar. El usuario verificó funcionando la ficha unificada 005. Guía: docs/mapa-cobertura.md. Sin pedidos ni automatizaciones de WhatsApp en esta entrega.

### Stock por repartidor (2026-11-13)

El usuario confirmó: sin centros de retiro; el aprovisionamiento queda fuera de la app. Solo administración registra entradas y correcciones de stock. Reparto consulta su saldo e historial propios. Se autorizó implementar esta entrega, con saldo por producto, motivo obligatorio en correcciones, responsable, fecha e historial sin edición. Preparada migración 202611130007_courier_stock.sql, pendiente de aplicar. No incluye descuento por entrega todavía. Guía docs/stock-repartidores.md. El usuario verificó mapa/cobertura 006 funcionando; WhatsApp en pausa hasta recuperar el teléfono.

### Roles vigentes (2026-11-13)

El usuario solicita conservar Administración, Reparto y Cobranzas, y retirar Logística y Distribución Mayorista. Se actualizaron opciones de usuarios, matriz de permisos y panel. Migración 202611130008_simplify_roles.sql preparada: conserva cuentas y datos, elimina roles retirados de asignaciones mixtas con auditoría y bloquea la operación si un perfil o invitación quedara sin rol válido. No asigna nuevos permisos automáticamente. El permiso de coordinación de entregas pasa a deliveries.manage, exclusivo de administración. Migración remota pendiente; ejecutar después de 007.

### Pausa del sistema comercial (2026-11-18)

El usuario solicita dejar el desarrollo comercial en standby y pasar a trabajar en la web pública. Antes de ese cambio de foco, autoriza guardar en Git y hacer push del trabajo implementado. El usuario verificó funcionando clientes y cobertura y ejecutó la migración 008 sin reportar errores. La prueba integral de stock con una cuenta de Reparto no fue confirmada. WhatsApp continúa pendiente de recuperar el teléfono. No agregar módulos comerciales mientras se trabaja en la web pública salvo nueva indicación.
