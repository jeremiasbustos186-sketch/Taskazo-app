// Traduce los códigos de error de Firebase a mensajes en español
const errorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con este email.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ese email ya está registrado.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Probá más tarde.',
}

export function getAuthErrorMessage(error: unknown): string {
  const err = error as { code?: string }
  return errorMessages[err.code ?? ''] ?? 'Error de autenticación. Intentá de nuevo.'
}
