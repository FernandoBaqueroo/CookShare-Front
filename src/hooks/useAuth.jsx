import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../functions/api.js'
const { apiPost, apiGet } = api

// Crear el contexto de autenticación
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar si hay token al inicializar
    const token = localStorage.getItem('token')
    return !!token
  })
  const [isLoading, setIsLoading] = useState(true) // Cambiar a true para mostrar loading inicial
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Función para validar el token con el backend
  const validateToken = async (token) => {
    try {
      const response = await apiGet('perfil', token)
      setUser(response.data)
      return true
    } catch (error) {
      console.error('Token inválido:', error)
      localStorage.removeItem('token')
      return false
    }
  }

  // Validar token al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const isValid = await validateToken(token)
        setIsAuthenticated(isValid)
        if (!isValid) {
          localStorage.removeItem('token')
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }
    
    checkAuth()
  }, []) // Solo ejecutar una vez al montar

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await apiPost('login', { email, password })
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        const isValid = await validateToken(response.token)
        setIsAuthenticated(isValid)
        
        // Navegar inmediatamente al feed después del login exitoso
        if (isValid) {
          navigate('/feed', { replace: true })
        }
        
        return response
      }
      
      throw new Error('No se recibió token del servidor')
    } catch (error) {
      throw new Error(error.message || 'Error en el inicio de sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (nombre_usuario, nombre_completo, email, password) => {
    try {
      setIsLoading(true)
      const response = await apiPost('register', {
        nombre_usuario,
        nombre_completo,
        email,
        password
      })
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        const isValid = await validateToken(response.token)
        setIsAuthenticated(isValid)
        
        // Navegar inmediatamente al feed después del registro exitoso
        if (isValid) {
          navigate('/feed', { replace: true })
        }
        
        return response
      }
      
      throw new Error('No se recibió token del servidor')
    } catch (error) {
      throw new Error(error.message || 'Error en el registro')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
    navigate('/', { replace: true })
  }

  // Función para actualizar los datos del usuario
  const updateUser = async () => {
    try {
      console.log('🔄 Iniciando actualización de usuario...')
      const token = localStorage.getItem('token')
      if (token) {
        console.log('🔑 Token encontrado, haciendo petición a /perfil')
        const response = await apiGet('perfil', token)
        console.log('📥 Respuesta de /perfil:', response)
        console.log('👤 Datos del usuario antes:', user)
        setUser(response.data)
        console.log('👤 Datos del usuario después:', response.data)
        console.log('🖼️ Campo foto_perfil:', response.data.foto_perfil)
        console.log('✅ Usuario actualizado en el contexto')
      } else {
        console.log('❌ No hay token disponible')
      }
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 