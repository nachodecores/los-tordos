## Actualización para Codex: plazos y alertas de pedidos

Incorporar al sistema de Los Tordos un mecanismo sencillo de **control de tiempos por estado del pedido**, manteniendo la flexibilidad de los repartidores.

### 1. Tres plazos configurables

- **Pedido sin reservar:** tiempo máximo desde que el cliente confirma el pedido por WhatsApp hasta que un repartidor lo reserva.
- **Pedido reservado sin entregar:** tiempo máximo desde la reserva hasta la entrega efectiva.
- **Pedido entregado sin cobrar:** tiempo máximo desde la entrega hasta que se confirma el pago.

Los plazos deben poder modificarse desde el panel administrativo, sin cambiar código.

### 2. Alertas

Cuando se supera alguno de los plazos:

- Generar una alerta visible para los socios.
- Identificar el pedido, responsable, estado y tiempo transcurrido.
- Permitir intervenir manualmente: contactar al repartidor, liberar una reserva, reasignar el pedido o gestionar la cobranza.

**No cancelar pedidos ni reasignarlos automáticamente en la primera versión.**

### 3. Historial y métricas

Registrar fecha, hora y responsable de cada cambio de estado.

Esto permitirá medir cuánto demora cada etapa y ajustar los plazos basándonos en la experiencia real.

### 4. Criterio de implementación

Mantener el sistema simple. Inicialmente, las alertas pueden aparecer solamente en el panel administrativo.

Dejar preparada la estructura para incorporar posteriormente notificaciones automáticas por WhatsApp u otros medios.

**Objetivo:** garantizar un servicio de entrega razonablemente previsible sin imponer horarios fijos a los repartidores.

Antes de implementar, revisar la estructura actual de pedidos y proponer los cambios mínimos necesarios. No modificar código sin autorización.
