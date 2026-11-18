# Catálogo y clientes

Alcance vigente (2026-11-13): administración puede agregar y editar productos y clientes. Cada cliente tiene nombre, teléfono único con código de país y una dirección editable con observaciones. Todo precio es en UYU, sin selector de moneda. No se crean cuentas ni se envían mensajes al consumidor.

El usuario retiró los borradores manuales del alcance. Se eliminaron sus rutas, formularios, acciones, búsquedas auxiliares y accesos. Los pedidos se retomarán con el flujo de WhatsApp.

## Supabase

El usuario aplicó las migraciones hasta 202611130003_single_customer_address.sql. Aplicar ahora únicamente 202611130004_remove_manual_drafts.sql desde SQL Editor. Elimina la función de creación/edición de borradores, retira los permisos de pedidos y bloquea su lectura para usuarios de la aplicación. No elimina tablas ni registros existentes, ni modifica usuarios, clientes o productos.

Las migraciones anteriores se conservan como historial aplicado y para reproducir la base correctamente. No ejecutarlas de nuevo. Las tablas de pedidos quedan sin operativa de aplicación; su diseño se revisará antes de implementar WhatsApp.

## Validaciones

RLS y funciones transaccionales: solo administración puede gestionar catálogo y clientes; sin escritura directa desde el navegador. Validación de teléfono, precio decimal exacto, versión de registro, dirección única y estado activo de usuario. Los productos sin peso o precio se guardan deshabilitados.

Comprobar desde Clientes: crear ficha, agregar dirección, editar datos y verificar que no haya enlaces a borradores. Productos continúa independiente.

## Ficha unificada

Contacto, dirección y observaciones se guardan juntos mediante save_commercial_customer_form. Aplicar 202611130005_customer_form.sql después de 004. La dirección puede quedar pendiente al crear una ficha; una existente no se borra vaciando el formulario. Las observaciones requieren dirección. La operación controla las versiones de cliente y dirección, y revierte todos los cambios ante error. Editar solo contacto u observaciones preserva las coordenadas; cambiar el texto de dirección invalida su verificación. No modifica pedidos anteriores.
