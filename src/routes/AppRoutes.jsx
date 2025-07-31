import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AnimatedContent from '../components/Animations/AnimatedContent'

// Páginas
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Feed from '../pages/Feed'
import Profile from '../pages/Profile'
import UserProfileEdit from '../pages/UserProfileEdit'
import Favoritos from '../pages/Favoritos'
import CrearReceta from '../pages/CrearReceta'
import UserProfile from '../pages/UserProfile'
import NotFound from '../pages/NotFound'

// Componentes de rutas
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  // Pantalla de carga
  if (isLoading) {
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
            <p className="text-pavlova-600 text-center animate-pulse-slow">Cargando CookShare...</p>
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

  return (
    <Routes>
      {/* Rutas públicas - redirigen al feed si están autenticados */}
      <Route path="/" element={
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Rutas protegidas - SOLO se renderizan si está autenticado */}
      {isAuthenticated && (
        <>
          <Route path="/feed" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <Feed />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <Profile />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/editar-perfil" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <UserProfileEdit />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/crear" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <CrearReceta />
              </div>
            </ProtectedRoute>
          } />
                    <Route path="/favoritos" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <Favoritos />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/perfil/:nombreUsuario" element={
            <ProtectedRoute>
              <div className="lg:ml-64 pb-20 lg:pb-0">
                <UserProfile />
              </div>
            </ProtectedRoute>
          } />
        </>
      )}
      
      {/* Ruta catch-all para páginas no encontradas - solo mostrar si no está cargando */}
      <Route path="*" element={!isLoading ? <NotFound /> : null} />
    </Routes>
  )
}

export default AppRoutes 