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
      reverseOrder={false}
      containerClassName="z-[9999]"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgb(var(--surface))',
          color: 'rgb(var(--text))',
          borderRadius: '4px',
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '300',
        },

        success: {
          iconTheme: {
            primary: 'rgb(var(--success))',
            secondary: 'rgb(var(--surface))',
          },
          style: {
            borderBottom: '0.8px solid rgb(var(--success))',
          },
        },

        error: {
          iconTheme: {
            primary: 'rgb(var(--error))',
            secondary: 'rgb(var(--surface))',
          },
          style: {
            borderBottom: '0.8px solid rgb(var(--error))',
          },
        },

        loading: {
          iconTheme: {
            primary: 'rgb(var(--primary))',
            secondary: 'rgb(var(--surface))',
          },
          style: {
            borderBottom: '0.8px solid rgb(var(--primary))',
          },
        },
      }}

    />
  </StrictMode>,
)
