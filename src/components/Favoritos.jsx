import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { Heart, Clock, Star, Calendar, ChefHat, Users, X, Share2 } from 'lucide-react'
import AnimatedContent from './Animations/AnimatedContent'
import api from '../functions/api.js'
const { apiGet } = api

function Favoritos() {
  const { user } = useAuth()
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReceta, setSelectedReceta] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await apiGet(`favoritos?usuario_id=${user?.id}`, token)
        setFavoritos(response.data)
      } catch (error) {
        console.error('Error al cargar favoritos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchFavoritos()
    }
  }, [user?.id])

  const handleRecetaClick = async (receta) => {
    setSelectedReceta(receta)
    setShowModal(true)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes) || minutes === 'NaN') return 'N/A'
    const mins = parseInt(minutes)
    if (isNaN(mins)) return 'N/A'
    
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    if (hours > 0) {
      return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`
    }
    return `${remainingMins}m`
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
            <p className="text-pavlova-600 text-center">Cargando tus favoritos...</p>
          </div>
        </AnimatedContent>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pavlova-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            ease="bounce.out"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pavlova-600 mr-3" />
                <h1 className="text-2xl sm:text-3xl font-bold text-pavlova-800">Mis Favoritos</h1>
              </div>
              <p className="text-sm sm:text-base text-pavlova-600 mb-4">
                Recetas que has guardado como favoritas
              </p>
              <div className="bg-pavlova-50/50 rounded-xl p-3 sm:p-4 inline-block">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pavlova-600" />
                  <span className="text-lg sm:text-xl font-bold text-pavlova-700">
                    {favoritos.length} recetas favoritas
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        {favoritos.length === 0 ? (
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            delay={0.3}
          >
            <div className="text-center py-8 sm:py-12">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pavlova-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-pavlova-700 mb-2">No tienes favoritos aún</h3>
              <p className="text-sm sm:text-base text-pavlova-600 mb-4 sm:mb-6">
                Explora el feed y marca como favoritas las recetas que más te gusten
              </p>
            </div>
          </AnimatedContent>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {favoritos.map((favorito, index) => (
              <AnimatedContent
                key={favorito.id}
                distance={30}
                direction="vertical"
                duration={0.6}
                delay={0.1 * index}
              >
                <div 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 cursor-pointer overflow-hidden group transition-all duration-300"
                  onClick={() => handleRecetaClick(favorito.receta)}
                >
                  {/* Imagen de la receta */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={favorito.receta.foto_principal || '/images/default-recipe.jpg'}
                      alt={favorito.receta.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/default-recipe.jpg'
                      }}
                    />
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge de dificultad */}
                    {favorito.receta.dificultad && (
                      <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm lg:text-base font-semibold shadow-lg ${getDificultadColor(favorito.receta.dificultad)}`}>
                        {favorito.receta.dificultad}
                      </div>
                    )}

                    {/* Badge de favorito */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-red-500 text-white rounded-full p-1 sm:p-1.5 lg:p-2 shadow-lg">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-current" />
                    </div>
                  </div>

                  {/* Contenido de la tarjeta - Más compacto */}
                  <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-white to-gray-50/30">
                    {/* Header con usuario - Más compacto */}
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border border-pavlova-100 shadow-sm">
                        <img
                          src={favorito.receta.foto_perfil ? `${favorito.receta.foto_perfil}?t=${Date.now()}` : '/images/default-avatar.png'}
                          alt={favorito.receta.nombre_usuario}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.png'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 truncate">
                          {favorito.receta.nombre_usuario}
                        </p>
                      </div>
                    </div>
                    
                    {/* Título de la receta - Más compacto */}
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-pavlova-700 transition-colors duration-200">
                      {favorito.receta.titulo}
                    </h3>

                    {/* Etiquetas - Solo las primeras 2 */}
                    {favorito.receta.etiquetas && favorito.receta.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {favorito.receta.etiquetas.slice(0, 2).map((etiqueta, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 text-xs sm:text-sm rounded-full font-medium"
                            style={{
                              backgroundColor: `${etiqueta.color}20`,
                              color: etiqueta.color
                            }}
                          >
                            {etiqueta.nombre}
                          </span>
                        ))}
                        {favorito.receta.etiquetas.length > 2 && (
                          <span className="px-2 py-1 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 text-xs sm:text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
                            +{favorito.receta.etiquetas.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Acciones - Más compacto */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1 text-red-500">
                          <Heart className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-current" />
                          <span className="text-xs sm:text-sm lg:text-base font-medium">Favorito</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-pavlova-600 transition-colors duration-200 p-1 sm:p-1.5 rounded-full hover:bg-pavlova-50">
                        <Share2 className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
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

              {/* Información del autor */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-pavlova-50 rounded-lg">
                <img
                  src={selectedReceta.foto_perfil ? `${selectedReceta.foto_perfil}?t=${Date.now()}` : '/images/default-avatar.png'}
                  alt={selectedReceta.nombre_usuario}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-avatar.png'
                  }}
                />
                <div>
                  <p className="font-semibold text-pavlova-800">@{selectedReceta.nombre_usuario}</p>
                  <p className="text-sm text-pavlova-600">Autor de la receta</p>
                </div>
              </div>

              {/* Etiquetas */}
              {selectedReceta.etiquetas && selectedReceta.etiquetas.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Etiquetas</h3>
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
                        {etiqueta.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Información del favorito */}
              <div className="bg-pavlova-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <span className="font-semibold text-pavlova-800">Marcado como favorito</span>
                </div>
                <p className="text-sm text-pavlova-600 mt-1">
                  Favorito el {formatDate(favoritos.find(f => f.receta.id === selectedReceta.id)?.fecha_favorito)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Favoritos 