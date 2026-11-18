# Ubicación y cobertura

Primera entrega local: una zona comercial general editable y una ubicación manual por cliente. Solo administración puede consultar y modificar esta configuración. No implementa pedidos, reservas, mensajes ni asignaciones a repartidores.

## Activación

Después de 005, ejecutar una sola vez el archivo completo supabase/migrations/202611130006_coverage.sql en SQL Editor de Supabase. No se aplicó remotamente durante el desarrollo. No requiere claves nuevas ni PostGIS. No precarga cobertura, coordenadas, precios o datos comerciales.

1. Recargar el panel y abrir Cobertura.
2. Marcar puntos en orden alrededor del área, terminar el dibujo, habilitar la cobertura y guardar. El mapa inicialmente centrado en Montevideo no define cobertura.
3. Deshacer quita el último vértice; Dibujar de nuevo cambia solo el dibujo local hasta guardar. También se pueden agregar coordenadas manualmente.
4. Abrir un cliente, marcar su ubicación, guardar y recargar para comprobarla.
5. Probar puntos interiores, exteriores y sobre el borde. Se muestran Dentro, Fuera o Sobre el límite: revisar. Sin ubicación o sin una zona activa, la cobertura queda pendiente.
6. Editar la dirección: se quita la ubicación anterior para revisarla. Editar solo contacto u observaciones mantiene una ubicación verificada.
7. Si otro administrador cambió la ficha o zona, recargar antes de guardar. El control de versiones impide sobrescribir cambios silenciosamente.

## Implementación y límites

Leaflet 1.9.4 se carga en el navegador, dentro del panel. El fondo utiliza mosaicos de OpenStreetMap, con atribución visible, caché normal del navegador y referrerPolicy origin en las imágenes. No se envían nombre, teléfono o texto de direcciones al proveedor; este recibe las solicitudes de mosaicos y los datos normales de conexión del navegador. Sin geocodificación, búsquedas de direcciones ni descarga masiva de mapas.

El servicio público de mosaicos es de disponibilidad no garantizada y tiene política de uso. Se puede cambiar mediante NEXT_PUBLIC_MAP_TILE_URL y NEXT_PUBLIC_MAP_ATTRIBUTION, conservando la atribución del proveedor elegido. Reiniciar el servidor/recompilar al modificar estas variables. No se modificó .env.local. Antes de un despliegue de mayor tráfico, revisar proveedor y política.

Fuentes: https://leafletjs.com/reference-1.9.4.html y https://operations.osmfoundation.org/policies/tiles/.

Se admite un perímetro simple de 3 a 100 vértices [longitud, latitud], sin huecos, cruces, puntos repetidos o vértices colineales. Es una zona local: amplitud máxima técnica de 5 grados por eje, coordenadas con seis decimales y latitudes entre -85 y 85 por la proyección del mapa. Estos límites técnicos no habilitan ninguna zona de venta.

La validación se repite en servidor y PostgreSQL. El punto se evalúa con el perímetro vigente; no se guarda una etiqueta de cobertura que quede desactualizada. El borde queda ambiguo para revisión manual. No se modifica ningún pedido existente.

La tabla commercial_coverage tiene RLS, lectura solo para administración y escrituras mediante RPC con verificación de sesión, cuenta activa y permisos. Los cambios de zona registran responsable, fecha, estado previo y nuevo en access_audit. La ficha unificada guarda coordenadas verificadas manualmente con las mismas protecciones transaccionales y de versión. commercial_point_coverage realiza la comprobación en PostgreSQL; no se expone acceso anónimo ni a WhatsApp en esta etapa.

## Verificación

Pruebas PostgreSQL aislado y JavaScript: geometrías inválidas, zonas cóncavas, límites, interior/exterior, permisos por rol, desactivación, versión, auditoría y guardado/invalidation de coordenadas. Las pruebas anteriores de clientes, catálogo y autenticación siguen activas. Falta la revisión visual y el circuito autenticado en el navegador del usuario, después de aplicar la migración.
