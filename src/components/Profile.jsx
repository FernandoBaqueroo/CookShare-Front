import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { User, Mail, UserCircle, Camera, Lock, Eye, EyeOff, Save, X, Edit3, LogOut, Heart, Clock, Star, Plus, Calendar, Award, Users, BookOpen, ChefHat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AnimatedContent from './Animations/AnimatedContent'
import api from '../functions/api.js'
const { apiGet } = api

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReceta, setSelectedReceta] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [imageKey, setImageKey] = useState(0) // Para forzar re-renderizado de imágenes

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await apiGet('personal_posts_preview', token)
        console.log('🔍 Datos recibidos del backend:', response.data)
        setRecetas(response.data)
      } catch (error) {
        console.error('Error al cargar recetas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecetas()
  }, [])

  // Forzar re-renderizado cuando cambie la imagen del usuario
  useEffect(() => {
    if (user?.foto_perfil) {
      setImageKey(prev => prev + 1)
      console.log('🔄 Forzando re-renderizado de imagen:', user.foto_perfil)
    }
  }, [user?.foto_perfil])

  const handleRecetaClick = async (recetaId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiGet(`personal_posts/${recetaId}`, token)
      setSelectedReceta(response.data)
      setShowModal(true)
    } catch (error) {
      console.error('Error al cargar detalles de la receta:', error)
    }
  }

  const getDificultadColor = (dificultad) => {
    switch (dificultad?.toLowerCase()) {
      case 'fácil': return 'text-green-600 bg-green-100'
      case 'medio':
      case 'intermedio': return 'text-yellow-600 bg-yellow-100'
      case 'difícil': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
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
            <p className="text-pavlova-600 text-center">Cargando tu perfil...</p>
          </div>
        </AnimatedContent>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200">
      {/* Header del perfil */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pavlova-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="bounce.out"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
              {/* Foto de perfil */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <img
                    key={imageKey} // Add key to force re-render
                    src={user?.foto_perfil ? `${user.foto_perfil}?t=${Date.now()}` : '/images/default-avatar.png'}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.png'
                    }}
                  />
                </div>
              </div>

              {/* Información del usuario */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-pavlova-800 mb-2">
                  {user?.nombre_completo || user?.nombre_usuario}
                </h1>
                <p className="text-pavlova-600 text-base sm:text-lg mb-3 sm:mb-4">@{user?.nombre_usuario}</p>
                
                {/* Estadísticas */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 text-pavlova-600">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">{recetas.length} recetas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-pavlova-600">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">{recetas.reduce((total, receta) => total + (receta.total_favoritos || 0), 0)} favoritos totales</span>
                  </div>
                  <div className="flex items-center space-x-2 text-pavlova-600">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">Miembro desde {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</span>
                  </div>
                </div>

                {/* Información adicional - Compacta en móvil */}
                <div className="bg-pavlova-50/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-pavlova-700 mb-1">
                        {recetas.filter(r => r.dificultad?.toLowerCase() === 'fácil').length}
                      </div>
                      <div className="text-xs sm:text-sm text-pavlova-600">Fáciles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-pavlova-700 mb-1">
                        {recetas.filter(r => r.dificultad?.toLowerCase() === 'medio' || r.dificultad?.toLowerCase() === 'intermedio').length}
                      </div>
                      <div className="text-xs sm:text-sm text-pavlova-600">Medias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-pavlova-700 mb-1">
                        {recetas.filter(r => r.dificultad?.toLowerCase() === 'difícil').length}
                      </div>
                      <div className="text-xs sm:text-sm text-pavlova-600">Difíciles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Título de sección */}
        <AnimatedContent
          distance={20}
          direction="vertical"
          duration={0.5}
          delay={0.2}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-pavlova-800 mb-1 sm:mb-2">Mis Recetas</h2>
              <p className="text-sm sm:text-base text-pavlova-600">Todas las recetas que has creado</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                className="inline-flex items-center justify-center px-4 py-2 bg-pavlova-500 text-white rounded-lg shadow-md text-sm sm:text-base"
                onClick={() => navigate('/crear')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva receta
              </button>
              <button 
                className="inline-flex items-center justify-center px-4 py-2 bg-pavlova-500 text-white rounded-lg shadow-md text-sm sm:text-base"
                onClick={() => navigate('/editar-perfil')}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar perfil
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* Grid de recetas */}
        {recetas.length === 0 ? (
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            delay={0.3}
          >
            <div className="text-center py-8 sm:py-12">
              <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-pavlova-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-pavlova-700 mb-2">No tienes recetas aún</h3>
              <p className="text-sm sm:text-base text-pavlova-600 mb-4 sm:mb-6">Comienza creando tu primera receta para compartir con la comunidad</p>
              <button 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-pavlova-500 text-white rounded-lg shadow-md text-sm sm:text-base"
                onClick={() => navigate('/crear')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear mi primera receta
              </button>
            </div>
          </AnimatedContent>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {recetas.map((receta, index) => (
              <AnimatedContent
                key={receta.id}
                distance={30}
                direction="vertical"
                duration={0.6}
                delay={0.1 * index}
              >
                <div 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 cursor-pointer overflow-hidden group transition-all duration-300"
                  onClick={() => handleRecetaClick(receta.id)}
                >
                  {/* Imagen de la receta */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={receta.foto_principal || '/images/default-recipe.jpg'}
                      alt={receta.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/default-recipe.jpg'
                      }}
                    />
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge de dificultad */}
                    {receta.dificultad && (
                      <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg ${getDificultadColor(receta.dificultad)}`}>
                        {receta.dificultad}
                      </div>
                    )}
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50/30">
                    {/* Header con usuario */}
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-pavlova-100 shadow-sm">
                        <img
                          key={imageKey} // Add key to force re-render
                          src={user?.foto_perfil ? `${user.foto_perfil}?t=${Date.now()}` : '/images/default-avatar.png'}
                          alt={user?.nombre_usuario}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.png'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {user?.nombre_usuario}
                        </p>
                        <p className="text-xs text-gray-500">Creado recientemente</p>
                      </div>
                    </div>
                    
                    {/* Título de la receta */}
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 leading-tight group-hover:text-pavlova-700 transition-colors duration-200">
                      {receta.titulo}
                    </h3>
                    
                    {/* Acciones */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500 hover:text-pavlova-600 transition-colors duration-200">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">{receta.total_favoritos || 0}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-pavlova-600 transition-colors duration-200 p-1 rounded-full hover:bg-pavlova-50">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles de receta */}
      {showModal && selectedReceta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="relative">
              <img
                src={selectedReceta.foto_principal || '/images/default-recipe.jpg'}
                alt={selectedReceta.titulo}
                className="w-full h-64 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src = '/images/default-recipe.jpg'
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pavlova-600 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-pavlova-800 mb-2">{selectedReceta.titulo}</h2>
                  <p className="text-pavlova-600 mb-4">{selectedReceta.descripcion}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDificultadColor(selectedReceta.dificultad)}`}>
                  {selectedReceta.dificultad}
                </div>
              </div>

              {/* Información de la receta */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-pavlova-50 rounded-lg">
                  <Clock className="w-6 h-6 text-pavlova-500 mx-auto mb-1" />
                  <p className="text-sm text-pavlova-600">Preparación</p>
                  <p className="font-semibold text-pavlova-800">{formatTime(selectedReceta.tiempo_preparacion)}</p>
                </div>
                <div className="text-center p-3 bg-pavlova-50 rounded-lg">
                  <ChefHat className="w-6 h-6 text-pavlova-500 mx-auto mb-1" />
                  <p className="text-sm text-pavlova-600">Cocción</p>
                  <p className="font-semibold text-pavlova-800">{formatTime(selectedReceta.tiempo_coccion)}</p>
                </div>
                <div className="text-center p-3 bg-pavlova-50 rounded-lg">
                  <Users className="w-6 h-6 text-pavlova-500 mx-auto mb-1" />
                  <p className="text-sm text-pavlova-600">Porciones</p>
                  <p className="font-semibold text-pavlova-800">{selectedReceta.porciones}</p>
                </div>
                <div className="text-center p-3 bg-pavlova-50 rounded-lg">
                  <Star className="w-6 h-6 text-pavlova-500 mx-auto mb-1" />
                  <p className="text-sm text-pavlova-600">Valoración</p>
                  <p className="font-semibold text-pavlova-800">{selectedReceta.promedio_valoraciones}/5</p>
                </div>
                <div className="text-center p-3 bg-pavlova-50 rounded-lg">
                  <Heart className="w-6 h-6 text-pavlova-500 mx-auto mb-1" />
                  <p className="text-sm text-pavlova-600">Favoritos</p>
                  <p className="font-semibold text-pavlova-800">{selectedReceta.total_favoritos || 0}</p>
                </div>
              </div>

              {/* Ingredientes */}
              {selectedReceta.ingredientes && selectedReceta.ingredientes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Ingredientes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedReceta.ingredientes.map((ingrediente, index) => (
                      <div key={index} className="flex items-center p-2 bg-pavlova-50 rounded-lg">
                        <div className="w-2 h-2 bg-pavlova-400 rounded-full mr-3"></div>
                        <span className="text-pavlova-700">
                          {ingrediente.cantidad} {ingrediente.unidad_medida} {ingrediente.nombre}
                          {ingrediente.notas && <span className="text-pavlova-500 text-sm"> ({ingrediente.notas})</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instrucciones */}
              {selectedReceta.instrucciones && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Instrucciones</h3>
                  <div className="prose prose-pavlova max-w-none">
                    <p className="text-pavlova-700 leading-relaxed">{selectedReceta.instrucciones}</p>
                  </div>
                </div>
              )}

              {/* Comentarios */}
              {selectedReceta.comentarios && selectedReceta.comentarios.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Comentarios ({selectedReceta.comentarios.length})</h3>
                  <div className="space-y-4">
                    {selectedReceta.comentarios.map((comentario) => (
                      <div key={comentario.id} className="flex space-x-3 p-4 bg-pavlova-50 rounded-lg">
                        <img
                          src={comentario.foto_perfil || '/images/default-avatar.png'}
                          alt={comentario.nombre_usuario}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.png'
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-pavlova-800">@{comentario.nombre_usuario}</span>
                            <span className="text-sm text-pavlova-500">{formatDate(comentario.fecha_comentario)}</span>
                          </div>
                          <p className="text-pavlova-700">{comentario.comentario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Valoraciones */}
              {selectedReceta.valoraciones && selectedReceta.valoraciones.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Valoraciones ({selectedReceta.total_valoraciones})</h3>
                  <div className="space-y-3">
                    {selectedReceta.valoraciones.map((valoracion) => (
                      <div key={valoracion.id} className="flex items-center space-x-3 p-3 bg-pavlova-50 rounded-lg">
                        <img
                          src={valoracion.foto_perfil || '/images/default-avatar.png'}
                          alt={valoracion.nombre_usuario}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.png'
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-pavlova-800">@{valoracion.nombre_usuario}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < valoracion.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-pavlova-500">{formatDate(valoracion.fecha_valoracion)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile 