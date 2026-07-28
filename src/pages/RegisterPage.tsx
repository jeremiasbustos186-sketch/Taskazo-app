import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/Authenticator'
import { getAuthErrorMessage } from '../lib/authErrors'

function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/tasks', { replace: true })
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
        <h1>Empezá a<br /><span>taскazear.</span></h1>
        <p>Creá tu cuenta gratis y empezá a organizar tus tareas en segundos.</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-form-side">
        <div className="auth-container">
          <h2>Crear cuenta</h2>
          <p className="auth-tagline">Completá los datos para registrarte.</p>

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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirm">Confirmar contraseña</label>
              <input
                id="confirm"
                type="password"
                placeholder="Repetí tu contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="auth-footer">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
