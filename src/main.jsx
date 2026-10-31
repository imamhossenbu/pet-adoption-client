import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/router'
import AuthProvider from './Provider/AuthProvider'
import { FavoritesProvider } from './context/FavoritesContext'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <Toaster
            toastOptions={{
              success: {
                style: {
                  background: 'green',
                  color: 'white'
                },
              },
              error: {
                style: {
                  background: 'red',
                  color: 'white'
                },
              },
            }}
          />
          <RouterProvider router={router}></RouterProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
