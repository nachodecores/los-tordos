# Editor temporal de Inicio

Con `npm run dev`, abrir `/editor-fotos`. La ruta devuelve 404 en produccion.
No usa Supabase ni modifica archivos o fotos originales.

Seleccionar una de las cinco fotos. Luz, color, sombras y nitidez se comparten entre vistas; posicion y zoom se ajustan separadamente para celular y escritorio. La vista previa usa el componente real de Inicio dentro de un iframe y mantiene fija la foto seleccionada.

Los cambios se guardan automaticamente en localStorage de ese navegador y origen. No se aplican a visitantes. Descargar `hero-adjustments.json` para conservarlos fuera del navegador. Se puede importar ese mismo archivo para continuar en otro navegador.

Para publicar los ajustes elegidos, reemplazar `src/lib/public-site/hero-adjustments.json` por la descarga, revisar y compilar. Luego se pueden retirar la ruta `editor-fotos`, su CSS, `HeroPhotoEditor.jsx` y el efecto de vista previa de desarrollo de `HeroPanel.jsx`. Conservar el JSON, la validacion y los estilos de las fotos.

Nitidez: realce de bordes SVG, sin reconstruccion de detalles perdidos por desenfoque. No modifica los originales.
