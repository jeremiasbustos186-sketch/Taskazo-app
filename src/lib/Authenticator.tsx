import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, UserCredential } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from './firebase'

// ─── 1. QUÉ COSAS EXPONE EL AUTHENTICATOR ────────────────────────────────────
// Es como el "menú" del portero: qué podés pedirle
interface AuthContextValue {
  user: User | null       // el usuario actual (null = no logueado)
  loading: boolean        // true mientras Firebase verifica la sesión al recargar
  signUp: (email: string, password: string) => Promise<UserCredential>
  signIn: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
}

// ─── 2. CREAR EL CONTEXTO ────────────────────────────────────────────────────
// El contexto es como el sistema de intercomunicación del edificio
const AuthContext = createContext<AuthContextValue | null>(null)

// ─── 3. EL AUTHENTICATOR (PROVIDER) ─────────────────────────────────────────
// Envuelve toda la app y comparte el estado de sesión con todos los componentes
export function Authenticator({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // empieza en true: aún no sabemos si hay sesión

  useEffect(() => {
    // onAuthStateChanged escucha cambios de sesión automáticamente:
    // login → user = objeto con datos del usuario
    // logout → user = null
    // recarga de página → Firebase restaura la sesión y avisa acá
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false) // ya sabemos el estado, dejamos de "cargar"
    })

    // Cleanup: cuando el componente se desmonta, dejamos de escuchar (L5)
    return () => unsubscribe()
  }, [])

  // Las funciones que exponemos a toda la app
  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const signInWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider())

  const logout = () => signOut(auth)

  const value: AuthContextValue = { user, loading, signUp, signIn, signInWithGoogle, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── 4. EL HOOK useAuth ──────────────────────────────────────────────────────
// Cualquier componente llama useAuth() y accede al usuario y las funciones
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <Authenticator>')
  }
  return context
}
