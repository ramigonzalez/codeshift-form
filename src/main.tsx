import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>,
)
