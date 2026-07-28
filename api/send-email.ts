import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, tasks } = req.body as { to: string; tasks: { title: string; completed: boolean }[] }

  if (!to || !tasks) {
    return res.status(400).json({ error: 'Faltan parámetros: to y tasks son requeridos' })
  }

  const completed = tasks.filter(t => t.completed)
  const pending = tasks.filter(t => !t.completed)

  const html = `
    <h2>📋 Resumen de tus tareas</h2>
    <h3>✅ Completadas (${completed.length})</h3>
    <ul>${completed.map(t => `<li>${t.title}</li>`).join('') || '<li>Ninguna</li>'}</ul>
    <h3>⏳ Pendientes (${pending.length})</h3>
    <ul>${pending.map(t => `<li>${t.title}</li>`).join('') || '<li>Ninguna</li>'}</ul>
  `

  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: '📋 Resumen de tus tareas', Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } },
    },
  })

  try {
    await ses.send(command)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('SES error:', error)
    return res.status(500).json({ error: 'No se pudo enviar el email' })
  }
}
