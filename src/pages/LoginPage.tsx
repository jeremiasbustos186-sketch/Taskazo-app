import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/Authenticator'
import { getAuthErrorMessage } from '../lib/authErrors'

interface LocationState {
  from?: { pathname: string }
}

function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const destino = state?.from?.pathname ?? '/tasks'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate(destino, { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Panel izquierdo — branding */}
      <div className="auth-brand">
        <div className="auth-brand-logo">⚡ Taskazo</div>
        <h1>Tus tareas,<br /><span>bajo control.</span></h1>
        <p>Organizá tu día, completá lo que importa y mantené el foco sin distracciones.</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-form-side">
        <div className="auth-container">
          <h2>Iniciar sesión</h2>
          <p className="auth-tagline">Ingresá a tu cuenta para ver tus tareas.</p>

          <button onClick={handleGoogle} disabled={loading} className="btn-google">
            🔑 Continuar con Google
          </button>

          <div className="auth-divider">o con email</div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="auth-footer">
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
