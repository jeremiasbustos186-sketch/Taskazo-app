import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task } from '../types'

const COLLECTION = 'tasks'

// Escuchar tareas en tiempo real con onSnapshot
// Devuelve una función unsubscribe para limpiar el listener
export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (err: unknown) => void
): () => void {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const unsubscribe = onSnapshot(
    q,
    snapshot => {
      const tasks = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Task, 'id'>),
      }))
      onData(tasks)
    },
    onError
  )
  return unsubscribe
}

// Crear una tarea nueva
export async function addTask(title: string, userId: string): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    title,
    completed: false,
    userId,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// Marcar como completada / pendiente
export async function toggleTask(taskId: string, completed: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, taskId), { completed })
}

// Eliminar una tarea
export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, taskId))
}
