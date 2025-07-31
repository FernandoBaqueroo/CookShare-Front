import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { apiGet, añadirFavorito, eliminarFavorito } from '../functions/api'
import AnimatedContent from '../components/Animations/AnimatedContent'
import { 
  Heart, 
  Clock, 
  Users, 
  Star, 
  X,
  Share2,
  Bookmark,
  Eye,
  ChefHat,
  Calendar
} from 'lucide-react'

function Feed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReceta, setSelectedReceta] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  // Estados para favoritos
  const [favoritos, setFavoritos] = useState({}) // { recetaId: favoritoId }

  useEffect(() => {
    if (user?.id) {
      cargarRecetas()
      cargarFavoritosUsuario()
    }
  }, [user?.id])

  // Recargar favoritos cuando el usuario cambie
  useEffect(() => {
    if (user?.id) {
      cargarFavoritosUsuario()
    }
  }, [user?.id])

  const cargarRecetas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user?.id) {
        setError('Usuario no autenticado')
        return
      }
      
      const token = localStorage.getItem('token')
      const response = await apiGet('feed', token)
      
      if (response && response.data) {
        setRecetas(response.data)
      }
    } catch (error) {
      setError('No se pudieron cargar las recetas. Verifica tu conexión e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Cargar favoritos del usuario para sincronizar estado
  const cargarFavoritosUsuario = async () => {
    if (!user?.id) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await apiGet(`favoritos?usuario_id=${user.id}`, token)
      
      if (response && response.data) {
        // Crear un objeto con recetaId -> favoritoId
        const favoritosMap = {}
        response.data.forEach(favorito => {
          // La estructura es: favorito.receta.id (no favorito.receta_id)
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

  // Función para añadir a favoritos
  const añadirAFavoritos = async (recetaId) => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await añadirFavorito(recetaId, user.id, token)
      
      if (response && response.data) {
        // Actualizar estado local inmediatamente
        setFavoritos(prev => ({
          ...prev,
          [recetaId]: response.data.favorito_id
        }))
        
        // Actualizar contador de favoritos en la receta
        setRecetas(prev => prev.map(receta => 
          receta.id === recetaId 
            ? { ...receta, total_favoritos: (receta.total_favoritos || 0) + 1 }
            : receta
        ))
        
        // Recargar favoritos para asegurar sincronización
        await cargarFavoritosUsuario()
      }
    } catch (error) {
      // Si el error es 400 (Bad Request), probablemente la receta ya está en favoritos
      if (error.message && error.message.includes('400')) {
        // Recargar favoritos para asegurar que el estado esté sincronizado
        await cargarFavoritosUsuario()
        return
      }
      
      // Para otros errores, también recargar favoritos para asegurar estado correcto
      await cargarFavoritosUsuario()
    }
  }

  // Función para eliminar de favoritos
  const eliminarDeFavoritos = async (recetaId) => {
    const favoritoId = favoritos[recetaId]
    if (!favoritoId) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await eliminarFavorito(favoritoId, token)
      
      if (response && response.data) {
        // Actualizar estado local inmediatamente
        setFavoritos(prev => {
          const newFavoritos = { ...prev }
          delete newFavoritos[recetaId]
          return newFavoritos
        })
        
        // Actualizar contador de favoritos en la receta
        setRecetas(prev => prev.map(receta => 
          receta.id === recetaId 
            ? { ...receta, total_favoritos: Math.max(0, (receta.total_favoritos || 0) - 1) }
            : receta
        ))
        
        // Recargar favoritos para asegurar sincronización
        await cargarFavoritosUsuario()
      }
    } catch (error) {
      // Si hay error, recargar favoritos para asegurar estado correcto
      await cargarFavoritosUsuario()
    }
  }

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'Fácil': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Difícil': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0m'
    const mins = parseInt(time)
    if (mins >= 60) {
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hoy'
    if (diffDays === 2) return 'Ayer'
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  const handleRecetaClick = (receta) => {
    setSelectedReceta(receta)
    setShowModal(true)
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pavlova-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pavlova-600 font-medium">Cargando recetas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-pavlova-500" />
          </div>
          <h3 className="text-xl font-semibold text-pavlova-800 mb-2">Feed en desarrollo</h3>
          <p className="text-pavlova-600 mb-4">{error}</p>
          <p className="text-sm text-pavlova-500">
            Mientras tanto, puedes explorar tu perfil o crear nuevas recetas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-white to-pavlova-100">
      {/* Header moderno */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pavlova-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pavlova-500 to-pavlova-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-pavlova-800">CookShare</h1>
                <p className="text-sm text-pavlova-600">Descubre recetas increíbles</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pavlova-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-pavlova-600 font-medium">{recetas.length} recetas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feed de recetas */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {recetas.map((receta) => (
            <AnimatedContent
              key={receta.id}
              distance={20}
              direction="vertical"
              duration={0.6}
              delay={recetas.indexOf(receta) * 0.1}
            >
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-pavlova-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleRecetaClick(receta)}
              >
                {/* Imagen principal */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={receta.foto_principal || '/images/default-recipe.jpg'}
                    alt={receta.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/images/default-recipe.jpg'
                    }}
                  />
                  
                  {/* Overlay con información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge de dificultad */}
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getDificultadColor(receta.dificultad)}`}>
                    {receta.dificultad}
                  </div>

                  {/* Botón de favorito */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const favoritoId = favoritos[receta.id]
                      if (favoritoId) {
                        eliminarDeFavoritos(receta.id)
                      } else {
                        añadirAFavoritos(receta.id)
                      }
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group/fav"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favoritos[receta.id] 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-600 group-hover/fav:text-red-500'
                      } transition-colors duration-200`} 
                    />
                  </button>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  {/* Header con usuario */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pavlova-100 shadow-sm">
                      <img
                        src={receta.foto_perfil || '/images/default-avatar.png'}
                        alt={receta.nombre_usuario}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.png'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Navegar al perfil del usuario usando su nombre de usuario
                          if (receta.nombre_usuario) {
                            navigate(`/perfil/${receta.nombre_usuario}`)
                          }
                        }}
                        className="text-sm font-semibold text-pavlova-800 hover:text-pavlova-600 transition-colors text-left"
                      >
                        {receta.nombre_usuario}
                      </button>
                      <div className="flex items-center space-x-2 text-xs text-pavlova-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(receta.fecha_creacion)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Título y descripción */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-pavlova-700 transition-colors">
                      {receta.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {receta.descripcion}
                    </p>
                  </div>

                  {/* Etiquetas */}
                  {receta.etiquetas && receta.etiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {receta.etiquetas.slice(0, 3).map((etiqueta, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full font-medium border"
                          style={{
                            backgroundColor: `${etiqueta.color}15`,
                            color: etiqueta.color,
                            borderColor: `${etiqueta.color}30`
                          }}
                        >
                          #{etiqueta.nombre.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      ))}
                      {receta.etiquetas.length > 3 && (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium border border-gray-200">
                          +{receta.etiquetas.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Acciones y estadísticas */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatTime(receta.tiempo_preparacion)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{receta.porciones || 1} porciones</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{receta.total_favoritos || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implementar compartir
                        }}
                        className="p-2 text-gray-400 hover:text-pavlova-600 hover:bg-pavlova-50 rounded-full transition-all duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implementar guardar
                        }}
                        className="p-2 text-gray-400 hover:text-pavlova-600 hover:bg-pavlova-50 rounded-full transition-all duration-200"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Mensaje cuando no hay recetas */}
        {recetas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-pavlova-500" />
            </div>
            <h3 className="text-xl font-semibold text-pavlova-800 mb-2">No hay recetas disponibles</h3>
            <p className="text-pavlova-600 mb-6">Sé el primero en crear una receta increíble</p>
            <button className="bg-gradient-to-r from-pavlova-500 to-pavlova-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pavlova-600 hover:to-pavlova-700 transition-all duration-200 shadow-lg">
              Crear Receta
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles de receta */}
      {showModal && selectedReceta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Detalles de la Receta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Imagen principal */}
              <div className="relative mb-6">
                <img
                  src={selectedReceta.foto_principal || '/images/default-recipe.jpg'}
                  alt={selectedReceta.titulo}
                  className="w-full h-64 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = '/images/default-recipe.jpg'
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedReceta.dificultad === 'Fácil' ? 'bg-green-500 text-white' :
                    selectedReceta.dificultad === 'Intermedio' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {selectedReceta.dificultad}
                  </span>
                </div>
              </div>

              {/* Información de la receta */}
              <div className="space-y-6">
                {/* Botones de acción */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        const favoritoId = favoritos[selectedReceta.id]
                        if (favoritoId) {
                          eliminarDeFavoritos(selectedReceta.id)
                        } else {
                          añadirAFavoritos(selectedReceta.id)
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-6 h-6 ${
                          favoritos[selectedReceta.id] 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400 hover:text-red-500'
                        } transition-colors`} 
                      />
                    </button>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatTime(selectedReceta.tiempo_preparacion)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{selectedReceta.porciones || 1} porciones</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{selectedReceta.total_favoritos || 0}</span>
                  </div>
                </div>

                {/* Título y descripción */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedReceta.titulo}</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedReceta.descripcion}</p>
                </div>

                {/* Etiquetas */}
                {selectedReceta.etiquetas && selectedReceta.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedReceta.etiquetas.map((etiqueta, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full font-medium"
                        style={{
                          backgroundColor: `${etiqueta.color}20`,
                          color: etiqueta.color
                        }}
                      >
                        #{etiqueta.nombre.toLowerCase().replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Instrucciones */}
                {selectedReceta.instrucciones && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Instrucciones</h3>
                    <div className="space-y-3">
                      {selectedReceta.instrucciones.split('\n').map((instruccion, index) => (
                        instruccion.trim() && (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-1">
                              <p className="text-gray-700">{instruccion.trim()}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feed