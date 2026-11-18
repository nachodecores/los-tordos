# Propuesta: productos, clientes y pedidos

Estado: propuesta aprobada. Implementación local en [la guía del módulo](../modulo-comercial-borradores.md); Supabase todavía no fue modificado por esta entrega. El SQL enlazado aquí se conserva como borrador histórico, no como migración operativa.
Fecha: 2026-11-13.

## Diagnóstico y alcance

Las migraciones actuales solo definen acceso, perfiles, invitaciones y auditoría de usuarios. No hay un modelo de pedidos que deba migrarse. El panel comercial es una estructura con módulos pendientes.

El usuario aprobó que únicamente los administradores puedan cargar pedidos manuales como excepción. La propuesta conserva el canal habitual por WhatsApp y sus validaciones. No hay cuentas para consumidores.

Primera entrega propuesta: catálogo configurable, clientes con direcciones y pedidos manuales en borrador. Sin precio o cobertura aprobados, un borrador no se confirma ni aparece disponible para reparto.

## Entidades

| Entidad | Datos principales |
| --- | --- |
| Productos | Código, nombre, peso nominal aprobado, precio vigente, moneda, activo/inactivo |
| Clientes | Nombre y teléfono normalizado único; sin contraseña |
| Direcciones | Cliente, texto, coordenadas verificables y observaciones |
| Pedidos | Número, origen, cliente, domicilio, estados, responsables y fechas |
| Líneas de pedido | Producto, cantidad, nombre/peso/precio acordados y subtotal |
| Historial | Pedido, evento, fecha y hora, responsable o fuente verificada |
| Configuración | Tres plazos operativos editables, sin valores iniciales inventados |

Un cliente puede tener varias direcciones y un pedido varias líneas, aunque inicialmente se venda un solo producto. No se precarga un producto de 450 g como formato definitivo ni un precio o comisión preliminar.

## Integridad

- Las cantidades son paquetes enteros positivos. No se agrega un mínimo comercial adicional.
- Los importes utilizan decimales exactos y se calculan en servidor; nunca se confía en el total enviado por el navegador.
- Al confirmar se conserva una copia de producto, precio, destinatario y dirección. Cambiar el catálogo o la ficha del cliente no altera lo ya acordado.
- Una dirección elegida debe pertenecer al cliente del pedido.
- Confirmar exige cliente, líneas completas, ubicación comprobada, cobertura vigente, precio válido y evidencia de aceptación. La carga manual registra además responsable y motivo.
- Sin cobertura definida no se habilita una excepción administrativa para confirmar fuera de zona. La primera interfaz puede guardar borradores.
- Una clave única por operación permite reintentar sin duplicar pedidos. En WhatsApp, se añade el identificador del evento de origen.
- Crear o modificar un pedido y registrar su evento debe ocurrir en la misma transacción.
- Borrar clientes, productos o usuarios no elimina el historial de pedidos en cascada.
- Los índices se orientan a pendientes, responsable, fechas y cobranza. No se requiere PostGIS ni un servicio geográfico para guardar este primer modelo.

## Estados separados

Propuesta técnica, no autorización para operar etapas futuras:

- Pedido comercial: borrador, confirmado y cancelado.
- Distribución: disponible, reservado, en reparto, entregado o fallido. Un borrador todavía no tiene estado de distribución.
- Cobranza: no exigible, pendiente o pagado. Su estado no sustituye al de distribución.

La primera entrega solo opera borradores. No habilita cancelar, reservar, entregar o confirmar pagos con reglas todavía pendientes. En particular, marcar Entregado debe incorporarse después junto con el descuento de stock, la comisión, la cuenta por cobrar y el evento de notificación idempotente.

## Permisos y datos visibles

| Operación | Primera autorización propuesta |
| --- | --- |
| Configurar catálogo y parámetros | Administración |
| Crear o editar pedidos manuales en borrador | Solo administración |
| Confirmar pedidos manuales | Solo administración, cuando exista validación de cobertura |
| Consultar pedidos operativos | Según el módulo y alcance autorizado |
| Consultar importes y pagos | Administración y cobranzas |
| Reservar y entregar | Reparto/logística, en su módulo posterior |

Se agregarán permisos específicos; no se reutiliza users.manage como autorización comercial.

RLS no oculta por sí sola columnas financieras. Antes de exponer pedidos a repartidores se deben preparar consultas/RPC con proyecciones limitadas y alcance por pedido. No se dará lectura genérica de tablas con precios a reparto.

La aprobación para crear manualmente no se extiende a logística, reparto, cobranzas ni al rol mayorista histórico. Retirar ese rol se propondrá por separado después de revisar cuentas existentes.

## Plazos e historial

Se almacenarán duraciones configurables y marcas de confirmación, reserva, entrega y pago confirmado. Las fechas se guardan con zona horaria; la interfaz presenta la hora de Montevideo.

Los eventos preservan cambios anteriores aunque un pedido cambie de responsable o de estado. No se decide todavía que reasignar o liberar una reserva reinicie su plazo.

Inicialmente los vencimientos pueden calcularse al consultar el panel, sin tareas programadas ni avisos externos. Falta decidir los valores, la unidad de edición y qué ocurre al cambiar parámetros sobre pedidos ya existentes. Mientras un plazo no esté configurado se debe indicar esa situación, no mostrar un falso estado de cumplimiento.

## Borrador SQL

[Esquema propuesto](modelo-comercial-borrador.sql). Está fuera del directorio de migraciones aplicables, no incluye registros iniciales y termina en ROLLBACK. No ejecutarlo en Supabase.

Es un diseño estructural, no una migración operativa terminada. Las invariantes entre tablas requieren RPC transaccionales, RLS y validaciones de servidor antes de permitir escrituras. Por ejemplo, un CHECK no puede asegurar que un pedido tenga líneas completas.

Una vez aprobado el alcance, se preparará la migración aplicable con esos controles y sus pruebas. Los estados futuros no se habilitarán simplemente por existir en el esquema.

## Entregas verificables

1. Productos, clientes y direcciones. Sin precios ni pesos definitivos precargados.
2. Borradores manuales, exclusivos de administración, con líneas, totales, motivo e historial.
3. Validación de ubicación/cobertura y confirmación. El pedido queda disponible solo si cumple todas las condiciones.
4. Reservas atómicas, inventario por repartidor y entrega coherente con stock y cobranza.
5. WhatsApp e integraciones de cobro, cuando se elijan proveedores y se aprueben sus costos.

No se necesita un servicio nuevo para las dos primeras entregas. Siguen pendientes mapas/geocodificación, WhatsApp, envío de correo de producción y proveedor de pagos. No se contrata ni configura ninguno como parte de esta propuesta.

## Decisiones pendientes

- Peso y precio definitivos, moneda de operación y aprobación para activar el producto.
- Zona inicial y método para validar ubicaciones antes de confirmar.
- Valores iniciales de los tres plazos y tratamiento de reasignaciones/reintentos.
- Comisión definitiva y condición para liquidarla.
- Políticas de cancelación, devoluciones y correcciones sobre pedidos confirmados.
- Alcance de edición posterior de logística y visibilidad de comisiones.

Estas decisiones no bloquean la preparación del catálogo y los borradores, pero sí las operaciones que dependan de ellas.
