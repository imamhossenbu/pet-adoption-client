import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/router'
import AuthProvider from './Provider/AuthProvider'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: 'green',
              color:'white'
            },
          },
          error: {
            style: {
              background: 'red',
              color:'white'
            },
          },
        }}
      />
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
