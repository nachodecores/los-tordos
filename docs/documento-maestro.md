# LOS TORDOS
## Documento maestro de contexto funcional y técnico para Codex

### 1. Tu función en este proyecto

Actuá como arquitecto de software senior, diseñador de experiencia de usuario (UX/UI) y desarrollador full-stack especializado en aplicaciones web comerciales.

Vamos a transformar progresivamente la web existente de Los Tordos en una plataforma comercial que permita:

- Promocionar y vender provolone artesanal.
- Automatizar la recepción de pedidos mediante WhatsApp.
- Administrar la distribución georreferenciada de pedidos.
- Gestionar inventarios en distintos puntos físicos.
- Controlar las cobranzas y asistir en la conciliación bancaria.
- Desarrollar una red de distribuidores independientes.
- Fidelizar clientes y facilitar las compras recurrentes.

**No quiero que programes todo inmediatamente.**

Primero debés comprender el modelo de negocio, inspeccionar el código existente, identificar riesgos y proponer una arquitectura.

Después iremos implementando cada módulo por separado, con mi aprobación.

El objetivo es construir una solución profesional, segura, mantenible, económica y sencilla de utilizar.

---

# PARTE I. LA EMPRESA Y SU ESTRATEGIA COMERCIAL

## 2. Contexto de Los Tordos

Los Tordos es una empresa quesera uruguaya, desarrollada por dos socios.

Su sitio web es:

https://www.lostordos.com/

La empresa produce y comercializa quesos, especialmente provolone.

Actualmente está atravesando una transformación comercial.

Queremos desarrollar un canal de venta directa al consumidor y una red de distribución independiente, aprovechando una identidad de marca ya existente.

El producto central de este proyecto será el **Provo LT**, un provolone que queremos posicionar como un queso versátil, apto para múltiples ocasiones de consumo.

El sitio actual ya cuenta con algunas funcionalidades privadas vinculadas a una actividad histórica de producción lechera.

El tambo propio dejó de operar, pero su código debe conservarse como antecedente de desarrollo.

## 3. Objetivos comerciales

Los principales objetivos de la nueva plataforma son:

1. Aumentar las ventas directas de provolone.
2. Aumentar la frecuencia de consumo por cliente.
3. Facilitar la recompra.
4. Desarrollar un sistema comercial que requiera poca intervención humana.
5. Reducir el trabajo administrativo asociado a los pedidos.
6. Permitir que la distribución crezca sin necesidad de contratar una estructura logística tradicional.
7. Captar nuevos distribuidores independientes.
8. Mantener información centralizada de clientes, pedidos, inventarios y cobranzas.

La prioridad es conseguir una experiencia comercial sencilla para el consumidor.

No queremos construir una aplicación excesivamente compleja que termine dificultando las ventas.

## 4. Concepto de marketing: consumo multiocasión

Queremos evitar que el provolone sea percibido exclusivamente como un queso para la parrilla.

La comunicación debe mostrar que puede utilizarse en:

- Hamburguesas.
- Pastas, rallado o incorporado en preparaciones.
- Scones.
- Rellenos de tartas, empanadas y otras comidas.
- Ensaladas.
- Picadas.
- Preparaciones al horno.
- Otras ocasiones cotidianas de consumo.

La propuesta busca convertir el provolone en un producto habitual de la cocina familiar.

El concepto existente de la marca, **«Inspirate, tenés queso»**, puede servir como eje de comunicación.

No obstante, el contenido comercial y las afirmaciones sobre el comportamiento culinario del producto deberán ser validados antes de publicarse.

## 5. Presentación del producto

La presentación prevista es un cilindro de provolone envasado al vacío y etiquetado.

Dimensiones aproximadas planteadas inicialmente:

- Altura: 12 cm.
- Diámetro: 11 cm.

Estas dimensiones son preliminares.

El peso final por paquete todavía debe confirmarse. No debe asumirse automáticamente que será de 400 g ni utilizarse una estimación como dato definitivo.

El precio final al consumidor, el precio mayorista, las condiciones de conservación y la información obligatoria de etiquetado también deben ser configurables.

En el futuro podrían incorporarse otros productos.

Por eso, aunque inicialmente vendamos un único provolone, la arquitectura comercial no debería depender de que exista un solo producto para siempre.

---

# PARTE II. ESTRUCTURA GENERAL DE LA PLATAFORMA

## 6. Dos canales comerciales independientes

Esta distinción es fundamental.

Los Tordos tendrá dos canales comerciales diferentes.

### Canal A. Venta directa al consumidor

Los clientes realizan pedidos mediante el WhatsApp empresarial de Los Tordos.

Los Tordos es responsable de:

- Recibir el pedido.
- Confirmar la venta.
- Organizar la distribución.
- Entregar el producto, personalmente o mediante terceros autorizados.
- Cobrar al consumidor.
- Resolver consultas y reclamos.

Los clientes pagan directamente a Los Tordos.

### Canal B. Venta mayorista a distribuidores independientes

Personas como Tomi pueden comprar paquetes a Los Tordos a precio mayorista.

Luego los revenden por su cuenta.

En este canal:

- El distribuidor compra mercadería a Los Tordos.
- Consigue sus propios clientes.
- Define y organiza sus ventas dentro de las condiciones comerciales acordadas.
- Entrega la mercadería por sus propios medios.
- Cobra directamente a sus propios clientes.
- Asume la responsabilidad comercial de esas ventas.

**Los distribuidores independientes NO tienen acceso a los pedidos de venta directa recibidos por WhatsApp empresarial de Los Tordos.**

No deben confundirse con los repartidores que trabajan por cuenta de Los Tordos.

Esta separación debe reflejarse en los permisos, la información comercial y los inventarios.

---

# PARTE III. SITIO WEB PÚBLICO

## 7. Objetivo del sitio

La web pública tiene tres funciones principales:

1. Presentar la marca y el producto.
2. Incentivar nuevas ocasiones de consumo.
3. Convertir las visitas en pedidos por WhatsApp.

La compra no debe requerir un carrito de comercio electrónico tradicional.

**WhatsApp será el canal principal de compra.**

El sitio debe tener un diseño profesional, atractivo, responsive y especialmente cómodo en celulares.

## 8. Estructura propuesta

### Inicio

Landing page principal, con:

- Presentación visual del provolone.
- Propuesta de valor.
- Fotografías profesionales.
- Mensaje asociado al consumo multiocasión.
- Acceso destacado para comprar por WhatsApp.
- Acceso a recetas e ideas de consumo.

### El Provo LT

Información sobre:

- Características del producto.
- Presentación.
- Formas de utilización.
- Conservación.
- Precio.
- Información comercial pertinente.

### Inspirate

Sección con ideas de consumo y recetas.

Debe priorizar contenidos sencillos, visuales y prácticos.

El objetivo es estimular una mayor frecuencia de uso del queso.

No necesitamos inicialmente un sistema editorial complejo.

### Comprá

Debe explicar de manera sencilla:

- Cómo hacer un pedido.
- Cómo funciona la entrega.
- Zonas cubiertas.
- Condiciones comerciales.
- Acceso a WhatsApp.

### Trabajá con Los Tordos

Sección orientada a captar distribuidores independientes.

Debe explicar la oportunidad comercial y permitir que los interesados se postulen.

La incorporación de distribuidores estará sujeta a aprobación interna.

El formulario y los datos definitivos todavía deben definirse.

## 9. Instagram y contenido

Instagram complementará la web.

No buscamos una operación intensiva de redes sociales.

La estrategia inicial propuesta es producir aproximadamente dos publicaciones mensuales y reutilizar fotografías, recetas y otros contenidos entre Instagram y el sitio web.

No es necesario desarrollar inicialmente herramientas complejas de gestión de redes.

---

# PARTE IV. WHATSAPP Y AUTOMATIZACIÓN COMERCIAL

## 10. Principio general

Queremos que el proceso de compra ocurra prácticamente sin intervención humana.

El cliente debe poder hacer un pedido de manera sencilla, con pocos mensajes y sin registrarse en una plataforma.

El sistema será híbrido:

- Botones y opciones estructuradas para comprar.
- Interpretación de mensajes escritos naturalmente.
- Asistente de IA para consultas operativas.
- Posibilidad de derivación a una persona.

La IA nunca debe ser la única autoridad para confirmar operaciones comerciales sensibles.

## 11. Identificación del consumidor

El número telefónico se obtiene de la interacción por WhatsApp.

No se requiere registro web ni contraseña.

Los únicos datos personales necesarios inicialmente son:

- Nombre.
- Teléfono.
- Dirección de entrega.

La dirección debe poder convertirse en una ubicación geográfica verificable.

Los datos se solicitan durante el proceso de compra, no antes de que el cliente manifieste su intención de comprar.

Para clientes recurrentes, los datos podrán recuperarse de compras anteriores.

El sistema deberá permitir:

- Confirmar la dirección habitual.
- Modificarla.
- Utilizar otra dirección.
- Repetir un pedido anterior.

No pedir nuevamente datos que ya estén disponibles y sean válidos.

## 12. Flujo de compra

El flujo previsto es:

**Paso 1. Inicio**

El cliente escribe al WhatsApp empresarial o llega desde la web.

El sistema identifica el teléfono y comprueba si ya existe un registro de cliente.

**Paso 2. Selección de producto**

Presenta opciones sencillas para indicar la cantidad de paquetes.

Por ejemplo:

- 1 paquete.
- 2 paquetes.
- Otra cantidad.

También debe interpretar mensajes como:

«Quiero tres provolones».

**Paso 3. Datos de entrega**

Solicita nombre y dirección si todavía no están registrados.

Si el cliente ya existe, propone reutilizar la dirección habitual.

**Paso 4. Cobertura**

El sistema verifica si la dirección pertenece a una zona habilitada.

Si no existe cobertura, informa la situación.

Si la ubicación es dudosa, solicita una aclaración o una ubicación compartida.

**Paso 5. Resumen**

Presenta:

- Producto.
- Cantidad.
- Precio unitario.
- Importe total.
- Dirección.
- Condiciones de entrega.

**Paso 6. Confirmación**

El cliente confirma su pedido.

El sistema registra automáticamente la operación.

No requiere aprobación previa de los socios.

**Paso 7. Distribución**

El pedido aparece disponible en el sistema logístico.

**Paso 8. Entrega y pago**

El cliente recibe el producto y después realiza el pago por transferencia.

## 13. Condiciones comerciales de venta directa

Decisiones confirmadas:

- No existe pedido mínimo inicial.
- El reparto está incluido en el precio del queso.
- Inicialmente se entregará únicamente en determinadas zonas de Montevideo.
- Las zonas se definirán posteriormente desde un mapa.
- No se cobra en efectivo.
- Se elimina el pago anticipado.
- La modalidad inicial será pago electrónico posterior a la entrega.

Los precios y demás parámetros deben poder modificarse desde administración.

## 14. Zonas de cobertura

Los administradores deben poder dibujar o editar zonas habilitadas sobre un mapa.

La cobertura no debe estar definida permanentemente en el código.

El sistema debe permitir ampliar, reducir, agregar o desactivar zonas.

Una dirección fuera de cobertura no puede generar automáticamente un pedido confirmado para reparto.

Deben contemplarse direcciones ambiguas y errores de geocodificación.

## 15. Publicación automática de pedidos

Los pedidos confirmados se registran automáticamente como disponibles.

Validaciones mínimas:

- Cliente identificado.
- Cantidad válida.
- Dirección válida.
- Dirección dentro de cobertura.
- Precio correctamente calculado.
- Confirmación del cliente.
- Prevención de pedidos duplicados.

Si las condiciones se cumplen, el pedido aparece inmediatamente en el mapa.

No se requiere aprobación de los socios.

Los casos excepcionales quedan para resolución administrativa.

---

# PARTE V. ATENCIÓN AL CLIENTE

## 16. Asistente de IA

El asistente se limita a:

- Ventas.
- Estado de pedidos.
- Consultas sobre entregas.
- Cobertura.
- Precios.
- Información operativa.
- Consultas sobre pagos.

**No queremos que la IA de WhatsApp recomiende recetas ni desarrolle conversaciones gastronómicas.**

Esa función corresponde al contenido de la web.

El asistente debe utilizar información actualizada del sistema y no inventar respuestas sobre pedidos, pagos o disponibilidad.

## 17. Derivación humana

Si la IA no puede resolver una consulta o el cliente solicita atención humana:

1. Se crea una solicitud de atención.
2. Se registra el motivo y la conversación pertinente.
3. Se genera una alerta en el panel administrativo.
4. Se notifica a uno o varios responsables configurados.
5. Una persona autorizada toma la conversación.
6. La IA suspende sus respuestas mientras el caso esté en atención humana.

Los estados de atención serán:

- Pendiente.
- En atención.
- Resuelta.

La persona que atiende debe poder responder desde el canal empresarial, no desde su número personal.

## 18. Notificaciones internas

Los destinatarios de las alertas deben ser configurables.

Por ejemplo:

- Uno de los socios.
- Ambos socios.
- Una persona encargada de atención al cliente.

Las alertas podrán llegar a teléfonos personales mediante un mecanismo compatible con las reglas de WhatsApp.

Antes de implementar, investigar y validar las opciones técnicas, los costos y las restricciones de WhatsApp Business Platform.

No asumir que enviar notificaciones internas por WhatsApp es gratuito o que puede hacerse sin plantillas aprobadas.

---

# PARTE VI. MAPA Y DISTRIBUCIÓN

## 19. Concepto

Los Tordos administrará una red flexible de personas autorizadas para realizar entregas de sus pedidos de venta directa.

Estos repartidores responden a Los Tordos.

No son distribuidores independientes.

Los pedidos se muestran sobre un mapa georreferenciado.

El sistema debe funcionar correctamente desde un teléfono celular.

## 20. Reservas

Un pedido confirmado aparece con un pin gris, indicando disponibilidad.

Cualquier repartidor autorizado puede reservarlo.

No existirán inicialmente zonas asignadas a cada repartidor.

La reserva es libre.

Una vez reservado:

- Se registra quién lo reservó.
- Se registra cuándo lo reservó.
- Deja de aparecer como disponible para los demás.
- Puede seguir visible con otro estado según los permisos.

Una misma persona puede reservar varios pedidos.

La reserva debe ser atómica a nivel de base de datos: dos usuarios no pueden reservar simultáneamente el mismo pedido.

El repartidor debe poder liberar voluntariamente una reserva.

Los responsables de logística pueden reasignar pedidos.

## 21. Estados logísticos

Estados propuestos:

- Disponible: gris.
- Reservado: azul.
- En reparto: naranja.
- Entregado: verde.
- Entrega fallida: rojo.

También deberán contemplarse cancelaciones y otros estados internos necesarios.

Los colores son orientativos y deben complementarse con etiquetas e indicadores accesibles.

## 22. Organización del reparto

No queremos imponer una planificación rígida.

El repartidor puede reservar hoy un pedido que entregará dentro de dos días.

Debe poder indicar una fecha prevista de entrega, pero **ese dato es opcional**.

No se notifica automáticamente al cliente cuando alguien reserva un pedido.

Tampoco se requiere inicialmente una notificación automática al comenzar el reparto.

Los administradores podrán configurar posteriormente alertas por pedidos demorados.

Los plazos y días de entrega quedan pendientes de definición comercial.

## 23. Recorridos

El repartidor debe poder:

- Consultar sus pedidos reservados.
- Visualizarlos juntos sobre un mapa.
- Seleccionar cuáles realizará en determinado recorrido.
- Ordenarlos manualmente.
- Abrir la ruta en Google Maps o una herramienta equivalente.

Inicialmente se prefiere una solución de bajo costo que utilice enlaces de navegación externos.

La optimización automática de recorridos queda prevista como mejora futura, sujeta a evaluación de costos.

No contratar servicios de optimización sin autorización.

## 24. Información accesible al repartidor

Debe poder ver:

- Nombre del destinatario.
- Teléfono.
- Dirección.
- Ubicación geográfica.
- Cantidad de paquetes.
- Observaciones pertinentes.
- Estado del pedido.

No debe acceder a:

- Precios.
- Pagos.
- Saldos.
- Cuentas bancarias.
- Información comercial mayorista.
- Datos administrativos innecesarios.

El repartidor no cobra dinero.

## 25. Entregas fallidas

Si llega al domicilio y no puede entregar:

- Puede llamar al cliente desde el panel.
- Puede abrir WhatsApp para contactarlo.
- Puede registrar que la entrega falló.
- Puede indicar el motivo.
- El pedido permanece pendiente de resolución y no se considera entregado.

Debe conservarse un historial de eventos.

---

# PARTE VII. INVENTARIO Y CENTROS DE RETIRO

## 26. Modelo logístico

Los Tordos dispondrá de varios puntos físicos de stock.

Inicialmente:

- Una heladera en poder de uno de los socios.
- Otra heladera en poder del otro socio.

Podrán incorporarse nuevos puntos.

Cada punto tiene:

- Nombre.
- Ubicación.
- Responsable.
- Stock físico.
- Stock comprometido.
- Stock disponible.
- Stock objetivo.

Como ejemplo, un punto podría tener un objetivo de 40 paquetes.

Este número debe ser configurable.

## 27. Reposición

La reposición será periódica.

Se planteó inicialmente el miércoles como día habitual.

Cada punto debería recuperar su stock objetivo.

El sistema debe calcular:

Stock a reponer = Stock objetivo - Stock físico disponible o existente, considerando movimientos y compromisos según corresponda.

El responsable debe poder consultar necesidades de reposición.

## 28. Retiro por repartidores

Los repartidores pueden elegir libremente de qué punto retirar mercadería.

No se asigna obligatoriamente una heladera a cada repartidor.

Condiciones:

- Debe existir disponibilidad.
- La reserva del pedido puede comprometer unidades.
- El retiro físico debe registrarse.
- Debe registrarse quién retira, cuándo, cuánto y desde qué punto.
- El inventario debe actualizarse correctamente.

Diferenciar cuidadosamente:

- Stock físico.
- Stock reservado.
- Stock disponible.
- Stock retirado.
- Stock entregado.
- Stock devuelto.

Evitar que dos reservas o retiros generen stock negativo.

Prever devoluciones, ajustes e inventario en tránsito.

---

# PARTE VIII. COBRANZAS

## 29. Modelo de cobro

Los clientes de venta directa pagan mediante transferencia electrónica después de recibir la mercadería.

La cuenta receptora será de Los Tordos en Banco Santander Uruguay.

No habrá pagos en efectivo.

No habrá pago anticipado inicialmente.

El cliente no debe estar obligado a:

- Enviar comprobantes.
- Ingresar números de referencia.
- Registrarse en una pasarela.
- Realizar trámites adicionales para facilitar nuestra contabilidad.

La experiencia debe ser lo más simple posible.

## 30. Notificación automática de entrega

Cuando el repartidor marca un pedido como entregado, el sistema dispara una notificación por WhatsApp al consumidor.

Debe incluir:

- Confirmación de entrega.
- Importe total.
- Banco.
- Número de cuenta.
- Titular de la cuenta.
- Agradecimiento por la compra.

Los datos bancarios serán configurables.

Este mensaje será el único mensaje automático de seguimiento posterior a la confirmación del pedido previsto inicialmente.

No enviar recordatorios automáticos de cobranza.

Los mensajes transaccionales propios del proceso de compra son una categoría diferente y deben continuar funcionando.

El envío de la notificación debe ser idempotente: registrar el evento y evitar envíos duplicados.

Verificar con Meta las condiciones, plantillas y costos de esta automatización.

## 31. Estados de cobranza

Inicialmente:

- Pendiente de pago.
- Pagado.

El sistema puede incorporar estados internos para conciliación, incidencias y ajustes cuando sean necesarios.

El estado de cobranza debe ser independiente del estado de distribución.

## 32. Conciliación bancaria asistida

Queremos importar o consultar movimientos de Santander y vincularlos con los pedidos pendientes.

No debe asumirse que existe una API bancaria pública disponible.

Codex deberá investigar o dejar preparada una arquitectura que permita:

- Integración bancaria si existe una opción autorizada.
- Importación de archivos bancarios, CSV u otros formatos.
- Incorporación de nuevas fuentes de datos en el futuro.

La conciliación no será completamente automática.

**El sistema propone coincidencias y el responsable administrativo las confirma.**

Nunca marcar un pedido como pagado solamente por una sugerencia algorítmica.

## 33. Aprendizaje de cuentas emisoras

Queremos que el sistema aprenda a identificar transferencias recurrentes.

Ejemplo:

1. Una persona realiza una transferencia.
2. El sistema propone un pedido.
3. El encargado confirma manualmente la asociación.
4. Se guarda la relación entre la cuenta de origen y el cliente.
5. En una compra posterior, si aparece una transferencia desde la misma cuenta, se propone nuevamente ese cliente.

El sistema puede considerar:

- Cuenta emisora, cuando el banco la informe.
- Titular de origen.
- Importe.
- Fecha.
- Historial de asociaciones verificadas.
- Pedidos pendientes compatibles.

Las cuentas pueden ser compartidas entre clientes.

Las coincidencias de importes no bastan para identificar pagos cuando muchos paquetes tienen el mismo precio.

El sistema debe mostrar distintos niveles de confianza, pero la confirmación será siempre humana.

No utilizar IA generativa para decidir si un movimiento bancario debe asignarse definitivamente a un pedido.

## 34. Panel de conciliación

Debe ofrecer:

- Movimientos importados.
- Pedidos entregados pendientes de cobro.
- Coincidencias sugeridas.
- Información del emisor disponible.
- Nivel de confianza.
- Posibilidad de confirmar una coincidencia.
- Posibilidad de buscar y asignar manualmente.
- Posibilidad de corregir errores.
- Historial de conciliaciones.

Prevenir que un mismo movimiento se aplique accidentalmente dos veces.

Cada operación debe conservar:

- Usuario responsable.
- Fecha.
- Hora.
- Acción realizada.
- Estado anterior y nuevo estado, según corresponda.

## 35. Responsable de cobranzas

Existirá un perfil de usuario con autonomía operativa para:

- Consultar deudas.
- Importar movimientos.
- Revisar conciliaciones.
- Confirmar pagos.
- Corregir asociaciones equivocadas.
- Contactar manualmente a clientes.
- Registrar gestiones de cobranza.

Puede ser uno de los socios o un empleado.

No necesita autorización de los socios para cada pago que confirma.

Sus operaciones deben quedar auditadas.

## 36. Reclamos de cobranza

No queremos recordatorios automáticos.

El responsable consulta los pedidos entregados pendientes de pago y decide a quién contactar.

Desde el panel podrá abrir una conversación de WhatsApp con un mensaje sugerido y editable.

Ejemplo:

"Hola, ¿cómo estás? Te escribimos de Los Tordos porque todavía no hemos podido identificar el pago de tu pedido. Te compartimos nuevamente nuestra cuenta para transferir. Si ya realizaste el pago, avisánoslo así podemos verificarlo. ¡Muchas gracias!"

El mensaje no debe enviarse automáticamente.

Debe existir la posibilidad de registrar:

- Fecha del contacto.
- Responsable.
- Resultado.
- Observaciones.

Importante: un pago no conciliado no significa necesariamente que el cliente no haya pagado.

---

# PARTE IX. DISTRIBUIDORES INDEPENDIENTES

## 37. Funcionamiento comercial

Los distribuidores compran mercadería a Los Tordos a precio mayorista para revenderla.

Este canal es independiente de la venta directa.

El sistema debería permitir:

- Registrar distribuidores.
- Registrar ventas mayoristas.
- Registrar cantidades compradas.
- Registrar precio mayorista.
- Registrar las cobranzas de esas ventas, cuando corresponda.
- Consultar historial comercial.

No deben aparecer como repartidores de pedidos de venta directa salvo que reciban explícitamente ese rol adicional.

## 38. Captación desde la web

Incluir una sección pública:

**Trabajá con Los Tordos**

Su objetivo es captar personas interesadas en comercializar los productos.

El interesado puede solicitar información o postularse.

Los socios aprueban o rechazan cada incorporación.

La información comercial pública y el procedimiento de aprobación deben definirse posteriormente.

## 39. Portal de distribuidores

Podría existir un portal privado para consultar compras y movimientos.

Pero su alcance exacto queda pendiente.

No implementar funcionalidades complejas de distribuidor sin una definición posterior.

---

# PARTE X. ADMINISTRACIÓN Y PERMISOS

## 40. Panel principal

Queremos un panel administrativo extremadamente sencillo.

La pantalla inicial debería mostrar, de forma resumida:

- Pedidos pendientes.
- Entregas en curso.
- Cobranzas pendientes.
- Stock en los centros de retiro.

Debe existir un acceso muy visible al **mapa de pedidos**.

No queremos dashboards llenos de gráficos, métricas o indicadores innecesarios.

La aplicación debe estar optimizada para uso desde celulares y computadoras.

## 41. Roles

### Administradores

Inicialmente los dos socios.

Acceso completo:

- Usuarios y permisos.
- Pedidos.
- Clientes.
- Logística.
- Inventarios.
- Cobranzas.
- Parámetros comerciales.
- Configuración de zonas.
- Notificaciones.
- Auditoría.

### Responsable de logística

Puede:

- Gestionar pedidos.
- Modificar direcciones.
- Resolver problemas de entrega.
- Administrar asignaciones.
- Supervisar repartidores.
- Gestionar operaciones de stock según los permisos asignados.

No debe acceder automáticamente a la conciliación bancaria.

### Repartidor

Puede:

- Ver pedidos disponibles.
- Reservar pedidos.
- Liberar reservas.
- Consultar sus pedidos.
- Retirar mercadería.
- Registrar entregas e incidencias.
- Contactar clientes por problemas de entrega.

No puede consultar información financiera.

### Responsable de cobranzas

Puede:

- Consultar deudas.
- Conciliar movimientos.
- Confirmar pagos.
- Corregir conciliaciones.
- Contactar clientes para gestionar pagos.

No tiene por defecto facultades de administración logística.

### Distribuidor independiente

Puede tener acceso a su información comercial mayorista, según las funcionalidades que se aprueben.

No accede a pedidos de venta directa ni al mapa logístico de Los Tordos.

### Roles combinados

Un usuario puede tener más de un rol.

Por ejemplo, uno de los socios puede actuar también como repartidor y responsable de cobranzas.

No deben compartirse credenciales.

---

# PARTE XI. AUTENTICACIÓN Y SEGURIDAD

## 42. Proyecto existente

El sitio está desarrollado con Next.js.

Ya existe una sección restringida con usuarios, contraseñas y conexión a una base de datos.

Esa funcionalidad fue desarrollada para administrar información del tambo.

El mecanismo de autenticación es elemental y no debe considerarse adecuado para el nuevo sistema sin una auditoría.

Primero debés inspeccionar:

- Estructura del proyecto.
- Versión de Next.js.
- Rutas.
- Componentes.
- Sistema de autenticación.
- Almacenamiento de contraseñas.
- Base de datos.
- Dependencias.
- Variables de entorno.
- Protección de rutas.
- Permisos.
- Infraestructura de despliegue.

Determinar si utiliza Supabase u otro servicio.

No asumir tecnologías adicionales sin verificar el código.

## 43. Conservación del módulo histórico

Quiero conservar el código relacionado con el tambo porque representa trabajo de desarrollo realizado anteriormente y podría servir para mostrar mi experiencia en programación.

Sin embargo:

- No debe figurar en la navegación pública.
- No debe estar accesible operativamente en producción.
- No debe permitir acceso a datos históricos sensibles.
- No debe representar un riesgo de seguridad.
- No debe interferir con los nuevos módulos.

Recomendar una estrategia de conservación mediante Git, ramas, etiquetas o repositorio de archivo, según resulte conveniente.

Conservar el antecedente técnico no implica mantener endpoints inseguros activos.

No eliminar código ni datos históricos sin aprobación.

## 44. Nueva autenticación

La nueva plataforma debe tener autenticación profesional.

Preferencias:

- Servicio consolidado de autenticación.
- Inicio de sesión seguro.
- Contraseñas correctamente administradas.
- Autenticación multifactor para administradores y roles sensibles.
- Recuperación segura de acceso.
- Sesiones protegidas.
- Autorización verificada en servidor.
- Control de permisos sobre datos y operaciones.
- Auditoría.

Si ya existe Supabase y resulta adecuado, evaluar Supabase Auth y Row Level Security.

No implementar un sistema casero de seguridad cuando exista una solución consolidada.

Los consumidores finales no requieren cuentas.

Los usuarios internos deben ser invitados o creados por administradores.

No debe existir registro público libre para obtener acceso a módulos privados.

Los distribuidores postulantes no deben recibir automáticamente credenciales.

---

# PARTE XII. ARQUITECTURA TÉCNICA

## 45. Principios

La arquitectura debe ser:

- Modular.
- Incremental.
- Segura.
- Mantenible.
- Relativamente sencilla.
- Económica de operar.
- Escalable si aumentan ventas y usuarios.
- Compatible con el proyecto existente.

No introducir servicios innecesarios.

Priorizar funciones reales sobre complejidad tecnológica.

## 46. Tecnologías

Tecnología confirmada:

- Next.js.

Tecnologías a evaluar después de inspeccionar el repositorio:

- TypeScript.
- Tailwind CSS.
- Supabase/PostgreSQL.
- Servicio geográfico y mapas.
- WhatsApp Business Platform.
- Proveedor de IA.
- Hosting existente.
- Servicios de notificaciones.

No asumir que estas herramientas están implementadas.

Tampoco asumir que los servicios externos son gratuitos.

## 47. Integración con WhatsApp

Antes de programar la integración, evaluar:

- Acceso oficial a WhatsApp Business Platform.
- Configuración necesaria.
- Webhooks.
- Mensajes interactivos.
- Plantillas.
- Costos.
- Ventanas de atención.
- Envío y recepción de mensajes.
- Atención humana y automatizada desde el mismo número.
- Manejo de fallos.
- Protección contra mensajes duplicados.
- Seguridad de credenciales y webhooks.

No recomendar soluciones no oficiales que pongan en riesgo la cuenta empresarial.

## 48. Mapas y georreferenciación

Evaluar una solución que permita:

- Mostrar pedidos georreferenciados.
- Dibujar polígonos de cobertura.
- Validar ubicaciones.
- Reservar pedidos desde el mapa.
- Mostrar varios puntos de stock.
- Agrupar pedidos por repartidor.
- Abrir recorridos en una aplicación de navegación.

Priorizar costos bajos y evitar dependencias innecesarias.

## 49. Datos y trazabilidad

Diseñar una base de datos coherente para:

- Clientes.
- Direcciones.
- Productos.
- Pedidos.
- Líneas de pedido.
- Usuarios.
- Roles y permisos.
- Asignaciones.
- Eventos logísticos.
- Puntos de stock.
- Movimientos de inventario.
- Ventas mayoristas.
- Distribuidores.
- Movimientos bancarios.
- Conciliaciones.
- Conversaciones y solicitudes de atención.
- Configuración.
- Auditoría.

No crear tablas sin considerar las relaciones y las operaciones que deben soportar.

Contemplar concurrencia, transacciones, integridad referencial e idempotencia.

## 50. Seguridad de datos personales

El sistema manejará nombres, teléfonos, direcciones, ubicaciones y datos de cobranzas.

Diseñar acceso mínimo necesario, separación de roles y protección de datos.

Considerar las obligaciones aplicables en Uruguay sobre protección de datos personales y comunicaciones comerciales.

No exponer datos bancarios sensibles ni credenciales en el frontend o repositorio.

---

# PARTE XIII. DECISIONES PENDIENTES

Las siguientes cuestiones NO están definitivamente resueltas:

1. Peso y formato comercial final del paquete.
2. Precio minorista definitivo.
3. Precio mayorista definitivo.
4. Zonas exactas de cobertura.
5. Plazos de entrega.
6. Días habituales de reparto.
7. Condiciones para entregas fuera de las zonas.
8. Sistema definitivo de comunicación entre logística y clientes.
9. Procedimiento de reposición y confirmación física de inventario.
10. Alcance del portal privado de distribuidores.
11. Datos del formulario para postulantes.
12. Método de importación de movimientos Santander.
13. Proveedor de infraestructura de WhatsApp.
14. Modelo y proveedor de IA.
15. Servicios concretos de geocodificación y mapas.
16. Diseño visual definitivo.
17. Estructura de páginas y componentes existentes que convenga conservar.
18. Políticas de cancelación, devolución y reclamos.
19. Parámetros definitivos de alertas por demora.
20. Condiciones de acceso y permisos de funciones todavía no implementadas.

No tomes decisiones comerciales definitivas sobre estos puntos.

Cuando una decisión sea imprescindible para una etapa, planteá las alternativas y pedí aprobación.

---

# PARTE XIV. PLAN DE TRABAJO

## 51. Implementación incremental

No quiero que construyas todo el sistema de una vez.

Trabajaremos con módulos y verificaremos cada etapa.

Orden inicial propuesto:

### Módulo 00. Diagnóstico técnico

Inspeccionar el código existente y proponer arquitectura.

### Módulo 01. Autenticación y autorización

Implementar un mecanismo de acceso seguro y permisos por rol.

### Módulo 02. Panel administrativo

Crear estructura de navegación, resumen simple y acceso al mapa.

### Módulo 03. Clientes, productos y pedidos

Implementar entidades y reglas comerciales fundamentales.

### Módulo 04. Georreferenciación y reparto

Implementar mapa, zonas, reservas y registro de entregas.

### Módulo 05. Inventario

Implementar puntos de stock, movimientos y reposiciones.

### Módulo 06. WhatsApp

Implementar recepción de pedidos e integración operativa. Puede requerir preparación previa en etapas anteriores.

### Módulo 07. Atención mediante IA

Implementar consultas operativas, derivación humana y notificaciones configurables.

### Módulo 08. Cobranzas

Implementar registro de pagos y conciliación asistida.

### Módulo 09. Distribuidores independientes

Implementar administración comercial mayorista y captación.

### Módulo 10. Renovación web pública

Actualizar diseño, producto, contenido e integración comercial, reutilizando componentes existentes cuando corresponda.

### Módulo 11. Integración, pruebas y despliegue

Validar flujos, seguridad, permisos, rendimiento y funcionamiento integral.

Este orden debe revisarse luego del diagnóstico técnico.

## 52. Forma de trabajar

Para cada módulo:

1. Analizá el código existente relacionado.
2. Explicá qué pretendés modificar.
3. Identificá dependencias.
4. Indicá si requiere servicios externos o costos.
5. Proponé la implementación.
6. Esperá mi aprobación.
7. Implementá exclusivamente el alcance autorizado.
8. Ejecutá pruebas.
9. Informá los archivos modificados.
10. Indicá cómo verificar el funcionamiento.
11. Identificá pendientes y limitaciones.
12. Esperá mi aprobación antes de avanzar al módulo siguiente.

No modifiques módulos que todavía no hayan sido aprobados.

No cambies la infraestructura productiva ni realices migraciones destructivas sin autorización explícita.

No publiques nuevas versiones sin aprobación.

## 53. Criterios generales de calidad

El sistema final debe:

- Ser sencillo para el consumidor.
- Ser sencillo para los usuarios internos.
- Evitar tareas administrativas innecesarias.
- Impedir accesos no autorizados.
- Mantener información consistente.
- Evitar registros duplicados.
- Funcionar en celulares.
- Conservar trazabilidad de operaciones importantes.
- Permitir modificaciones futuras.
- Evitar costos recurrentes injustificados.

No priorices la cantidad de funcionalidades por encima de la confiabilidad.

## 54. Tu primera tarea

**Por ahora, solamente quiero un diagnóstico y un plan de implementación.**

Leé este documento como contexto del proyecto.

Después:

1. Inspeccioná el repositorio actual.
2. Describí la arquitectura existente.
3. Identificá la base de datos y autenticación.
4. Identificá el módulo histórico del tambo.
5. Proponé cómo preservarlo de forma segura.
6. Compará lo existente con los requerimientos de este documento.
7. Señalá incompatibilidades, riesgos y dependencias.
8. Proponé la arquitectura técnica que consideres adecuada.
9. Revisá el orden de implementación.
10. Indicá las decisiones que debemos resolver para iniciar el primer módulo.

Entregá el diagnóstico de manera breve, estructurada y comprensible.

**No escribas ni modifiques código todavía.**

No crees archivos, tablas, migraciones ni configuraciones.

Esperá mi autorización antes de implementar.

Este documento debe considerarse contexto funcional de referencia para todo el desarrollo de Los Tordos. Las decisiones nuevas que yo apruebe posteriormente tendrán prioridad sobre cualquier supuesto anterior.