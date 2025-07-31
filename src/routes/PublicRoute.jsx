import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Si está cargando, mostrar nada (el App.jsx maneja el loading)
  if (isLoading) {
    return null
  }

  // Si está autenticado, redirigir al feed
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  // Si no está autenticado, mostrar el contenido público
  return children
}

export default PublicRoute 