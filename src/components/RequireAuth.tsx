import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../lib/Authenticator'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Firebase todavía verifica la sesión → no redirigir todavía
  if (loading) return <p>Cargando...</p>

  // No hay usuario → redirigir a /login y guardar la ruta original
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Hay usuario → mostrar la página protegida
  return <>{children}</>
}

export default RequireAuth
