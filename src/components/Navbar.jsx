import { useLocation } from 'react-router-dom'
import { Home, User, Plus, Heart, LogOut } from 'lucide-react'
import NavbarDesktop from './Navbar/NavbarDesktop'
import NavbarMobile from './Navbar/NavbarMobile'

function Navbar({ isAuthenticated, logout }) {
  const location = useLocation()

  // Verificar que el contexto de React Router esté disponible
  if (!location) {
    return null
  }

  const menuItems = [
    { path: '/feed', label: 'Feed', icon: Home },
    { path: '/perfil', label: 'Perfil', icon: User },
    { path: '/crear', label: 'Crear', icon: Plus },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
  ]

  const authPaths = ['/login', '/register'] // Removido '/' para que no oculte el navbar en home
  const isActive = (path) => location.pathname === path
  const shouldHideNavbar = authPaths.includes(location.pathname)

  if (shouldHideNavbar || !isAuthenticated) return null

  return (
    <>
      <NavbarDesktop menuItems={menuItems} isActive={isActive} onLogout={logout} />
      <NavbarMobile menuItems={menuItems} isActive={isActive} onLogout={logout} />
    </>
  )
}

export default Navbar