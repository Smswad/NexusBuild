import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes/Routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './Context/AuthContext'
import { DatabaseProvider } from './Context/DatabaseContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DatabaseProvider>
        <RouterProvider router={router} />
      </DatabaseProvider>
    </AuthProvider>
  </StrictMode>,
)