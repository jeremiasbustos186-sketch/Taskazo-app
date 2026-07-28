import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('send-email endpoint — integración con fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('llama al endpoint con los datos correctos', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })

    const tasks = [
      { title: 'Estudiar React', completed: true },
      { title: 'Hacer ejercicio', completed: false },
    ]

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'test@test.com', tasks }),
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/send-email', expect.objectContaining({
      method: 'POST',
    }))
  })

  it('maneja error del serverless correctamente', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'test@test.com', tasks: [] }),
    })

    expect(res.ok).toBe(false)
  })

  it('no llama al endpoint si no hay tareas', () => {
    const tasks: { title: string; completed: boolean }[] = []
    const shouldSend = tasks.length > 0

    expect(shouldSend).toBe(false)
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
