# Los Tordos

Web de quesos artesanales con panel admin para gestión del tambo (animales, servicios, partos, tactos, secados, abortos).

Stack: Next.js 13, Prisma, Supabase (PostgreSQL), Tailwind.

---

## Desarrollo local

```bash
npm install
cp .env.example .env   # editar con tus credenciales
npm run db:migrate     # aplicar migraciones
npm run db:seed        # crear usuarios (Chacho, Nacho, Lucas - pass: tambo2025)
npm run dev
```

---

## Deploy en Vercel

### 1. Conectar el repo

- Importar proyecto en [Vercel](https://vercel.com) desde GitHub
- Framework: Next.js (detección automática)

### 2. Variables de entorno

En **Vercel → Project → Settings → Environment Variables**, configurar:

| Variable         | Descripción | Notas |
|------------------|-------------|-------|
| `DATABASE_URL`   | URL de conexión a PostgreSQL | Ver sección Supabase más abajo |
| `AUTH_SECRET` | Secreto para Auth.js (JWT) | Mínimo 32 caracteres, aleatorio |

### 3. Supabase (base de datos)

**Importante:** En serverless (Vercel) usar la URL del **Connection Pooler**, no la conexión directa.

1. Supabase → **Project Settings** (engranaje) → **Database**
2. Ir a **Connect** / **Connection string**
3. Método: **Transaction pooler** (o **Session pooler**)
4. Copiar la URL (puerto **6543**, host `*.pooler.supabase.com`)
5. Sustituir `[YOUR-PASSWORD]` por la contraseña de la base de datos
6. Agregar al final: `?pgbouncer=true` (requerido para Prisma con pooler)

Ejemplo:

```
postgresql://postgres.XXXXX:PASSWORD@aws-0-XX.pooler.supabase.com:6543/postgres?pgbouncer=true
```

La conexión directa (puerto 5432) no funciona desde Vercel por restricciones IPv4.

### 4. Build

El script `prisma generate && next build` está configurado en `package.json`. Vercel lo ejecutará automáticamente.

### 5. Migraciones

Si hay migraciones pendientes, ejecutarlas después del primer deploy:

```bash
DATABASE_URL="tu_url_pooler" npm run db:migrate:deploy
```

O desde un script / CI una vez configurada la variable.

---

## Notas técnicas

- **Node.js:** El proyecto usa `engines.node >= 22`. Vercel puede usar 24.x según configuración.
- **Auth:** Auth.js (NextAuth) con Credentials provider (nombre + contraseña, sin email).

---

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción |
| `npm run db:seed` | Crear usuarios iniciales |
| `npm run db:studio` | Abrir Prisma Studio |
