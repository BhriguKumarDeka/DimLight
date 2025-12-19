import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'z-[9999]',
        style: {
          background: 'rgba(10, 11, 12, 0.95)',
          color: 'rgb(255, 255, 255)',
          border: '1px solid rgba(100, 200, 235, 0.5)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(100, 200, 235, 0.3)',
          backdropFilter: 'blur(10px)',
          padding: '16px 20px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: 'white' },
          style: { borderColor: 'rgba(16, 185, 129, 0.5)' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: 'white' },
          style: { borderColor: 'rgba(239, 68, 68, 0.5)' },
        },
        loading: {
          style: { borderColor: 'rgba(100, 200, 235, 0.5)' },
        },
      }}
    />
  </StrictMode>,
)
