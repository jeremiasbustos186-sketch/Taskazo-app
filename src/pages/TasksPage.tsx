import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../lib/Authenticator'
import { subscribeToTasks, addTask, toggleTask, deleteTask } from '../lib/tasks'
import type { Task } from '../types'

function TasksPage() {
  const { user, logout } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [tasksError, setTasksError] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')

  const completed = tasks.filter(t => t.completed)
  const pending = tasks.filter(t => !t.completed)
  const progress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0

  useEffect(() => {
    if (!user) return
    setLoadingTasks(true)
    setTasksError('')

    // onSnapshot devuelve una función unsubscribe — la usamos como cleanup del useEffect
    const unsubscribe = subscribeToTasks(
      user.uid,
      (data) => {
        setTasks(data)
        setLoadingTasks(false)
      },
      (error) => {
        console.error('Error al cargar tareas:', error)
        setTasksError('No se pudieron cargar las tareas.')
        setLoadingTasks(false)
      }
    )

    return unsubscribe // cleanup: desuscribe el listener cuando el componente se desmonta
  }, [user])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      await addTask(newTitle.trim(), user!.uid)
      setNewTitle('') // onSnapshot actualiza la lista automáticamente
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(task: Task) {
    await toggleTask(task.id, !task.completed)
    // onSnapshot actualiza la UI automáticamente
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId)
    // onSnapshot actualiza la UI automáticamente
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
    <div>
      <nav className="tasks-navbar">
        <span className="tasks-navbar-logo">⚡ Taskazo</span>
        <button onClick={() => logout()} className="btn-logout">Cerrar sesión</button>
      </nav>

      <div className="tasks-container">
        <h1>Mis Tareas</h1>
        <p className="tasks-subtitle">Organizá tu día, un task a la vez.</p>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="tasks-stats">
            <div className="stat-item">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-pending">{pending.length}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-done">{completed.length}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">{progress}% completado</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleAdd} className="task-form">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="¿Qué tenés que hacer hoy?"
            disabled={adding}
          />
          <button type="submit" disabled={adding || !newTitle.trim()}>
            {adding ? '...' : '+ Agregar'}
          </button>
        </form>

        {loadingTasks && <p className="tasks-loading">Cargando tareas...</p>}
        {tasksError && <p className="error-msg">{tasksError}</p>}

        {!loadingTasks && tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No tenés tareas todavía.</p>
            <p className="empty-sub">¡Agregá una para empezar!</p>
          </div>
        )}

        {/* Pendientes */}
        {pending.length > 0 && (
          <>
            <p className="section-label">Pendientes</p>
            <ul className="task-list">
              {pending.map(task => (
                <li key={task.id} className="task-item">
                  <input type="checkbox" checked={false} onChange={() => handleToggle(task)} />
                  <span>{task.title}</span>
                  <button onClick={() => handleDelete(task.id)}>🗑</button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Completadas */}
        {completed.length > 0 && (
          <>
            <p className="section-label section-label--done">Completadas</p>
            <ul className="task-list">
              {completed.map(task => (
                <li key={task.id} className="task-item task-item--done">
                  <input type="checkbox" checked={true} onChange={() => handleToggle(task)} />
                  <span className="done">{task.title}</span>
                  <button onClick={() => handleDelete(task.id)}>🗑</button>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          className="email-btn"
          onClick={handleSendEmail}
          disabled={sendingEmail || tasks.length === 0}
        >
          {sendingEmail ? 'Enviando...' : '📧 Enviar resumen por email'}
        </button>
        {emailMsg && <p className={emailMsg.startsWith('✅') ? 'success-msg' : 'error-msg'}>{emailMsg}</p>}
      </div>
    </div>
  )
}

export default TasksPage
