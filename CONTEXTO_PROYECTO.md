# Contexto del proyecto Lostordos

## Visión

- **Web pública**: Página estática de quesos artesanales (ya existe).
- **Admin del tambo**: Panel para administrar el rodeo, gestionar partos, preñeces, etc.
- Todo en el mismo proyecto Next.js, con rutas separadas (`/` público, `/admin` privado).

## Principios

- **No sobreingenierizar**: Mantener la app simple, solo lo necesario.
- **Buenas prácticas**: Seguir patrones razonables y sostenibles.

## Flujo de trabajo acordado

Antes de ejecutar cambios:

1. **Primera confirmación**: Preguntar si estás de acuerdo con la propuesta o el plan.
2. **Segunda confirmación**: Preguntar si deseás que ejecute (código, archivos, etc.).
3. Solo después de ambas confirmaciones → ejecutar.

---

## Modelo de datos

**Stack**: Prisma + Supabase (Postgres). Migraciones para historial de cambios en la DB.

### Animal
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| caravana | string (unique) | 4 dígitos oficiales |
| tipo | enum | `vaca` \| `toro` \| `vaquillona` |
| categoria | enum (nullable) | Solo vacas: `en_ordeñe` \| `seca` |
| estado | enum | `activo` \| `vendido` \| `muerto` |
| fecha_nacimiento | date (nullable) | |
| created_at | timestamp | |
| updated_at | timestamp | |

### Servicio (monta)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| animal_id | uuid | FK → Animal (vaca/vaquillona) |
| toro_id | uuid | FK → Animal (toro) |
| fecha | date | |
| observaciones | text (nullable) | |
| created_at | timestamp | |

### Tacto (diagnóstico de preñez)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| animal_id | uuid | FK → Animal |
| servicio_id | uuid (nullable) | FK → Servicio |
| fecha | date | |
| resultado | enum | `prenada` \| `vacia` |
| fecha_estimada_parto | date (nullable) | Si resultado = prenada |
| observaciones | text (nullable) | |
| created_at | timestamp | |

### Parto
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| animal_id | uuid | FK → Animal (madre) |
| fecha | date | |
| observaciones | text (nullable) | |
| created_at | timestamp | |

### PeriodoToro
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| toro_id | uuid | FK → Animal |
| fecha_inicio | date | |
| fecha_fin | date (nullable) | null = aún en rodeo |
| observaciones | text (nullable) | |
| created_at | timestamp | |

### Secado
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| animal_id | uuid | FK → Animal (vaca) |
| fecha | date | Día que deja de ordeñar |
| observaciones | text (nullable) | |
| created_at | timestamp | |

Al registrar: actualizar animal a categoria `seca`.

### Aborto
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| animal_id | uuid | FK → Animal (vaca/vaquillona) |
| fecha | date | |
| observaciones | text (nullable) | |
| created_at | timestamp | |

No cambia tipo ni categoría. Solo registra que perdió la preñez (queda vacía). Botón siempre visible para hembras (a veces los tactos faltan o se equivocan).

### Relaciones
- Animal 1───* Servicio (vaca/vaquillona), Servicio (toro), Tacto, Parto, PeriodoToro, Secado, Aborto
- Servicio 1───* Tacto (opcional, vía servicio_id)

### Alarmas (futuro)
- Vacas a secar (por fecha planificada)
- Fechas probables de parto
- Vacas que repiten más de X servicios sin preñez

### Notas
- Vaquillona que pare → actualizar a tipo `vaca`, categoria `en_ordeñe`.
- Planillas activas: filtrar por `estado = 'activo'`.
- Sexo de la cría en Parto: fuera de alcance por ahora.

### Usuario (auth)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| nombre | string (unique) | Ej: Chacho, Nacho, Lucas |
| password_hash | string | bcrypt |
| rol | enum | `admin` \| `operador` |
| created_at | timestamp | |
| updated_at | timestamp | |

### Roles y permisos

| Rol | Permisos |
|-----|----------|
| **admin** | Todo: CRUD animales, servicios, tactos, partos, periodos toro, usuarios. |
| **operador** | Ver todo. Registrar servicios, tactos, partos, secados, abortos. No crear/editar/borrar animales. No periodos toro. No gestionar usuarios. |

**Usuario operador (Lucas):** UI simplificada, menos opciones, interfaz más directa para no abrumar.

**Servicio:** No se selecciona toro. El toro se obtiene del PeriodoToro activo en la fecha del servicio (solo hay un toro por lote en cada momento).

---

## Historial de decisiones y contexto

*(Se irá actualizando con decisiones, acuerdos y notas relevantes.)*

### 2025-03-05
- Acuerdo del flujo de doble confirmación antes de ejecutar.
- Definición de principios: simplicidad, buenas prácticas.
- Modelo de datos definido: Animal, Servicio, Tacto, Parto, PeriodoToro. Stack: Prisma + Supabase.
- Prisma 5 + schema + migración inicial configurados. Cliente singleton en `src/lib/prisma.js`.
- Auth: usuarios en Prisma (nombre + password_hash). Roles: admin (Chacho, Nacho), operador (Lucas). UI simplificada para operador.
- Auth implementado: bcryptjs + jose (JWT en cookie), API login/logout/me, middleware protege /admin, página /admin/login. Seed: `npm run db:seed` crea Chacho, Nacho, Lucas con contraseña "tambo2025".
- Secado: modelo + migración + botón + formulario. Operador registra día que vaca deja de ordeñar. Alarmas (futuro): vacas a secar, fechas probables parto, vacas que repiten servicios.
