import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../lib/Authenticator'
import { getTasks, addTask, toggleTask, deleteTask } from '../lib/tasks'
import type { Task } from '../types'

function TasksPage() {
  const { user, logout } = useAuth()

  // Estado de la lista de tareas
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [tasksError, setTasksError] = useState('')

  // Estado del formulario para agregar tarea
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  // Estado del botón de email
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')

  // Cargar tareas al montar el componente (useEffect con [])
  useEffect(() => {
    if (!user) return
    fetchTasks()
  }, [user])

  async function fetchTasks() {
    setLoadingTasks(true)
    setTasksError('')
    try {
      const data = await getTasks(user!.uid)
      setTasks(data)
    } catch (error) {
      console.error('Error al cargar tareas:', error)
      setTasksError('No se pudieron cargar las tareas.')
    } finally {
      setLoadingTasks(false)
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      await addTask(newTitle.trim(), user!.uid)
      setNewTitle('')
      await fetchTasks() // recarga la lista
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(task: Task) {
    await toggleTask(task.id, !task.completed)
    setTasks(prev =>
      prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
    )
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  async function handleLogout() {
    await logout()
  }

  async function handleSendEmail() {
    if (!user?.email) return
    setSendingEmail(true)
    setEmailMsg('')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: user.email, tasks }),
      })
      if (!res.ok) throw new Error()
      setEmailMsg('✅ Email enviado a ' + user.email)
    } catch {
      setEmailMsg('❌ No se pudo enviar el email')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Mis Tareas</h1>
        <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
      </div>

      {/* Formulario para agregar tarea */}
      <form onSubmit={handleAdd} className="task-form">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Nueva tarea..."
          disabled={adding}
        />
        <button type="submit" disabled={adding || !newTitle.trim()}>
          {adding ? '...' : 'Agregar'}
        </button>
      </form>

      {/* Lista de tareas */}
      {loadingTasks && <p>Cargando tareas...</p>}
      {tasksError && <p className="error-msg">{tasksError}</p>}

      {!loadingTasks && tasks.length === 0 && (
        <p>No tenés tareas todavía. ¡Agregá una!</p>
      )}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task)}
            />
            <span className={task.completed ? 'done' : ''}>
              {task.title}
            </span>
            <button onClick={() => handleDelete(task.id)}>🗑</button>
          </li>
        ))}
      </ul>

      <button
        className="email-btn"
        onClick={handleSendEmail}
        disabled={sendingEmail || tasks.length === 0}
      >
        {sendingEmail ? 'Enviando...' : '📧 Enviar resumen por email'}
      </button>
      {emailMsg && <p className={emailMsg.startsWith('✅') ? 'success-msg' : 'error-msg'}>{emailMsg}</p>}
    </div>
  )
}

export default TasksPage
