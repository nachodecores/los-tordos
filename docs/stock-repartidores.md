# Cuenta corriente de stock por repartidor

## Alcance aprobado

El aprovisionamiento físico queda fuera de la aplicación. No hay centros de retiro. Administración registra las entradas recibidas por cada repartidor y las correcciones. Cada repartidor consulta únicamente sus saldos e historial. El descuento por entrega se incorporará con el módulo de entregas; no está automatizado en esta etapa.

Se llevan paquetes enteros por producto. Una corrección indica el saldo real y un motivo obligatorio; el sistema registra la diferencia positiva o negativa. El saldo no puede quedar negativo y los movimientos anteriores no se modifican ni borran.

## Activación y prueba manual

Después de la migración 006, aplicar una sola vez supabase/migrations/202611130007_courier_stock.sql en Supabase SQL Editor. No se ejecutó remotamente durante el desarrollo. No requiere claves ni servicios adicionales. No precarga repartidores, cantidades o movimientos.

1. Recargar el panel y abrir Stock.
2. Debe existir al menos un producto y una cuenta activa con rol Reparto. Administración asigna ese rol desde Usuarios. Un administrador sin rol Reparto no se ofrece como destinatario de entradas.
3. Registrar una entrada, por ejemplo una cantidad real recibida por un repartidor. Verificar saldo, fecha y responsable en el historial.
4. Para corregir, elegir Corrección de saldo, indicar el saldo real y explicar el motivo. Comprobar que se agrega la diferencia al historial, sin alterar la entrada anterior.
5. Con una cuenta de Reparto, comprobar Mi stock: solo sus productos y movimientos; sin formulario de escritura, precios o información de otros repartidores.
6. Si otro administrador cambió el saldo, se pedirá recargar antes de guardar. Un reintento idéntico no debe duplicar el movimiento.

Las pruebas usan datos ficticios en PostgreSQL aislado. La revisión visual y el circuito autenticado con Supabase real quedan pendientes de la aplicación manual de la migración.

## Seguridad e integridad

Permisos dedicados stock.manage para administración y stock.read para administración/reparto. Cobranzas no recibe permisos de stock por sí solo; si tiene además administración o reparto se aplica la combinación de permisos. Logística y Distribución Mayorista se retiran mediante la migración 008. Cada ruta y acción valida la sesión actual y el perfil activo.

RLS filtra cuentas y movimientos propios para reparto. No hay DML directo para la aplicación: una RPC transaccional actualiza saldo e inserta el movimiento con auth.uid() como responsable. Se serializa por cuenta y por clave de operación, verificando versión e idempotencia. Un fallo revierte todo el guardado. Los saldos no se calculan en el navegador.

Las funciones de lectura devuelven solo nombres, cantidades e historial autorizado; no amplían acceso a tablas de precios, clientes o perfiles de otros usuarios. El historial se pagina de a 25 movimientos. Los nombres del catálogo y del personal se muestran con sus valores actuales, conservando referencias por ID.

Cada movimiento registra entrada o corrección, cantidad ingresada, diferencia, saldo anterior y posterior, motivo, fecha y responsable. Los productos deshabilitados comercialmente pueden tener stock físico: no se exige precio para registrarlo. Solo repartidores activos con el rol vigente reciben entradas; administración puede corregir cuentas históricas existentes aunque el usuario haya sido desactivado o haya cambiado de rol.

El límite técnico por cantidad y saldo es 2.147.483.647 paquetes. Una corrección sin diferencia se rechaza. La migración no borra tablas anteriores ni modifica pedidos, cobros, usuarios o cobertura. WhatsApp sigue en pausa hasta recuperar el teléfono.

## Validación

Pruebas de entradas, correcciones a cero, motivo obligatorio, conservación de saldos, permisos y RLS, aislamiento entre repartidores, lectura sin precios, duplicados, versiones, saldo fuera de rango, cuentas históricas y paginación. Las pruebas en memoria verifican reintentos y versiones; la concurrencia real usa bloqueos de PostgreSQL y no se simuló con conexiones remotas simultáneas.
