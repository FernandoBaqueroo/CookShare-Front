import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  obtenerPerfilUsuario, 
  obtenerRecetasUsuario,
  apiGet, 
  apiPost, 
  apiDelete 
} from '../functions/api'
import AnimatedContent from '../components/Animations/AnimatedContent'
import { 
  ChefHat, 
  Heart, 
  Calendar, 
  Clock, 
  Users, 
  Share2, 
  Bookmark,
  Eye,
  ArrowLeft
} from 'lucide-react'

function UserProfile() {
  const { nombreUsuario } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favoritos, setFavoritos] = useState({})
  const [favoritosCounts, setFavoritosCounts] = useState({})

  useEffect(() => {
    if (nombreUsuario && nombreUsuario.trim()) {
      cargarPerfilCompleto()
    } else {
      setError('Nombre de usuario inválido')
      setLoading(false)
    }
  }, [nombreUsuario])

  const cargarPerfilCompleto = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      
      // Cargar perfil y recetas en paralelo (funcionalidad principal)
      const [perfilResponse, recetasResponse] = await Promise.all([
        obtenerPerfilUsuario(nombreUsuario, token),
        obtenerRecetasUsuario(nombreUsuario, token).catch(() => ({ data: [] })) // Fallback si no hay recetas
      ])
      
      if (perfilResponse && perfilResponse.data) {
        setUserProfile(perfilResponse.data)
      } else {
        setError('No se pudo cargar el perfil del usuario')
        return
      }
      
      if (recetasResponse && recetasResponse.data) {
        setRecetas(recetasResponse.data)
        
        // Inicializar contadores de favoritos
        const counts = {}
        recetasResponse.data.forEach(receta => {
          counts[receta.id] = receta.total_favoritos || 0
        })
        setFavoritosCounts(counts)
      } else {
        setRecetas([])
      }
      
      // Cargar favoritos del usuario actual
      await cargarFavoritosUsuario()
      
    } catch (error) {
      if (error.message?.includes('404')) {
        setError('Usuario no encontrado')
      } else {
        setError('Error al cargar el perfil del usuario')
      }
    } finally {
      setLoading(false)
    }
  }



  const cargarFavoritosUsuario = async () => {
    if (!currentUser?.id) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await apiGet(`favoritos?usuario_id=${currentUser.id}`, token)
      
      if (response && response.data) {
        const favoritosMap = {}
        response.data.forEach(favorito => {
          const recetaId = favorito.receta?.id
          if (recetaId) {
            favoritosMap[recetaId] = favorito.id
          }
        })
        setFavoritos(favoritosMap)
      }
    } catch (error) {
      // Error silencioso para favoritos
    }
  }



  const añadirAFavoritos = async (recetaId) => {
    if (!currentUser) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await apiPost('favorito', {
        receta_id: recetaId,
        usuario_id: currentUser.id
      }, token)
      
      if (response && response.data) {
        setFavoritos(prev => ({
          ...prev,
          [recetaId]: response.data.favorito_id
        }))
        
        setFavoritosCounts(prev => ({
          ...prev,
          [recetaId]: (prev[recetaId] || 0) + 1
        }))
        
        await cargarFavoritosUsuario()
      }
    } catch (error) {
      if (error.message && error.message.includes('400')) {
        await cargarFavoritosUsuario()
      }
    }
  }

  const eliminarDeFavoritos = async (recetaId) => {
    const favoritoId = favoritos[recetaId]
    if (!favoritoId) return
    
    try {
      const token = localStorage.getItem('token')
      await apiDelete(`favorito/${favoritoId}`, token)
      
      setFavoritos(prev => {
        const newFavoritos = { ...prev }
        delete newFavoritos[recetaId]
        return newFavoritos
      })
      
      setFavoritosCounts(prev => ({
        ...prev,
        [recetaId]: Math.max(0, (prev[recetaId] || 0) - 1)
      }))
      
      await cargarFavoritosUsuario()
    } catch (error) {
      // Error silencioso
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Fecha no disponible'
    }
  }

  const formatTime = (time) => {
    if (!time) return 'Tiempo no especificado'
    
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    
    if (hours === 0) {
      return `${minutes} min`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}min`
    }
  }

  const getDificultadColor = (dificultad) => {
    switch (dificultad?.toLowerCase()) {
      case 'fácil':
        return 'text-green-600 bg-green-100'
      case 'medio':
        return 'text-yellow-600 bg-yellow-100'
      case 'difícil':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pavlova-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pavlova-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-pavlova-500" />
          </div>
          <h3 className="text-xl font-semibold text-pavlova-800 mb-2">Perfil no encontrado</h3>
          <p className="text-pavlova-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/feed')}
            className="bg-pavlova-600 text-white px-6 py-2 rounded-lg hover:bg-pavlova-700 transition-colors"
          >
            Volver al Feed
          </button>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-pavlova-600">No se encontró información del usuario</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-white to-pavlova-100">
      {/* Header con botón de regreso */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pavlova-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center space-x-2 text-pavlova-600 hover:text-pavlova-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Feed</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pavlova-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-pavlova-600 font-medium">Perfil público</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatedContent
          distance={30}
          direction="vertical"
          duration={0.8}
        >
          {/* Header del perfil */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-pavlova-200/50 overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-pavlova-400 to-pavlova-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            {/* Información del perfil */}
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-pavlova-100">
                  <img
                    src={userProfile.foto_perfil || '/images/default-avatar.png'}
                    alt={userProfile.nombre_usuario}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.png'
                    }}
                  />
                </div>
              </div>
              
              {/* Información principal */}
              <div className="pt-20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {userProfile.nombre_usuario}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                      {userProfile.nombre_completo}
                    </p>
                    {userProfile.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-2">
                        {userProfile.bio}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Miembro desde {formatDate(userProfile.fecha_registro)}</span>
                    </div>
                  </div>
                  

                </div>
                
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-pavlova-600 mb-1">
                      <ChefHat className="w-5 h-5" />
                      <span className="text-2xl font-bold">{userProfile.total_recetas || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600">Recetas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-pavlova-600 mb-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-2xl font-bold">{userProfile.total_favoritos_recibidos || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600">Favoritos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de recetas */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-pavlova-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-pavlova-800">
                Recetas de {userProfile.nombre_usuario}
              </h3>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-pavlova-600" />
                <span className="text-sm text-pavlova-600 font-medium">
                  {recetas.length} receta{recetas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {recetas.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-pavlova-500" />
                </div>
                <h4 className="text-lg font-semibold text-pavlova-800 mb-2">
                  No hay recetas aún
                </h4>
                <p className="text-pavlova-600">
                  {userProfile.nombre_usuario} aún no ha publicado ninguna receta
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recetas.map((receta, index) => (
                  <AnimatedContent
                    key={receta.id}
                    distance={20}
                    direction="vertical"
                    duration={0.6}
                    delay={index * 0.1}
                  >
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {/* Imagen de la receta */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={receta.foto_principal || '/images/default-recipe.jpg'}
                          alt={receta.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/images/default-recipe.jpg'
                          }}
                        />
                        
                        {/* Overlay con acciones */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (favoritos[receta.id]) {
                                  eliminarDeFavoritos(receta.id)
                                } else {
                                  añadirAFavoritos(receta.id)
                                }
                              }}
                              className={`p-2 rounded-full transition-all duration-200 ${
                                favoritos[receta.id]
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-white/90 text-gray-600 hover:bg-white'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favoritos[receta.id] ? 'fill-current' : ''}`} />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Implementar compartir
                              }}
                              className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white transition-all duration-200"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Contenido de la receta */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                            {receta.titulo}
                          </h4>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {receta.descripcion}
                        </p>

                        {/* Etiquetas */}
                        {receta.etiquetas && receta.etiquetas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {receta.etiquetas.slice(0, 2).map((etiqueta, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full font-medium"
                                style={{
                                  backgroundColor: `${etiqueta.color}15`,
                                  color: etiqueta.color
                                }}
                              >
                                #{etiqueta.nombre.toLowerCase().replace(/\s+/g, '')}
                              </span>
                            ))}
                            {receta.etiquetas.length > 2 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
                                +{receta.etiquetas.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Estadísticas */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime((receta.tiempo_preparacion || 0) + (receta.tiempo_coccion || 0))}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{receta.porciones || 1}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{favoritosCounts[receta.id] || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedContent>
                ))}
              </div>
            )}
          </div>
        </AnimatedContent>
      </div>
    </div>
  )
}

export default UserProfile 