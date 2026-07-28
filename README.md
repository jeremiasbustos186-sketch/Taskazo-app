# ⚡ Taskazo

Gestor estratégico de tareas. Organizá tu día, completá lo que importa y mantené el foco sin distracciones.

🌐 **Demo en vivo:** [taskazo-app-red.vercel.app](https://taskazo-app-red.vercel.app)

## Tecnologías

- **React + TypeScript** con Vite
- **Firebase Auth** — autenticación con email/contraseña y Google
- **Cloud Firestore** — base de datos en tiempo real para las tareas
- **AWS SES** — envío de resumen de tareas por email vía Vercel Functions
- **Vitest + React Testing Library** — tests unitarios
- **Vercel** — deploy y serverless functions

## Funcionalidades

- Registro e inicio de sesión (email/contraseña y Google)
- Rutas protegidas con redirección automática
- CRUD completo de tareas (crear, completar, eliminar)
- Progreso visual con barra y estadísticas
- Envío de resumen por email con AWS SES
- 10 tests unitarios pasando

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/jeremiasbustos186-sketch/Taskazo-app.git
cd Taskazo-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Completar con tus credenciales de Firebase y AWS

# Correr en desarrollo
npm run dev

# Correr tests
npm test
```

## Variables de entorno

Crear un archivo `.env` con las siguientes variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_SES_FROM=
```

## Estructura del proyecto

```
src/
├── components/     # RequireAuth
├── lib/            # Firebase, Authenticator, tasks, utilidades
├── pages/          # LoginPage, RegisterPage, TasksPage
├── test/           # Tests unitarios
└── types/          # Tipos TypeScript
api/
└── send-email.ts   # Vercel Function con AWS SES
```

---

Proyecto integrador del Módulo 4 — Bootcamp Henry.
