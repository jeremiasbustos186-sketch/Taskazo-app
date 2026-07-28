import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Lee las credenciales del archivo .env (nunca se hardcodean acá)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Inicializa Firebase una sola vez
const app = initializeApp(firebaseConfig)

// Exportamos auth (para login/registro) y db (para guardar tareas)
export const auth = getAuth(app)
export const db = getFirestore(app)
