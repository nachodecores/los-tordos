# Los Tordos: actualización del modelo comercial y operativo

## Contexto

Estamos desarrollando una plataforma comercial para Los Tordos, utilizando Next.js y herramientas de programación asistida.

El objetivo principal es **aumentar las ventas de provolone en el canal minorista, que tiene mayor margen, minimizando el trabajo administrativo y manteniendo un control centralizado del negocio**.

La aplicación es un medio para hacer viable ese modelo comercial, no un fin en sí mismo.

Las siguientes decisiones actualizan y reemplazan parcialmente las definiciones del documento maestro anterior.

## 1. Producto estandarizado

El producto será una presentación de provolone de aproximadamente **450 gramos**, envasada al vacío y etiquetada.

Todavía debemos desarrollar físicamente esta presentación.

Inicialmente trabajaremos con:

- Un único producto.
- Un peso estandarizado.
- Un precio de venta único.
- Una comisión definida por paquete entregado.

Esta estandarización debe facilitar el cálculo automático de ventas, stock, comisiones y cobranzas.

Los parámetros comerciales deben ser configurables, aunque inicialmente haya un solo producto.

## 2. Modelo comercial unificado

Eliminamos, para este proyecto, la separación entre distribuidores independientes y repartidores.

Los colaboradores serán **repartidores autorizados de Los Tordos**, con stock bajo su responsabilidad.

Los Tordos:

- Mantiene la propiedad de la mercadería hasta su venta.
- Consigue clientes mediante publicidad, web, Instagram, WhatsApp y recomendaciones.
- Centraliza los pedidos.
- Cobra directamente a los consumidores.
- Administra el stock.
- Calcula y paga las comisiones de reparto.

Los repartidores no compran la mercadería para revenderla por su cuenta.

Si consiguen clientes nuevos, deben dirigirlos al WhatsApp empresarial para registrar el pedido mediante el bot.

Todas las ventas deben quedar registradas en la aplicación.

## 3. Reservas libres y distribución flexible

Cada repartidor tendrá un usuario individual y acceso al mapa de pedidos.

El sistema permitirá:

1. Ver pedidos disponibles georreferenciados.
2. Reservar libremente pedidos de cualquier zona habilitada.
3. Agrupar varios pedidos para organizar entregas.
4. Consultar pedidos reservados.
5. Marcar pedidos como entregados.
6. Registrar entregas fallidas.

No habrá territorios exclusivos ni horarios obligatorios.

Los repartidores podrán aprovechar sus desplazamientos habituales, tiempo libre u otros recorridos laborales.

El primero que reserve válidamente un pedido será su responsable.

Los socios podrán liberar o reasignar reservas cuando sea necesario.

**Decisión pendiente:** definir si los repartidores que captan clientes tendrán algún mecanismo temporal de prioridad para entregar sus pedidos. No implementar exclusividad ni comisiones de captación sin aprobación posterior.

## 4. Cobertura geográfica

Los Tordos definirá una zona comercial general dentro de Montevideo.

No se aceptarán pedidos automáticamente fuera de esa cobertura.

La zona debe poder dibujarse y modificarse desde el mapa administrativo.

Dentro de la zona habilitada, cualquier repartidor autorizado podrá reservar cualquier pedido.

Inicialmente no se implementarán zonas preferenciales para repartidores.

## 5. Control de stock individual

Cada repartidor tendrá un inventario registrado en el sistema.

Ejemplo:

- Los Tordos entrega 20 paquetes a Tomi.
- El sistema registra un ingreso de 20 paquetes a su stock.
- Tomi entrega un pedido de 2 paquetes.
- Al marcarlo como entregado, se descuentan automáticamente 2 paquetes.
- Su stock disponible pasa a 18 paquetes.

El inventario debe actualizarse mediante los eventos de entrega, sin exigir registros adicionales al repartidor.

Los administradores podrán:

- Asignar stock.
- Consultar existencias por repartidor.
- Registrar reposiciones.
- Registrar devoluciones.
- Hacer ajustes justificados.
- Consultar el historial de movimientos.

Cada movimiento debe registrar fecha, cantidad, usuario responsable y motivo.

El sistema debe impedir que una entrega produzca stock negativo.

## 6. Pedido íntegramente por WhatsApp

El consumidor realiza todo el pedido dentro del WhatsApp empresarial de Los Tordos.

No se utilizarán formularios web externos para realizar compras.

Flujo:

1. El cliente inicia la conversación.
2. Indica cuántos paquetes quiere, mediante botones o texto libre.
3. Si es nuevo, facilita nombre y dirección.
4. Si ya existe, puede reutilizar sus datos.
5. El sistema verifica cobertura.
6. Muestra el importe total.
7. El cliente confirma.
8. El pedido se registra automáticamente y aparece en el mapa.

La web pública estará orientada a promocionar el producto y atraer compradores a WhatsApp.

## 7. Cobranza posterior a la entrega

El repartidor no interviene en la cobranza.

Cuando marca un pedido como **Entregado**:

1. Se registra la entrega.
2. Se descuenta el stock correspondiente.
3. Se calcula su comisión.
4. Se genera o actualiza la cuenta por cobrar.
5. Se envía automáticamente un WhatsApp al número que realizó el pedido.

El mensaje indicará:

"Tu pedido de Los Tordos fue entregado.

Total: $[importe]

¿Cómo preferís pagar?"

Debe presentar dos opciones mediante botones interactivos:

**Opción A: enlace de pago electrónico.**

El cliente recibe un enlace asociado a su pedido.

Idealmente, el proveedor de pagos debe notificar al sistema cuando el pago queda acreditado, para permitir conciliación automática.

**Opción B: transferencia bancaria.**

El cliente recibe los datos de la cuenta Santander de Los Tordos, el importe y una referencia sugerida para facilitar la identificación.

No debe exigirse que envíe comprobantes.

El objetivo es minimizar la fricción para el comprador.

Se descarta el QR presencial como opción inicial.

El cliente puede recibir el queso en portería o mediante un tercero y pagar posteriormente desde su teléfono.

## 8. Conciliación bancaria

Para pagos mediante enlaces, buscamos confirmación automática del proveedor, mediante una integración segura.

Para transferencias bancarias, se utilizará inicialmente conciliación asistida.

El sistema podrá proponer coincidencias basadas en:

- Importe.
- Fecha.
- Titular de origen, si está disponible.
- Cuenta emisora, si está disponible.
- Historial de asociaciones verificadas.

El encargado administrativo confirma las coincidencias.

Las transferencias no deben marcarse automáticamente como conciliadas sin confirmación humana.

Los movimientos ambiguos permanecerán pendientes.

## 9. Comisión del repartidor

La comisión preliminar es de **$100 por paquete efectivamente entregado**.

No se calcula por hora, kilómetro, recorrido ni domicilio.

Un repartidor que entrega varios paquetes en una misma dirección cobra por todos ellos.

Por ejemplo:

- 3 paquetes entregados: $300.
- 10 paquetes entregados: $1.000.
- 40 paquetes entregados: $4.000.

La aplicación debe calcular automáticamente las comisiones.

La liquidación y el pago a los repartidores podrán realizarse manualmente inicialmente.

**Queda pendiente establecer si las comisiones se liquidan por entregas realizadas o solamente por ventas efectivamente cobradas.**

El valor definitivo por paquete también queda pendiente de validación.

## 10. Números económicos preliminares

Los cálculos anteriores se realizaron para un paquete de 400 gramos vendido a $390.

Equivalencias:

| Concepto | $/kg |
|---|---:|
| Precio de venta | 975 |
| Costo de producción estimado | -270 |
| Fraccionado y envasado | -50 |
| Comisión del repartidor | -250 |
| Comisión de cobro electrónico estimada | -59 |
| Margen de contribución estimado | 346 |

Este resultado es anterior a impuestos y otros costos no incluidos.

No debe interpretarse como utilidad neta definitiva.

**Importante:** el nuevo producto previsto será de aproximadamente 450 gramos. Su precio y rentabilidad deberán recalcularse antes de aprobar el modelo económico.

## 11. Panel administrativo sencillo

Los socios quieren una herramienta de control, no un ERP complejo.

La pantalla principal mostrará:

- Pedidos sin reservar.
- Pedidos reservados pendientes de entrega.
- Pedidos entregados pendientes de cobro.
- Cobranzas realizadas.
- Stock por repartidor.
- Comisiones acumuladas.

Debe existir un acceso directo y destacado al mapa.

Los socios podrán intervenir manualmente en los pedidos cuando sea necesario.

## 12. Alertas y automatizaciones

La primera versión debe ser sencilla, pero permitir incorporar alertas posteriormente.

Situaciones relevantes:

- Pedido sin reservar durante demasiado tiempo.
- Pedido reservado que no se entrega.
- Pedido entregado sin cobrar.
- Stock bajo de un repartidor.
- Fallo al enviar una notificación de WhatsApp.
- Fallo al procesar una confirmación de pago.

Los umbrales y destinatarios deben ser configurables.

No desarrollar inicialmente un sistema complejo de alarmas.

Debe conservarse un historial de estados, fechas y responsables para permitir automatizaciones futuras.

## 13. Principio de desarrollo

El proyecto se desarrollará por módulos y versiones sucesivas.

Prioridades:

1. Simplicidad para el consumidor.
2. Simplicidad para el repartidor.
3. Control para los socios.
4. Automatización de tareas repetitivas.
5. Bajos costos operativos.
6. Seguridad y mantenibilidad.
7. Facilidad para agregar funcionalidades con el uso.

No construir funcionalidades complejas para resolver situaciones hipotéticas.

No introducir tecnologías o servicios innecesarios.

El sistema debe permitir intervenir manualmente cuando falle una automatización.

## 14. Instrucciones para Codex

Utilizá este documento como una actualización de los requisitos del proyecto Los Tordos.

Contrastá estas decisiones con el documento maestro anterior y señalá cualquier incompatibilidad relevante.

No implementes todavía las decisiones pendientes.

Antes de modificar código:

1. Identificá los módulos afectados por estos cambios.
2. Explicá cómo impactan en el modelo de datos.
3. Indicá qué funcionalidades anteriores deben reemplazarse.
4. Proponé un orden de implementación incremental.
5. Identificá servicios externos y costos asociados.
6. Esperá mi autorización.

No realices cambios destructivos ni implementes todo el sistema en una única etapa.

**Objetivo central: vender más queso con mayor margen, manteniendo la administración y el control operativo tan simples como sea posible.**