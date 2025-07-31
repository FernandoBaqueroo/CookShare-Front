import React, { useState, useEffect } from 'react'
import { 
  X, 
  Clock, 
  Star, 
  Heart, 
  Users, 
  ChefHat, 
  MessageCircle,
  Send,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { 
  apiGet, 
  añadirFavorito, 
  eliminarFavorito,
  crearComentario,
  obtenerComentarios,
  crearValoracion,
  obtenerValoraciones,
  editarValoracion
} from '../functions/api'
import AnimatedContent from './Animations/AnimatedContent'

function RecipeDetailModal({ 
  recetaId, 
  isOpen, 
  onClose, 
  onFavoriteToggle,
  favoritos,
  isOwnRecipe = false,
  onDeleteRecipe
}) {
  const { user } = useAuth()
  const [receta, setReceta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comentarios, setComentarios] = useState([])
  const [valoraciones, setValoraciones] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [miValoracion, setMiValoracion] = useState(null)
  const [puntuacionSeleccionada, setPuntuacionSeleccionada] = useState(0)
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [enviandoValoracion, setEnviandoValoracion] = useState(false)
  const [mostrarTodosComentarios, setMostrarTodosComentarios] = useState(false)

  // Cargar detalles de la receta
  useEffect(() => {
    if (isOpen && recetaId) {
      cargarDetallesReceta()
    }
  }, [isOpen, recetaId])

  const cargarDetallesReceta = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Cargar detalles de la receta
      const recetaResponse = await apiGet(`receta/${recetaId}`, token)
      setReceta(recetaResponse.data)
      
      // Cargar comentarios y valoraciones en paralelo
      await Promise.all([
        cargarComentarios(token),
        cargarValoraciones(token)
      ])
    } catch (error) {
      console.error('Error cargando detalles:', error)
    } finally {
      setLoading(false)
    }
  }

  const cargarComentarios = async (token) => {
    try {
      const response = await obtenerComentarios(recetaId, token)
      setComentarios(response.data || [])
    } catch (error) {
      // Si es un error 563 (no hay comentarios) o 564 (no hay valoraciones), 
      // simplemente establecer arrays vacíos
      if (error.message.includes('563') || error.message.includes('564')) {
        setComentarios([])
      } else {
        console.error('Error cargando comentarios:', error)
        setComentarios([])
      }
    }
  }

  const cargarValoraciones = async (token) => {
    try {
      const response = await obtenerValoraciones(recetaId, token)
      setValoraciones(response.data || [])
      
      // Buscar mi valoración
      if (user) {
        const miVal = response.data?.find(v => v.usuario?.nombre_usuario === user.nombre_usuario)
        setMiValoracion(miVal)
        if (miVal) {
          setPuntuacionSeleccionada(miVal.valoracion.puntuacion)
        }
      }
    } catch (error) {
      // Si es un error 563 (no hay comentarios) o 564 (no hay valoraciones), 
      // simplemente establecer arrays vacíos
      if (error.message.includes('563') || error.message.includes('564')) {
        setValoraciones([])
      } else {
        console.error('Error cargando valoraciones:', error)
        setValoraciones([])
      }
    }
  }

  const handleEnviarComentario = async () => {
    if (!nuevoComentario.trim() || !user) return
    
    setEnviandoComentario(true)
    try {
      const token = localStorage.getItem('token')
      await crearComentario(recetaId, user.id, nuevoComentario.trim(), token)
      
      setNuevoComentario('')
      await cargarComentarios(token)
    } catch (error) {
      console.error('Error enviando comentario:', error)
    } finally {
      setEnviandoComentario(false)
    }
  }

  const handleEnviarValoracion = async () => {
    if (puntuacionSeleccionada === 0 || !user) return
    
    setEnviandoValoracion(true)
    try {
      const token = localStorage.getItem('token')
      
      if (miValoracion) {
        // Editar valoración existente
        await editarValoracion(miValoracion.valoracion.id, puntuacionSeleccionada, token)
      } else {
        // Crear nueva valoración
        await crearValoracion(recetaId, user.id, puntuacionSeleccionada, token)
      }
      
      // Recargar valoraciones y detalles de la receta
      await Promise.all([
        cargarValoraciones(token),
        cargarDetallesReceta()
      ])
    } catch (error) {
      console.error('Error enviando valoración:', error)
    } finally {
      setEnviandoValoracion(false)
    }
  }

  const handleToggleFavorito = async () => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('token')
      const favoritoId = favoritos[recetaId]
      
      if (favoritoId) {
        await eliminarFavorito(favoritoId, token)
      } else {
        await añadirFavorito(recetaId, user.id, token)
      }
      
      // Recargar detalles de la receta para actualizar contadores
      await cargarDetallesReceta()
      
      // Notificar al componente padre
      onFavoriteToggle && onFavoriteToggle(recetaId)
    } catch (error) {
      console.error('Error toggleando favorito:', error)
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

  if (!isOpen || !receta) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-pavlova-600 text-center">Cargando detalles...</p>
        </div>
      </div>
    )
  }

  const comentariosAMostrar = mostrarTodosComentarios ? comentarios : comentarios.slice(0, 3)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="relative">
          <img
            src={receta.foto_principal || '/images/default-recipe.jpg'}
            alt={receta.titulo}
            className="w-full h-48 sm:h-64 object-cover rounded-t-2xl"
            onError={(e) => {
              e.target.src = '/images/default-recipe.jpg'
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pavlova-600 shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Botón de favorito */}
          <button
            onClick={handleToggleFavorito}
            className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              favoritos[recetaId]
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${favoritos[recetaId] ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-4 sm:p-6">
          <AnimatedContent distance={20} direction="vertical" duration={0.6}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-pavlova-800 mb-2">{receta.titulo}</h2>
                <p className="text-sm sm:text-base text-pavlova-600 mb-4">{receta.descripcion}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getDificultadColor(receta.dificultad)}`}>
                {receta.dificultad}
              </div>
            </div>

            {/* Información de la receta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
              <div className="text-center p-2 sm:p-3 bg-pavlova-50 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pavlova-500 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-pavlova-600">Preparación</p>
                <p className="text-sm sm:text-base font-semibold text-pavlova-800">{formatTime(receta.tiempo_preparacion)}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-pavlova-50 rounded-lg">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-pavlova-500 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-pavlova-600">Cocción</p>
                <p className="text-sm sm:text-base font-semibold text-pavlova-800">{formatTime(receta.tiempo_coccion)}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-pavlova-50 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pavlova-500 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-pavlova-600">Porciones</p>
                <p className="text-sm sm:text-base font-semibold text-pavlova-800">{receta.porciones}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-pavlova-50 rounded-lg">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-pavlova-500 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-pavlova-600">Valoración</p>
                <p className="text-sm sm:text-base font-semibold text-pavlova-800">{receta.promedio_valoraciones || 0}/5</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-pavlova-50 rounded-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pavlova-500 mx-auto mb-1" />
                <p className="text-xs sm:text-sm text-pavlova-600">Favoritos</p>
                <p className="text-sm sm:text-base font-semibold text-pavlova-800">{receta.total_favoritos || 0}</p>
              </div>
            </div>

            {/* Ingredientes */}
            {receta.ingredientes && receta.ingredientes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Ingredientes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {receta.ingredientes.map((ingrediente, index) => (
                    <div key={index} className="flex items-center p-2 bg-pavlova-50 rounded-lg">
                      <div className="w-2 h-2 bg-pavlova-400 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-pavlova-700">
                        {ingrediente.cantidad} {ingrediente.unidad_medida} {ingrediente.nombre}
                        {ingrediente.notas && <span className="text-pavlova-500 text-xs sm:text-sm"> ({ingrediente.notas})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instrucciones */}
            {receta.instrucciones && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pavlova-800 mb-3">Instrucciones</h3>
                <div className="bg-pavlova-50 rounded-lg p-3 sm:p-4 border border-pavlova-200">
                  <div className="prose prose-pavlova max-w-none">
                    {receta.instrucciones.split('\n').map((instruccion, index) => {
                      const trimmedInstruccion = instruccion.trim()
                      if (!trimmedInstruccion) return null
                      
                      return (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-pavlova-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm sm:text-base text-pavlova-700 leading-relaxed flex-1">
                              {trimmedInstruccion}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Sección de valoración */}
            {user && !isOwnRecipe && (
              <div className="mb-6 p-3 sm:p-4 bg-pavlova-50 rounded-lg border border-pavlova-200">
                <h3 className="text-lg font-semibold text-pavlova-800 mb-3">
                  {miValoracion ? 'Editar mi valoración' : 'Valorar esta receta'}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((estrella) => (
                      <button
                        key={estrella}
                        onClick={() => setPuntuacionSeleccionada(estrella)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          estrella <= puntuacionSeleccionada
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base text-pavlova-600 font-medium">
                    {puntuacionSeleccionada > 0 ? `${puntuacionSeleccionada}/5` : 'Selecciona una puntuación'}
                  </span>
                </div>
                <button
                  onClick={handleEnviarValoracion}
                  disabled={puntuacionSeleccionada === 0 || enviandoValoracion}
                  className="px-4 py-2 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {enviandoValoracion ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{miValoracion ? 'Actualizar valoración' : 'Enviar valoración'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Comentarios */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-pavlova-800">
                  Comentarios ({comentarios.length})
                </h3>
                {comentarios.length > 3 && (
                  <button
                    onClick={() => setMostrarTodosComentarios(!mostrarTodosComentarios)}
                    className="text-pavlova-600 hover:text-pavlova-700 text-sm font-medium"
                  >
                    {mostrarTodosComentarios ? 'Mostrar menos' : 'Mostrar más'}
                  </button>
                )}
              </div>
              
              {/* Formulario de comentario */}
              {user && (
                <div className="mb-4 p-3 sm:p-4 bg-pavlova-50 rounded-lg border border-pavlova-200">
                                      <div className="flex space-x-2 sm:space-x-3">
                      <img
                        src={user.foto_perfil || '/images/default-avatar.png'}
                        alt={user.nombre_usuario}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.png'
                        }}
                      />
                      <div className="flex-1">
                        <textarea
                          value={nuevoComentario}
                          onChange={(e) => setNuevoComentario(e.target.value)}
                          placeholder="Escribe un comentario..."
                          className="w-full p-2 sm:p-3 border border-pavlova-200 rounded-lg resize-none focus:ring-2 focus:ring-pavlova-500 focus:border-transparent text-sm sm:text-base"
                          rows="3"
                          maxLength="500"
                        />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-pavlova-500">
                          {nuevoComentario.length}/500 caracteres
                        </span>
                        <button
                          onClick={handleEnviarComentario}
                          disabled={!nuevoComentario.trim() || enviandoComentario}
                          className="px-4 py-2 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          {enviandoComentario ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Comentar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de comentarios */}
              <div className="space-y-4">
                {comentariosAMostrar.length > 0 ? (
                  comentariosAMostrar.map((comentario, index) => (
                    <div key={comentario.id || `comentario-${index}`} className="flex space-x-2 sm:space-x-3 p-3 sm:p-4 bg-pavlova-50 rounded-lg">
                      <img
                        src={comentario.usuario?.foto_perfil || '/images/default-avatar.png'}
                        alt={comentario.usuario?.nombre_usuario}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.png'
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1 space-y-1 sm:space-y-0">
                          <span className="text-sm sm:text-base font-semibold text-pavlova-800">@{comentario.usuario?.nombre_usuario}</span>
                          <span className="text-xs sm:text-sm text-pavlova-500">{formatDate(comentario.fecha_comentario)}</span>
                        </div>
                        <p className="text-sm sm:text-base text-pavlova-700">{comentario.comentario}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-pavlova-500">
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm sm:text-base">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Valoraciones */}
            {valoraciones.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-pavlova-800 mb-3">
                  Valoraciones ({valoraciones.length})
                </h3>
                <div className="space-y-3">
                  {valoraciones.map((valoracion, index) => (
                    <div key={valoracion.valoracion?.id || `valoracion-${index}`} className="flex items-center space-x-2 sm:space-x-3 p-3 bg-pavlova-50 rounded-lg">
                      <img
                        src={valoracion.usuario?.foto_perfil || '/images/default-avatar.png'}
                        alt={valoracion.usuario?.nombre_usuario}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.png'
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                          <span className="text-sm sm:text-base font-semibold text-pavlova-800">@{valoracion.usuario?.nombre_usuario}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < valoracion.valoracion?.puntuacion ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-pavlova-500">{formatDate(valoracion.valoracion?.fecha_valoracion)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatedContent>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailModal 