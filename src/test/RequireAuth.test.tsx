import { describe, it, expect } from 'vitest'
import { isValidTitle, filterByStatus, countCompleted } from '../lib/taskUtils'
import type { Task } from '../types'

const mockTasks: Task[] = [
  { id: '1', title: 'Comprar leche', completed: true, userId: 'u1', createdAt: null },
  { id: '2', title: 'Estudiar React', completed: false, userId: 'u1', createdAt: null },
  { id: '3', title: 'Hacer ejercicio', completed: true, userId: 'u1', createdAt: null },
]

describe('isValidTitle', () => {
  it('retorna true para un título con texto', () => {
    expect(isValidTitle('Mi tarea')).toBe(true)
  })

  it('retorna false para un string vacío', () => {
    expect(isValidTitle('')).toBe(false)
  })

  it('retorna false para un string con solo espacios', () => {
    expect(isValidTitle('   ')).toBe(false)
  })
})

describe('filterByStatus', () => {
  it('filtra solo las tareas completadas', () => {
    const result = filterByStatus(mockTasks, true)
    expect(result).toHaveLength(2)
    expect(result.every(t => t.completed)).toBe(true)
  })

  it('filtra solo las tareas pendientes', () => {
    const result = filterByStatus(mockTasks, false)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Estudiar React')
  })
})

describe('countCompleted', () => {
  it('cuenta correctamente las tareas completadas', () => {
    expect(countCompleted(mockTasks)).toBe(2)
  })

  it('retorna 0 si no hay tareas completadas', () => {
    const pending = mockTasks.map(t => ({ ...t, completed: false }))
    expect(countCompleted(pending)).toBe(0)
  })
})

describe('isValidTitle — casos borde', () => {
  it('retorna false para título con solo tabs', () => {
    expect(isValidTitle('\t\t')).toBe(false)
  })

  it('retorna true para título con un solo caracter', () => {
    expect(isValidTitle('x')).toBe(true)
  })
})

describe('filterByStatus — lista vacía', () => {
  it('retorna array vacío si no hay tareas', () => {
    expect(filterByStatus([], true)).toHaveLength(0)
    expect(filterByStatus([], false)).toHaveLength(0)
  })
})
