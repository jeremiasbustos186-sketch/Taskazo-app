// ─── TAREA ───────────────────────────────────────────────────────────────────
// Así luce una tarea guardada en Firestore
export interface Task {
  id: string           // ID único que genera Firestore automáticamente
  title: string        // Texto de la tarea
  completed: boolean   // ¿Está hecha o pendiente?
  userId: string       // ID del usuario dueño (viene de Firebase Auth)
  createdAt: unknown   // Timestamp de Firestore (para ordenar por fecha)
}

// Lo que el usuario escribe para CREAR una tarea (sin id ni userId, esos los pone el código)
export type NewTask = Pick<Task, 'title'>

// ─── FORMULARIOS ─────────────────────────────────────────────────────────────
export interface LoginFormState {
  email: string
  password: string
}

export interface RegisterFormState {
  email: string
  password: string
  confirmPassword: string
}

// Errores de validación: pueden existir o no para cada campo
export type FieldErrors<T> = Partial<Record<keyof T, string>>
