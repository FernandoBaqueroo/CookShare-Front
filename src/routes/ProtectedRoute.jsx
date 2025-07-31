import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AnimatedContent from '../components/Animations/AnimatedContent'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Solo mostrar loading si no hay token en localStorage (primera carga)
  const hasToken = localStorage.getItem('token')
  
  // Mostrar loading solo si no hay token y está cargando
  if (isLoading && !hasToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="bounce.out"
          initialOpacity={0.3}
          scale={0.8}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pavlova-200/50">
            <div className="spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-pavlova-600 text-center animate-pulse-slow">Verificando autenticación...</p>
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-pavlova-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pavlova-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-pavlova-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    )
  }

  // Si no está autenticado, redirigir al home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Si está autenticado, mostrar el contenido protegido
  return children
}

export default ProtectedRoute 