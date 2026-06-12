# Aula Virtual — Contexto del Proyecto

## Stack
- **Frontend:** Vue 3 (Composition API + `<script setup>`) + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express + TypeScript + Prisma ORM (SQLite)
- **Auth:** JWT (bcrypt) — rol en payload (`userId`, `role`), almacenado en localStorage, expira en 7 días
- **Email:** Nodemailer (SMTP) — formulario de contacto
- **PDF:** pdfmake (client-side) — certificados

## Comandos

| Contexto | Comando | Acción |
|---|---|---|
| root | `npm run dev` | Backend + frontend simultáneo (concurrently) |
| root | `npm run build` | `tsc` backend + `vue-tsc -b && vite build` frontend |
| `backend/` | `npm run dev` | `tsx watch src/server.ts` |
| `backend/` | `npm run db:seed` | `tsx prisma/seed.ts` (re-seed) |
| `backend/` | `npm run db:push` | `prisma db push` (schema sync sin migración) |
| `frontend/` | `npm run dev` | `vite` (puerto 5173) |
| `frontend/` | `npm run build` | `vue-tsc -b && vite build` (type-check + bundle) |

No existe ninguna configuración de tests, linter, ni formateador. No ejecutar `npm test`, `eslint`, `prettier`, etc.

## Estructura relevante

- **Backend CommonJS** (`module: "commonjs"` en tsconfig), **frontend ESM** (`"type": "module"`)
- Frontend usa path alias `@/` → `./src/*` (tsconfig paths + Vite resolve)
- Base de datos: SQLite local en `backend/prisma/dev.db`. `DATABASE_URL` en `backend/.env`
- Backend expone API REST en `src/routes/` con middleware: `auth.ts` (JWT verify), `roles.ts` (admin/student guard), `validate.ts` (express-validator), `upload.ts` (multer → `backend/uploads/`)
- No hay `.gitignore` — evitar committear `dev.db`, `dist/`, `node_modules/`, `.env`
- `CREDENCIALES.md` contiene credenciales de demo (admin, estudiante)
- Auth: ruta `POST /api/auth/login` devuelve JWT (24h); frontend lo guarda en localStorage y lo envía como `Authorization: Bearer <token>`
- Admin panel en `/admin` con CRUD por recurso en `src/views/admin/`
