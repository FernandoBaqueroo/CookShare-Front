import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AnimatedContent from '../components/Animations/AnimatedContent'

function NotFound() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
      <AnimatedContent
        distance={100}
        direction="vertical"
        duration={1.2}
        ease="bounce.out"
        initialOpacity={0.2}
        scale={0.9}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-pavlova-200/50 text-center max-w-md mx-auto">
          <div className="text-6xl font-bold text-pavlova-400 mb-4">404</div>
          <h1 className="text-2xl font-bold text-pavlova-800 mb-4">Página no encontrada</h1>
          <p className="text-pavlova-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-gradient-to-r from-pavlova-500 to-pavlova-600 hover:from-pavlova-600 hover:to-pavlova-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Volver al inicio
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/feed"
                className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Ir al Feed
              </Link>
            )}
          </div>
        </div>
      </AnimatedContent>
    </div>
  )
}

export default NotFound 