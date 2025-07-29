import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import { useEffect } from 'react'
import HomePage from './components/HomePage'
import Register from './components/Register'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Feed from './components/Feed'
import Profile from './components/Profile'
import UserProfileEdit from './components/UserProfileEdit'
import Favoritos from './components/Favoritos'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import AnimatedContent from './components/Animations/AnimatedContent'

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth()

  // Mostrar Navbar solo si está autenticado
  const shouldShowNavbar = isAuthenticated
  
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
    <>
      {shouldShowNavbar && <Navbar isAuthenticated={isAuthenticated} logout={logout} />}
      
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas - SOLO se renderizan si está autenticado */}
        {isAuthenticated && (
          <>
            <Route path="/feed" element={
              <ProtectedRoute>
                <div className="lg:ml-64">
                  <Feed />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <div className="lg:ml-64">
                  <Profile />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/editar-perfil" element={
              <ProtectedRoute>
                <div className="lg:ml-64">
                  <UserProfileEdit />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/crear" element={
              <ProtectedRoute>
                <div className="lg:ml-64 min-h-screen bg-pavlova-400 flex items-center justify-center">
                  <AnimatedContent
                    distance={150}
                    direction="vertical"
                    duration={1.2}
                    ease="bounce.out"
                    initialOpacity={0.2}
                    scale={0.9}
                    delay={0.3}
                  >
                    <h1 className="text-2xl font-bold text-white">Crear Receta (En desarrollo)</h1>
                  </AnimatedContent>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute>
                <div className="lg:ml-64">
                  <Favoritos />
                </div>
              </ProtectedRoute>
            } />
          </>
        )}
        
        {/* Ruta catch-all para páginas no encontradas - solo mostrar si no está cargando */}
        <Route path="*" element={!isLoading ? <NotFound /> : null} />
      </Routes>
    </>
  )
}

export default App