# Aula Virtual — Contexto del Proyecto

## Stack
- **Frontend:** Vue 3 (Composition API + `<script setup>`) + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express + TypeScript + Prisma ORM + SQLite
- **Email:** Nodemailer (SMTP) para formulario de contacto
- **PDF:** pdfmake (generación client-side de certificados)
- **Auth:** JWT + bcrypt, rol en payload (`userId`, `role`)

## Estructura del proyecto
```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # 15 modelos (User → Discussion)
│   │   └── seed.ts          # Datos demo (admin, estudiante, curso, etc.)
│   ├── src/
│   │   ├── routes/          # API REST organizada por recurso
│   │   ├── middleware/       # auth.ts (JWT), roles.ts (admin/student), validate.ts
│   │   ├── lib/prisma.ts    # Instancia singleton de PrismaClient
│   │   └── server.ts        # Express app, helmet, rate-limit, mount de rutas
│   └── uploads/             # Avatars subidos por multer
├── frontend/
│   ├── src/
│   │   ├── components/      # layout/, sections/, ui/, aula/
│   │   ├── views/           # Landing, admin/, aula/, auth/, public/
│   │   ├── services/api.ts  # Axios instance + decodeToken + API wrappers
│   │   ├── stores/auth.ts   # Pinia store de autenticación
│   │   ├── router/index.ts  # Rutas con guards requiresAdmin/requiresStudent
│   │   └── types/index.ts   # Interfaces TypeScript
│   └── public/
```

## Modelo Project
```
type: "research" | "software"
techStack: string (JSON array, ej. '["Vue","Node"]')
githubUrl: string?
liveUrl: string?
```
Los proyectos de software se muestran en `SoftwareSection.vue` (sección "Software Científico") con badges de tecnologías y enlaces a GitHub/Demo.

## Rutas relevantes
| Ruta | Descripción |
|---|---|
| `GET /api/projects` | Todos los proyectos |
| `GET /api/projects/software` | Solo tipo "software" |
| `POST/PUT /api/projects` | CRUD admin (autenticado) |
| `GET /api/auth/profile` | Perfil del usuario autenticado |
| `GET /api/courses` | Catálogo público de cursos |
| `GET /api/certificates/verify/:code` | Verificación pública de certificado |

## Admin panel (`/admin`)
- Sidebar con: Dashboard, Cursos, Lecciones, Quiz, Proyectos (research/software), Áreas, Equipo, Publicaciones, Inscripciones, Certificados, Mensajes
- CRUD de Proyectos soporta selector de tipo y campos condicionales (techStack, githubUrl, liveUrl)

## Comandos
```bash
cd backend && npx tsx watch src/server.ts     # Backend dev
cd frontend && npm run dev                     # Frontend dev
cd backend && npx tsx prisma/seed.ts           # Re-seed DB
```

## Convenciones
- Importaciones absolutas desde `src/` en frontend
- Estilos con Tailwind utility classes, sin CSS modules
- Errores del backend no exponen stack trace en producción
- Ayuda de rutas con express-validator en auth y contact
