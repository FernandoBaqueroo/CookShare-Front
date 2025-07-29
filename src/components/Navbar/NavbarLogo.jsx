import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'

function NavbarLogo() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  
  // Determinar la ruta de destino basada en la autenticación
  const destination = isAuthenticated ? '/feed' : '/'
  
  // Verificar que el contexto de React Router esté disponible
  if (!location) {
    return (
      <div className="group relative transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pavlova-300 rounded-full flex justify-center">
        <div className="relative p-2">
          <img
            src="/images/logo/LogoCookie.png"
            alt="CookShare Logo"
            className="w-12 h-12 rounded-full object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl hover:rotate-12"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pavlova-200/20 to-pavlova-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    )
  }

  return (
    <Link 
      to={destination}
      className="group relative transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pavlova-300 rounded-full flex justify-center"
    >
      <div className="relative p-2">
        <img
          src="/images/logo/LogoCookie.png"
          alt="CookShare Logo"
          className="w-12 h-12 rounded-full object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl hover:rotate-12"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pavlova-200/20 to-pavlova-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  )
}

export default NavbarLogo 