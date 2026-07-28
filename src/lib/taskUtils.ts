import type { Task } from '../types'

/** Verifica que un título de tarea no esté vacío */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0
}

/** Filtra tareas por estado completado/pendiente */
export function filterByStatus(tasks: Task[], completed: boolean): Task[] {
  return tasks.filter(t => t.completed === completed)
}

/** Cuenta las tareas completadas */
export function countCompleted(tasks: Task[]): number {
  return tasks.filter(t => t.completed).length
}

/** Aplica un nuevo título a una tarea (lógica pura, sin Firestore) */
export function applyTitleUpdate(task: Task, newTitle: string): Task {
  return { ...task, title: newTitle.trim() }
}
