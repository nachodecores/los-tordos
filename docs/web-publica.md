# Web publica: primera version del rediseÃ±o

Fecha: 2026-11-18. Solo portada publica. Sistema privado, autenticacion, base de datos y tambo fuera del alcance.

## Vista previa

Ejecutar npm run dev (webpack). Servidor local: http://localhost:3000. No se publico ni se hizo push de esta entrega.

Cuatro secciones: Inicio, Inspirate, El Provo LT y Compra. En desktop (desde 1024 px), recorrido horizontal con rueda, trackpad, teclado y enlaces. En mobile, recorrido vertical con una galeria horizontal nativa en Inspirate. El foco sale de la galeria cuando se cambia de seccion. Se respeta movimiento reducido; el contenido puede crecer en pantallas pequeÃ±as o con zoom para evitar recortes.

Inicio muestra solo la fotografia; la navegacion aparece desde Inspirate. El h1 permanece disponible para lectores de pantalla sin texto visible superpuesto. Los estilos se limitan a .public-site. No se modificaron layout.jsx, globals.css ni las rutas privadas. El idioma espaÃ±ol se declara en el contenedor publico.

## Fotografias y marca

Originales intactos. Inicio usa image1.jpg, con encuadres responsive y tratamiento de contraste/iluminacion en CSS. Inspirate usa image3 (hamburguesa), image9 (scones), image8 (relleno), image2 (ensalada) e image7 (picada). Pastas esta preparada y deshabilitada hasta disponer de una foto real.

No hay fotografia de la presentacion final al vacio. La seccion de producto usa provisionalmente tipografia y el simbolo original de Los Tordos; no representa un envase inventado.

Se mantienen logo, colores y tipografia Knockout existentes. Imagenes mediante next/image con tamaÃ±os responsive, prioridad para la portada y carga diferida en la galeria.

public/logos/whatsapp-official.svg es una copia sin modificaciones de Digital_Glyph_Green_RGB_2026.svg, extraida del paquete oficial WhatsApp Brand Resource Center descargado el 2026-11-18. Fuente y condiciones: https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/. Se presenta como marca separada del simbolo de Los Tordos, sin redibujar o fusionar los logos.

## Datos pendientes

src/lib/public-site/config.mjs centraliza:
- Peso aproximado (null hasta confirmacion).
- Precio por paquete en UYU (null hasta confirmacion).
- Texto de conservacion aprobado (null: no se publica una temperatura o plazo inventados).
- Foto del envase final.
- Numero empresarial de WhatsApp (null: el boton aparece como proximamente y no abre un numero ficticio).
- Mensaje inicial editable y galeria.

No se consulta Supabase. Los datos publicos no se sincronizan todavia con el catalogo privado. Los dias de reparto y corte semanal se muestran segun el nuevo pedido de diseÃ±o: miercoles/jueves/viernes; pedidos confirmados hasta viernes 15:00 para esa semana, posteriores para el siguiente ciclo. No se cambio la operativa del sistema privado.

## Archivos

src/app/page.jsx, src/app/public-site.css, src/components/public/, src/lib/public-site/config.mjs y el icono oficial de WhatsApp. Los componentes antiguos de la portada se conservaron sin uso en esta pagina.

## Revision

Verificar desktop y mobile, rueda vertical, desplazamiento horizontal, teclado dentro y fuera de galeria, enlaces, movimiento reducido y pantallas pequeÃ±as. El boton permanece sin operacion mientras no exista un telefono confirmado. No hay carrito, formularios de pedido ni recetas definitivas.

## Ajuste posterior a la primera revision

A pedido del usuario, las fotos mobile ocupan un marco de menor altura, con fundido hacia el fondo oscuro: reduce el acercamiento y muestra mas de cada toma. Desktop conserva el encuadre completo. La seccion Compra muestra solo el simbolo de WhatsApp centrado, amarillo Los Tordos sobre violeta, sin texto visible, marco ni simbolo del ave. Se aplica color mediante mascara CSS, conservando intacto el archivo SVG original. El control mantiene nombre accesible y permanece deshabilitado hasta configurar un numero confirmado.

Imagen provisoria de producto incorporada en public/images/provo-lt-placeholder.png; edición integrada de la imagen del usuario, con tratamiento oscuro y sin peso impreso. Origen y prompt en docs/public-assets/provo-lt-placeholder.md. No representa un envase comercial definitivo.

Datos confirmados por el usuario: peso aproximado 440 g y precio por paquete UYU 395. Aplicados solo a la configuración pública. El recorrido vertical usa scroll snap obligatorio y detención en cada sección, igualando el comportamiento de encastre de la galería horizontal y evitando quedar flotando entre Inicio e Inspirate. Se mantienen los gestos nativos y la lectura del contenido que excede una pantalla.

Ajuste visual: se retiraron el subtÃ­tulo de Inspirate y ambas barras de navegaciÃ³n. Se mantienen el desplazamiento, teclado, enlaces directos por hash y controles de la galerÃ­a.

Inicio preparado para un pase exclusivo de fotos del provo mediante heroPhotos y heroSlideshow en la configuración pública. Se conserva una sola toma real por ahora; el usuario aportará otras. Con una foto no hay rotación ni controles. Con varias: fundido cruzado de 1 segundo cada 5,2 segundos, loop, espera de carga y pausa al salir de Inicio, ocultar la pestaña o activar movimiento reducido. Hay control de pausa/reanudación en modo automático. Todas las tomas comparten el mismo tratamiento visual; no se añadieron otras comidas ni variantes inventadas del provo.

Inicio ya cuenta con cuatro tomas reales: la original image1.jpg y las nuevas plancha-oregano, plancha-tabla y plancha-entero, suministradas por el usuario. Se activa el pase automatico y el loop. Los originales adjuntos se conservaron en public/images/provo, incluyendo plancha-detalle como alternativa no seleccionada. Solo se ajustan encuadre y luminosidad mediante CSS; no se regeneraron ni sustituyeron fotografias. Next Image entrega versiones optimizadas. La pausa, pestaÃ±a oculta, salida de Inicio y movimiento reducido detienen la rotacion.
Inicio: a pedido del usuario, se redujo el marco fotografico en desktop y mobile y se reforzaron sombras, contraste y viñeta radial. El entorno se funde hacia un negro con matiz violeta, manteniendo luz en el producto. Tratamiento solo CSS, sin modificar las fotos originales.

Se sumo una quinta toma real al pase de Inicio: plancha-vertical, provista por el usuario. Se conserva el tratamiento existente; la revision de iluminacion y sombras queda pendiente por indicacion del usuario.
