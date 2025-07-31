import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  Heart, 
  Clock, 
  Star, 
  Calendar, 
  ChefHat, 
  Users, 
  X, 
  Share2, 
  Trash2, 
  AlertCircle,
  Search,
  Filter,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
  Check
} from 'lucide-react'
import AnimatedContent from '../components/Animations/AnimatedContent'
import RecipeDetailModal from '../components/RecipeDetailModal'
import { apiGet, eliminarFavorito } from '../functions/api'

function Favoritos() {
  const { user } = useAuth()
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReceta, setSelectedReceta] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareReceta, setShareReceta] = useState(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Estados para eliminación de favoritos
  const [isDeleting, setIsDeleting] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await apiGet(`favoritos?usuario_id=${user?.id}`, token)
        setFavoritos(response.data)
          } catch (error) {
      // Error silencioso
    } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchFavoritos()
    }
  }, [user?.id])

  const handleRecetaClick = async (receta) => {
    setSelectedReceta(receta.id)
    setShowModal(true)
  }

  const handleShareClick = (e, receta) => {
    e.stopPropagation()
    setShareReceta(receta)
    setShowShareModal(true)
  }

  const handleRemoveFavorite = (e, favoritoId) => {
    e.stopPropagation()
    setShowDeleteConfirm(favoritoId)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      // Error silencioso
    }
  }

  const shareToSocial = (platform, receta) => {
    const url = encodeURIComponent(window.location.origin + `/receta/${receta.id}`)
    const text = encodeURIComponent(`¡Mira esta deliciosa receta: ${receta.titulo}!`)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'instagram':
        // Instagram no tiene API directa, pero podemos abrir la app
        shareUrl = `instagram://library?AssetPath=${url}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Receta: ${receta.titulo}`)}&body=${text}%20${url}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const getDificultadColor = (dificultad) => {
    switch (dificultad?.toLowerCase()) {
      case 'fácil': return 'bg-green-500 text-white'
      case 'medio':
      case 'intermedio': return 'bg-yellow-500 text-white'
      case 'difícil': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
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

  // Función para eliminar favorito
  const eliminarFavoritoHandler = async (favoritoId) => {
    try {
      setIsDeleting(prev => ({ ...prev, [favoritoId]: true }))
      const token = localStorage.getItem('token')
      const response = await eliminarFavorito(favoritoId, token)
      
      if (response && response.data) {
        setFavoritos(prev => prev.filter(favorito => favorito.id !== favoritoId))
        setShowDeleteConfirm(null)
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setIsDeleting(prev => ({ ...prev, [favoritoId]: false }))
    }
  }

  // Filtrar favoritos
  const filteredFavoritos = favoritos.filter(favorito => {
    const matchesSearch = favorito.receta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorito.receta.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || 
                             favorito.receta.dificultad?.toLowerCase() === filterDifficulty.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

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
      {/* Header moderno */}
      <div className="relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-pavlova-400/20 via-pavlova-300/15 to-pavlova-200/10"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm shadow-lg border-b border-pavlova-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <AnimatedContent
              distance={30}
              direction="vertical"
              duration={0.8}
              ease="bounce.out"
            >
              <div className="text-center">
                {/* Icono principal con efecto */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pavlova-500 to-pavlova-600 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-sm font-bold">{favoritos.length}</span>
                  </div>
                </div>

                {/* Título y descripción */}
                <h1 className="text-3xl sm:text-4xl font-bold text-pavlova-800 mb-3">
                  Mis Favoritos
                </h1>
                <p className="text-lg text-pavlova-600 mb-6 max-w-2xl mx-auto">
                  Tu colección personal de recetas guardadas con amor
                </p>

                {/* Estadísticas */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pavlova-200/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pavlova-100 rounded-full flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-pavlova-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pavlova-800">{favoritos.length}</p>
                        <p className="text-sm text-pavlova-600">Recetas guardadas</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pavlova-200/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pavlova-800">
                          {favoritos.filter(f => f.receta.dificultad?.toLowerCase() === 'difícil').length}
                        </p>
                        <p className="text-sm text-pavlova-600">Recetas avanzadas</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pavlova-200/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pavlova-800">
                          {new Set(favoritos.map(f => f.receta.nombre_usuario)).size}
                        </p>
                        <p className="text-sm text-pavlova-600">Chefs seguidos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>

      {/* Controles de filtrado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatedContent
          distance={20}
          direction="vertical"
          duration={0.6}
          delay={0.2}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-pavlova-200/50 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-400" />
                <input
                  type="text"
                  placeholder="Buscar en favoritos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-pavlova-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtro por dificultad */}
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-pavlova-600" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-pavlova-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all"
                >
                  <option value="all">Todas las dificultades</option>
                  <option value="fácil">Fácil</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="difícil">Difícil</option>
                </select>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Contenido principal */}
        {filteredFavoritos.length === 0 ? (
          <AnimatedContent
            distance={30}
            direction="vertical"
            duration={0.6}
            delay={0.3}
          >
            <div className="text-center py-8 sm:py-12">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pavlova-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-pavlova-700 mb-2">
                {searchTerm || filterDifficulty !== 'all' 
                  ? 'No se encontraron recetas con los filtros aplicados'
                  : 'No tienes favoritos aún'
                }
              </h3>
              <p className="text-sm sm:text-base text-pavlova-600 mb-4 sm:mb-6">
                {searchTerm || filterDifficulty !== 'all' 
                  ? 'Intenta cambiar los filtros de búsqueda'
                  : 'Explora el feed y marca como favoritas las recetas que más te gusten'
                }
              </p>
              {(searchTerm || filterDifficulty !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterDifficulty('all')
                  }}
                  className="bg-pavlova-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-pavlova-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </AnimatedContent>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredFavoritos.map((favorito, index) => (
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
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = '/images/default-recipe.jpg'
                      }}
                      loading="lazy"
                    />
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Corazón de favorito (ahora es clickeable para quitar) */}
                    <button
                      onClick={(e) => handleRemoveFavorite(e, favorito.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1.5 sm:p-2 shadow-lg backdrop-blur-sm transition-all duration-200"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </button>

                    {/* Badge de dificultad */}
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 lg:bottom-4 lg:left-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDificultadColor(favorito.receta.dificultad)}`}>
                        {favorito.receta.dificultad}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-white to-gray-50/30">
                    {/* Header con usuario */}
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border border-pavlova-100 shadow-sm">
                        <img
                          src={favorito.receta.foto_perfil || '/images/default-avatar.png'}
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
                        <p className="text-xs text-gray-500">
                          {formatDate(favorito.fecha_favorito)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Título de la receta */}
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-pavlova-700 transition-colors duration-200">
                      {favorito.receta.titulo}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {favorito.receta.descripcion}
                    </p>

                    {/* Etiquetas */}
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
                    
                    {/* Acciones */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1 text-pavlova-600">
                          <Heart className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-current" />
                          <span className="text-xs sm:text-sm lg:text-base font-medium">Guardado</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleShareClick(e, favorito.receta)}
                        className="text-gray-400 hover:text-pavlova-600 transition-colors duration-200 p-1 sm:p-1.5 rounded-full hover:bg-pavlova-50"
                      >
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.3}
            scale={0.9}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quitar de favoritos</h3>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que quieres quitar esta receta de tus favoritos?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => eliminarFavoritoHandler(showDeleteConfirm)}
                    disabled={isDeleting[showDeleteConfirm]}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting[showDeleteConfirm] ? 'Quitando...' : 'Quitar'}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      )}

      {/* Modal de compartir */}
      {showShareModal && shareReceta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.3}
            scale={0.9}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-pavlova-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Compartir receta</h3>
                <p className="text-gray-600">{shareReceta.titulo}</p>
              </div>

              {/* Redes sociales */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => shareToSocial('facebook', shareReceta)}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="font-medium">Facebook</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('twitter', shareReceta)}
                  className="flex items-center justify-center space-x-2 p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="font-medium">Twitter</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('whatsapp', shareReceta)}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('email', shareReceta)}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </button>
              </div>

              {/* Copiar enlace */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-3">O copia el enlace directo:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/receta/${shareReceta.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/receta/${shareReceta.id}`)}
                    className="px-4 py-2 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 transition-colors flex items-center space-x-1"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </AnimatedContent>
        </div>
      )}

      {/* Modal de detalles de receta */}
      <RecipeDetailModal
        recetaId={selectedReceta}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFavoriteToggle={(recetaId) => {
          // En favoritos, siempre eliminamos el favorito
          const favorito = favoritos.find(f => f.receta.id === recetaId)
          if (favorito) {
            eliminarFavoritoHandler(favorito.id)
          }
        }}
        favoritos={favoritos.reduce((acc, favorito) => {
          acc[favorito.receta.id] = favorito.id
          return acc
        }, {})}
        isOwnRecipe={false}
      />
    </div>
  )
}

export default Favoritos 