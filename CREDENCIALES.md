# Credenciales y Configuración

## Usuarios Demo
| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@instituto.com | admin123 |
| Estudiante | estudiante@instituto.com | student123 |

## Backend — Variables de Entorno (`backend/.env`)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET=generar con: openssl rand -hex 32
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Puertos
| Servicio | Puerto | URL |
|---|---|---|
| Backend (Express) | 3000 | http://localhost:3000 |
| Frontend (Vite) | 5173 | http://localhost:5173 |

Vite proxy automático: `/api` → `localhost:3000`

## Seed Data
- **3 proyectos** de investigación
- **3 proyectos** software (con tech stack, GitHub, demo)
- **1 curso**: "Introducción a la Inteligencia Artificial"
  - 4 lecciones secuenciales
  - Quiz final de 5 preguntas (nota mínima 70%)
- **4 áreas** de investigación
- **4 miembros** del equipo
- **3 publicaciones**

## Archivos Upload
- Avatars de usuarios → `backend/uploads/`
- Acceso estático: `http://localhost:3000/uploads/`
- Límite: 2 MB por archivo

## Rutas Admin
| Ruta | Descripción |
|---|---|
| `/admin/login` | Login admin |
| `/admin/dashboard` | Dashboard |
| `/admin/projects` | CRUD proyectos (research + software) |
| `/admin/courses` | CRUD cursos |
| `/admin/courses/:id/lessons` | CRUD lecciones |
| `/admin/courses/:id/quiz` | Editor de quiz |
| `/admin/enrollments` | Inscripciones |
| `/admin/certificates` | Certificados emitidos |
| `/admin/messages` | Bandeja de mensajes contacto |
| `/admin/areas` | Áreas de investigación |
| `/admin/team` | Miembros del equipo |
| `/admin/publications` | Publicaciones |
| `/admin/about` | Sección Nosotros |

## Verificación de Certificados
Pública en: `http://localhost:5173/verificar` (ingresar código UUID)

## Producción
- Generar `JWT_SECRET` fuerte
- Activar `NODE_ENV=production` (oculta stack traces)
- Configurar SMTP real para formulario de contacto
- Considerar HTTPS reverse proxy (nginx/Caddy)
- Opcional: migrar de localStorage a httpOnly cookies para JWT
