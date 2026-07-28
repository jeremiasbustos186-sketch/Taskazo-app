import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from '../lib/authErrors'

describe('getAuthErrorMessage', () => {
  it('retorna mensaje en español para credenciales inválidas', () => {
    const msg = getAuthErrorMessage({ code: 'auth/invalid-credential' })
    expect(msg).toBe('Email o contraseña incorrectos.')
  })

  it('retorna mensaje en español para email ya registrado', () => {
    const msg = getAuthErrorMessage({ code: 'auth/email-already-in-use' })
    expect(msg).toBe('Ese email ya está registrado.')
  })

  it('retorna mensaje genérico para errores desconocidos', () => {
    const msg = getAuthErrorMessage({ code: 'auth/unknown-error-xyz' })
    expect(msg).toBe('Error de autenticación. Intentá de nuevo.')
  })
})
