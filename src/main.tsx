import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Authenticator } from './lib/Authenticator'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Authenticator envuelve todo para que useAuth() funcione en cualquier componente */}
      <Authenticator>
        <App />
      </Authenticator>
    </BrowserRouter>
  </StrictMode>,
)
