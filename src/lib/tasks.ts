import {
  collection,
  addDoc,
  getDocs,
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

// Traer todas las tareas del usuario
export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Task, 'id'>),
  }))
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
