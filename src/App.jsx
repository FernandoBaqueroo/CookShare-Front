import { useAuth } from './hooks/useAuth.jsx'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      {/* Mostrar Navbar solo si está autenticado */}
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} logout={logout} />}
      
      {/* Sistema de rutas modular */}
      <AppRoutes />
    </>
  )
}

export default App