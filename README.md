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

## Uso Crítico y Responsable de IA

Este proyecto lo arranqué sin saber prácticamente nada de Firebase, AWS ni cómo conectar un backend serverless con el frontend. Todo fue nuevo al mismo tiempo, y eso fue lo más difícil: no había un solo concepto complicado, sino que todo era complicado a la vez.

Mi forma de trabajar fue combinar las videoclases del bootcamp con asistencia de IA (Claude). Las clases me daban el contexto general — entender qué es el Context API, por qué existe el patrón de rutas protegidas, cómo funciona Firestore por debajo. La IA me ayudaba a implementarlo paso a paso en el proyecto real, sin saltearme la comprensión.

### Cómo usé la IA concretamente

- **De a un módulo por vez:** nunca pedí "haceme la app". Fui construyendo Auth primero, después Firestore, después SES, tests y deploy. Cada parte la entendí antes de avanzar a la siguiente.
- **Pedir que me explique mientras construye:** cuando no entendía por qué se usaba `onAuthStateChanged` con cleanup, o por qué las variables de Firebase llevan prefijo `VITE_`, paraba y preguntaba. No avancé con código que no podía leer.
- **Los errores los analicé yo primero:** cuando apareció `ERR_BLOCKED_BY_CLIENT` en el browser, o el índice de Firestore que faltaba, o el `TS2769` en vite.config — leí el mensaje, traté de entender qué decía, y después busqué solución. No copié y pegué a ciegas.
- **Las videoclases como base:** cada vez que la IA me explicaba algo, lo contrastaba con lo que había visto en clase. Si no me cerraba, volvía a ver el video. Eso me ayudó a entender la diferencia entre "código que funciona" y "código que entiendo".

### Decisiones que entiendo y puedo explicar

- **Context API + `useAuth`** en lugar de pasar props por toda la jerarquía: cualquier componente puede saber si hay usuario logueado sin que sus padres le pasen esa info manualmente.
- **`RequireAuth` como wrapper:** la lógica de "¿puede entrar acá?" vive en un solo lugar, no mezclada con cada página.
- **`tasks.ts` separado de la UI:** si mañana cambio Firestore por otra base de datos, las páginas no se tocan.
- **Vercel Function para el email:** las credenciales de AWS nunca tocan el frontend. El usuario no puede verlas aunque abra DevTools.
- **`.env` con dos tipos de variables:** las de Firebase con prefijo `VITE_` porque el browser las necesita, las de AWS sin prefijo porque solo las lee el servidor.

---

Proyecto integrador del Módulo 4 — Bootcamp Henry.
