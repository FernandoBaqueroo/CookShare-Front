import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'
import { 
  ChefHat, Camera, Plus, X, ArrowLeft, ArrowRight, Save, 
  Clock, Users, Star, Tag, Search, Image, FileText, 
  AlertCircle, CheckCircle, Loader2, Upload, Trash2,
  Check, AlertTriangle
} from 'lucide-react'
import AnimatedContent from '../components/Animations/AnimatedContent'
import api from '../functions/api.js'
const { apiGet, apiPost, buscarIngredientes, crearIngrediente } = api

function CrearReceta() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Estados para datos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tiempo_preparacion: '',
    tiempo_coccion: '',
    porciones: '',
    dificultad: '',
    categoria_id: '',
    instrucciones: '',
    foto_principal: null
  })

  // Estados para ingredientes y etiquetas
  const [ingredientes, setIngredientes] = useState([])
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([])
  
  // Estados para datos disponibles
  const [categorias, setCategorias] = useState([])
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([])
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([])
  
  // Estados de UI
  const [pasoActual, setPasoActual] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [animatingStep, setAnimatingStep] = useState(false)
  
  // Estados para búsquedas
  const [busquedaIngrediente, setBusquedaIngrediente] = useState('')
  const [busquedaEtiqueta, setBusquedaEtiqueta] = useState('')
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([])
  const [mostrarDropdownIngredientes, setMostrarDropdownIngredientes] = useState(false)
  const [buscandoIngredientes, setBuscandoIngredientes] = useState(false)
  
  // Estados para crear nuevo ingrediente
  const [showCrearIngredienteModal, setShowCrearIngredienteModal] = useState(false)
  const [nuevoIngrediente, setNuevoIngrediente] = useState({ nombre: '', unidad_medida: '' })
  const [creandoIngrediente, setCreandoIngrediente] = useState(false)

  const totalPasos = 6

  // Unidades de medida comunes
  const unidadesMedida = [
    'unidades', 'gramos', 'ml', 'cucharadas', 'tazas', 
    'kg', 'litros', 'onzas', 'libras', 'pizca', 'al gusto'
  ]

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
            if (!token) {
      return
    }

        // Cargar categorías
        try {
          const categoriasResponse = await apiGet('categorias/lista', token)
          if (categoriasResponse.data) {
            setCategorias(categoriasResponse.data)

          }
        } catch (error) {
          // Continuar sin categorías
        }

        // Cargar etiquetas (tags)
        try {
          const etiquetasResponse = await apiGet('etiquetas/lista', token)
          if (etiquetasResponse.data) {
            setEtiquetasDisponibles(etiquetasResponse.data)

          }
        } catch (error) {
          // Continuar sin etiquetas
        }

      } catch (error) {
        // Error silencioso
      } finally {
        setLoading(false)
      }
    }

    cargarDatosIniciales()
  }, [])

  // Búsqueda asíncrona de ingredientes (versión real del backend)
  const buscarIngredientesAsync = useCallback(async (termino) => {
    if (!termino.trim()) {
      setIngredientesFiltrados([])
      setMostrarDropdownIngredientes(false)
      return
    }

    setBuscandoIngredientes(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIngredientesFiltrados([])
        return
      }

      const response = await buscarIngredientes(termino, token)
      setIngredientesFiltrados(response.data || [])
      setMostrarDropdownIngredientes(true)
    } catch (error) {
      setIngredientesFiltrados([])
    } finally {
      setBuscandoIngredientes(false)
    }
  }, [])

  // Debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarIngredientesAsync(busquedaIngrediente)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [busquedaIngrediente, buscarIngredientesAsync])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Manejar subida de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('DEBUG: Archivo seleccionado:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type)
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto_principal: 'Por favor selecciona una imagen válida' }))
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto_principal: 'La imagen debe ser menor a 5MB' }))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target.result
        console.log('DEBUG: Base64 generado - Longitud:', base64Data.length)
        console.log('DEBUG: Primeros 100 caracteres:', base64Data.substring(0, 100))
        
        setImagePreview(base64Data)
        setFormData(prev => ({
          ...prev,
          foto_principal: base64Data
        }))
        setErrors(prev => ({ ...prev, foto_principal: '' }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Seleccionar ingrediente
  const seleccionarIngrediente = (ingrediente) => {
    const nuevoIngrediente = {
      ingrediente_id: ingrediente.id,
      nombre: ingrediente.nombre,
      unidad_medida: ingrediente.unidad_medida,
      cantidad: 1,
      notas: ''
    }

    setIngredientes(prev => [...prev, nuevoIngrediente])
    setBusquedaIngrediente('')
    setMostrarDropdownIngredientes(false)
    setErrors(prev => ({ ...prev, ingrediente: '' }))
  }

  // Crear nuevo ingrediente (versión real del backend)
  const crearNuevoIngrediente = async () => {
    if (!nuevoIngrediente.nombre.trim() || !nuevoIngrediente.unidad_medida) {
      setErrors(prev => ({ ...prev, nuevoIngrediente: 'Nombre y unidad de medida son requeridos' }))
      return
    }

    setCreandoIngrediente(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setErrors(prev => ({ ...prev, nuevoIngrediente: 'No hay token de autenticación' }))
        return
      }

      const response = await crearIngrediente(nuevoIngrediente.nombre, nuevoIngrediente.unidad_medida, token)
      
      if (response.data) {
        // Agregar el nuevo ingrediente a la lista filtrada
        setIngredientesFiltrados(prev => [...prev, response.data])
        
        // Seleccionar automáticamente el nuevo ingrediente
        seleccionarIngrediente(response.data)
        
        // Limpiar modal
        setNuevoIngrediente({ nombre: '', unidad_medida: '' })
        setShowCrearIngredienteModal(false)
        setErrors(prev => ({ ...prev, nuevoIngrediente: '' }))
        

      }
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        nuevoIngrediente: error.message || 'Error al crear el ingrediente' 
      }))
    } finally {
      setCreandoIngrediente(false)
    }
  }

  // Actualizar ingrediente
  const actualizarIngrediente = (index, field, value) => {
    setIngredientes(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  // Eliminar ingrediente
  const eliminarIngrediente = (index) => {
    setIngredientes(prev => prev.filter((_, i) => i !== index))
  }

  // Toggle etiqueta
  const toggleEtiqueta = (etiquetaId) => {
    setEtiquetasSeleccionadas(prev => 
      prev.includes(etiquetaId)
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    )
  }

  // Validar paso actual
  const validarPaso = (paso) => {
    const nuevosErrores = {}

    switch (paso) {
      case 1: // Información básica
        if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es requerido'
        if (!formData.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es requerida'
        break
      
      case 2: // Tiempos y porciones
        if (!formData.tiempo_preparacion || formData.tiempo_preparacion <= 0) 
          nuevosErrores.tiempo_preparacion = 'El tiempo de preparación debe ser mayor a 0'
        if (!formData.tiempo_coccion || formData.tiempo_coccion <= 0) 
          nuevosErrores.tiempo_coccion = 'El tiempo de cocción debe ser mayor a 0'
        if (!formData.porciones || formData.porciones <= 0) 
          nuevosErrores.porciones = 'Las porciones deben ser mayor a 0'
        break
      
      case 3: // Dificultad y categoría
        if (!formData.dificultad) nuevosErrores.dificultad = 'Selecciona una dificultad'
        if (!formData.categoria_id) nuevosErrores.categoria_id = 'Selecciona una categoría'
        break
      
      case 4: // Ingredientes
        if (ingredientes.length === 0) nuevosErrores.ingredientes = 'Debes agregar al menos un ingrediente'
        break
      
      case 5: // Etiquetas
        if (etiquetasSeleccionadas.length === 0) nuevosErrores.etiquetas = 'Selecciona al menos una etiqueta'
        break
      
      case 6: // Imagen e instrucciones
        if (!formData.foto_principal) nuevosErrores.foto_principal = 'Debes subir una imagen'
        if (!formData.instrucciones.trim()) nuevosErrores.instrucciones = 'Las instrucciones son requeridas'
        break
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Navegar entre pasos con animación
  const siguientePaso = async () => {
    if (validarPaso(pasoActual)) {
      setAnimatingStep(true)
      await new Promise(resolve => setTimeout(resolve, 300)) // Duración de la animación
      setPasoActual(prev => Math.min(prev + 1, totalPasos))
      setAnimatingStep(false)
    }
  }

  const pasoAnterior = async () => {
    setAnimatingStep(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setPasoActual(prev => Math.max(prev - 1, 1))
    setAnimatingStep(false)
  }

  // Crear receta
  const crearReceta = async () => {
    if (!validarPaso(pasoActual)) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      
      const datosReceta = {
        ...formData,
        usuario_id: user.id,
        ingredientes: ingredientes.map(ing => ({
          ingrediente_id: ing.ingrediente_id,
          cantidad: ing.cantidad,
          notas: ing.notas
        })),
        etiquetas: etiquetasSeleccionadas
      }

      console.log('DEBUG: Enviando receta con foto_principal - Longitud:', datosReceta.foto_principal ? datosReceta.foto_principal.length : 0)
      console.log('DEBUG: Primeros 100 caracteres de foto_principal:', datosReceta.foto_principal ? datosReceta.foto_principal.substring(0, 100) : 'null')

      const response = await apiPost('post', datosReceta, token)
      
      if (response.message) {
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          navigate('/perfil')
        }, 2000)
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message || 'Error al crear la receta' }))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pavlova-300 border-t-pavlova-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pavlova-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-white to-pavlova-100 py-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        <AnimatedContent>
          {/* Header de la página */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pavlova-500 rounded-full mb-4 shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-pavlova-800 mb-2">Crear Nueva Receta</h1>
            <p className="text-pavlova-600 text-lg">Comparte tu pasión culinaria con el mundo</p>
          </div>

          {/* Indicador de progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-pavlova-800">Progreso</h2>
              <span className="text-sm text-pavlova-600 font-medium">
                Paso {pasoActual} de {totalPasos}
              </span>
            </div>
            <div className="w-full bg-pavlova-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pavlova-400 to-pavlova-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(pasoActual / totalPasos) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-white rounded-2xl shadow-xl border border-pavlova-200 overflow-hidden">
            {/* Header del paso actual */}
            <div className="bg-gradient-to-r from-pavlova-500 to-pavlova-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{pasoActual}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {pasoActual === 1 && 'Información Básica'}
                    {pasoActual === 2 && 'Tiempos y Porciones'}
                    {pasoActual === 3 && 'Dificultad y Categoría'}
                    {pasoActual === 4 && 'Ingredientes'}
                    {pasoActual === 5 && 'Etiquetas'}
                    {pasoActual === 6 && 'Imagen e Instrucciones'}
                  </h3>
                  <p className="text-pavlova-100 text-sm">
                    {pasoActual === 1 && 'Título y descripción de tu receta'}
                    {pasoActual === 2 && 'Tiempos de preparación y cocción'}
                    {pasoActual === 3 && 'Nivel de dificultad y categoría'}
                    {pasoActual === 4 && 'Lista de ingredientes necesarios'}
                    {pasoActual === 5 && 'Etiquetas para categorizar'}
                    {pasoActual === 6 && 'Imagen y pasos de preparación'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 sm:p-8">
            
              {/* Error general */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Paso 1: Información básica */}
              {pasoActual === 1 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-pavlova-700 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Título de la receta *
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all ${
                          errors.titulo ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                        }`}
                        placeholder="Ej: Pasta Carbonara Casera"
                      />
                      {errors.titulo && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.titulo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-pavlova-700 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Descripción *
                      </label>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all resize-none ${
                          errors.descripcion ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                        }`}
                        placeholder="Describe brevemente tu receta, qué la hace especial..."
                      />
                      {errors.descripcion && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Tiempos y porciones */}
              {pasoActual === 2 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-pavlova-700 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Tiempo de preparación (minutos) *
                        </label>
                        <input
                          type="number"
                          name="tiempo_preparacion"
                          value={formData.tiempo_preparacion}
                          onChange={handleInputChange}
                          min="1"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all ${
                            errors.tiempo_preparacion ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                          }`}
                          placeholder="30"
                        />
                        {errors.tiempo_preparacion && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.tiempo_preparacion}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-pavlova-700 mb-3 flex items-center">
                          <ChefHat className="w-4 h-4 mr-2" />
                          Tiempo de cocción (minutos) *
                        </label>
                        <input
                          type="number"
                          name="tiempo_coccion"
                          value={formData.tiempo_coccion}
                          onChange={handleInputChange}
                          min="1"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all ${
                            errors.tiempo_coccion ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                          }`}
                          placeholder="45"
                        />
                        {errors.tiempo_coccion && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.tiempo_coccion}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-pavlova-700 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Número de porciones *
                      </label>
                      <input
                        type="number"
                        name="porciones"
                        value={formData.porciones}
                        onChange={handleInputChange}
                        min="1"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all ${
                          errors.porciones ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                        }`}
                        placeholder="4"
                      />
                      {errors.porciones && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.porciones}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Dificultad y categoría */}
              {pasoActual === 3 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-pavlova-700 mb-4 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Nivel de dificultad *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['Fácil', 'Intermedio', 'Difícil'].map((dificultad) => (
                          <button
                            key={dificultad}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, dificultad }))
                              if (errors.dificultad) {
                                setErrors(prev => ({ ...prev, dificultad: '' }))
                              }
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.dificultad === dificultad
                                ? 'border-pavlova-500 bg-pavlova-50 shadow-md'
                                : 'border-pavlova-200 hover:border-pavlova-300 hover:bg-pavlova-25'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                formData.dificultad === dificultad
                                  ? 'bg-pavlova-500 text-white'
                                  : 'bg-pavlova-100 text-pavlova-600'
                              }`}>
                                {dificultad === 'Fácil' && <span className="text-sm">1</span>}
                                {dificultad === 'Intermedio' && <span className="text-sm">2</span>}
                                {dificultad === 'Difícil' && <span className="text-sm">3</span>}
                              </div>
                              <span className={`font-medium ${
                                formData.dificultad === dificultad
                                  ? 'text-pavlova-700'
                                  : 'text-pavlova-600'
                              }`}>
                                {dificultad}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.dificultad && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.dificultad}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-pavlova-700 mb-4 flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        Categoría *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categorias.map((categoria) => (
                          <button
                            key={categoria.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, categoria_id: categoria.id }))
                              if (errors.categoria_id) {
                                setErrors(prev => ({ ...prev, categoria_id: '' }))
                              }
                            }}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              formData.categoria_id === categoria.id
                                ? 'border-pavlova-500 bg-pavlova-50 shadow-md'
                                : 'border-pavlova-200 hover:border-pavlova-300 hover:bg-pavlova-25'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                formData.categoria_id === categoria.id
                                  ? 'bg-pavlova-500'
                                  : 'bg-pavlova-300'
                              }`}></div>
                              <span className={`font-medium ${
                                formData.categoria_id === categoria.id
                                  ? 'text-pavlova-700'
                                  : 'text-pavlova-600'
                              }`}>
                                {categoria.nombre}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.categoria_id && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.categoria_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Ingredientes */}
              {pasoActual === 4 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-pavlova-800 mb-4 flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        Buscar y agregar ingredientes
                      </h3>
                      
                      {/* Buscador de ingredientes */}
                      <div className="relative mb-6">
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={busquedaIngrediente}
                              onChange={(e) => setBusquedaIngrediente(e.target.value)}
                              onFocus={() => setMostrarDropdownIngredientes(true)}
                              placeholder="Buscar ingrediente..."
                              className="w-full px-4 py-3 border-2 border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all hover:border-pavlova-400"
                            />
                            {buscandoIngredientes && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-pavlova-400" />
                            )}
                          </div>
                        </div>
                        
                        {/* Dropdown de ingredientes */}
                        {mostrarDropdownIngredientes && (busquedaIngrediente.trim() || ingredientesFiltrados.length > 0) && (
                          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-pavlova-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {ingredientesFiltrados.length > 0 ? (
                              ingredientesFiltrados.map(ingrediente => (
                                <button
                                  key={ingrediente.id}
                                  onClick={() => seleccionarIngrediente(ingrediente)}
                                  className="w-full px-4 py-3 text-left hover:bg-pavlova-50 transition-colors border-b border-pavlova-100 last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-pavlova-800">{ingrediente.nombre}</span>
                                    <span className="text-sm text-pavlova-500 bg-pavlova-100 px-2 py-1 rounded-full">({ingrediente.unidad_medida})</span>
                                  </div>
                                </button>
                              ))
                            ) : busquedaIngrediente.trim() && !buscandoIngredientes ? (
                              <div className="p-4 text-center">
                                <p className="text-pavlova-600 mb-3">No se encontró "{busquedaIngrediente}"</p>
                                <button
                                  onClick={() => {
                                    setNuevoIngrediente({ nombre: busquedaIngrediente, unidad_medida: '' })
                                    setShowCrearIngredienteModal(true)
                                    setMostrarDropdownIngredientes(false)
                                  }}
                                  className="inline-flex items-center space-x-2 px-4 py-2 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Crear "{busquedaIngrediente}"</span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      
                      {errors.ingredientes && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.ingredientes}
                          </p>
                        </div>
                      )}

                      {/* Lista de ingredientes */}
                      <div className="max-h-64 overflow-y-auto border border-pavlova-200 rounded-lg bg-white">
                        <div className="space-y-2 p-3">
                          {ingredientes.map((ingrediente, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pavlova-50 to-pavlova-25 rounded-lg border border-pavlova-200">
                              <div className="flex-1">
                                <p className="font-semibold text-pavlova-800">{ingrediente.nombre}</p>
                                <p className="text-sm text-pavlova-500">{ingrediente.unidad_medida}</p>
                              </div>
                              <input
                                type="number"
                                value={ingrediente.cantidad}
                                onChange={(e) => actualizarIngrediente(index, 'cantidad', e.target.value)}
                                min="1"
                                className="w-20 px-3 py-2 border-2 border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all"
                              />
                              <input
                                type="text"
                                value={ingrediente.notas}
                                onChange={(e) => actualizarIngrediente(index, 'notas', e.target.value)}
                                placeholder="Notas (opcional)"
                                className="flex-1 px-3 py-2 border-2 border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all"
                              />
                              <button
                                onClick={() => eliminarIngrediente(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {ingredientes.length === 0 && (
                            <div className="text-center py-8 text-pavlova-500">
                              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No hay ingredientes agregados</p>
                              <p className="text-xs">Busca y agrega ingredientes arriba</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 5: Etiquetas */}
              {pasoActual === 5 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-pavlova-800 mb-4 flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        Seleccionar etiquetas
                      </h3>
                      
                      <p className="text-pavlova-600 mb-6">Selecciona las etiquetas que mejor describan tu receta. Esto ayudará a otros usuarios a encontrarla.</p>

                      {/* Buscador de etiquetas */}
                      <div className="mb-6">
                        <div className="relative">
                          <input
                            type="text"
                            value={busquedaEtiqueta}
                            onChange={(e) => setBusquedaEtiqueta(e.target.value)}
                            placeholder="Buscar etiquetas..."
                            className="w-full px-4 py-3 border-2 border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all hover:border-pavlova-400"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-400" />
                        </div>
                      </div>

                      {errors.etiquetas && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.etiquetas}
                          </p>
                        </div>
                      )}

                      {/* Lista de etiquetas */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {etiquetasDisponibles
                          .filter(etiqueta => 
                            etiqueta.nombre.toLowerCase().includes(busquedaEtiqueta.toLowerCase())
                          )
                          .map(etiqueta => (
                            <button
                              key={etiqueta.id}
                              onClick={() => toggleEtiqueta(etiqueta.id)}
                              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                                etiquetasSeleccionadas.includes(etiqueta.id)
                                  ? 'border-pavlova-500 bg-pavlova-50 shadow-md'
                                  : 'border-pavlova-200 hover:border-pavlova-300 hover:bg-pavlova-25'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    etiquetasSeleccionadas.includes(etiqueta.id)
                                      ? 'bg-pavlova-500 border-pavlova-500'
                                      : 'border-pavlova-300'
                                  }`}
                                  style={{
                                    backgroundColor: etiquetasSeleccionadas.includes(etiqueta.id) ? etiqueta.color : 'transparent'
                                  }}
                                />
                                <span className={`font-medium text-sm ${
                                  etiquetasSeleccionadas.includes(etiqueta.id)
                                    ? 'text-pavlova-700'
                                    : 'text-pavlova-600'
                                }`}>
                                  {etiqueta.nombre}
                                </span>
                              </div>
                            </button>
                          ))}
                      </div>

                      {/* Etiquetas seleccionadas */}
                      {etiquetasSeleccionadas.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-pavlova-800 mb-3 flex items-center">
                            <Check className="w-4 h-4 mr-2" />
                            Etiquetas seleccionadas ({etiquetasSeleccionadas.length})
                          </h4>
                          <div className="max-h-32 overflow-y-auto border border-pavlova-200 rounded-lg bg-white p-3">
                            <div className="flex flex-wrap gap-2">
                              {etiquetasSeleccionadas.map(etiquetaId => {
                                const etiqueta = etiquetasDisponibles.find(e => e.id === etiquetaId)
                                return etiqueta ? (
                                  <span
                                    key={etiquetaId}
                                    className="inline-flex items-center space-x-2 px-3 py-1 text-sm rounded-full font-medium"
                                    style={{
                                      backgroundColor: `${etiqueta.color}20`,
                                      color: etiqueta.color
                                    }}
                                  >
                                    <span>{etiqueta.nombre}</span>
                                    <button
                                      onClick={() => toggleEtiqueta(etiquetaId)}
                                      className="hover:bg-black/10 rounded-full p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ) : null
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 6: Imagen e instrucciones */}
              {pasoActual === 6 && (
                <div className={`transition-all duration-300 ${animatingStep ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-pavlova-800 mb-4 flex items-center">
                        <Image className="w-5 h-5 mr-2" />
                        Imagen de la receta
                      </h3>
                      
                      <div className="space-y-4">
                        {imagePreview ? (
                          <div className="relative">
                            <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-pavlova-200">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover object-center"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <button
                              onClick={() => {
                                setImagePreview('')
                                setFormData(prev => ({ ...prev, foto_principal: null }))
                              }}
                              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-pavlova-300 rounded-lg p-8 text-center hover:border-pavlova-400 transition-colors">
                            <div className="w-16 h-16 bg-pavlova-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Upload className="w-8 h-8 text-pavlova-500" />
                            </div>
                            <h4 className="text-lg font-semibold text-pavlova-800 mb-2">Subir imagen</h4>
                            <p className="text-pavlova-600 mb-4">Selecciona una imagen atractiva para tu receta</p>
                            <label className="inline-flex items-center px-6 py-3 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 transition-colors cursor-pointer">
                              <Camera className="w-4 h-4 mr-2" />
                              Seleccionar imagen
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                        
                        {errors.foto_principal && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.foto_principal}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-pavlova-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Instrucciones de preparación
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-pavlova-50 rounded-lg border border-pavlova-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-pavlova-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                              <FileText className="w-3 h-3" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-pavlova-700 mb-2">
                                <strong>Consejo:</strong> Escribe cada paso en una línea separada para mejor organización.
                              </p>
                              <p className="text-xs text-pavlova-600">
                                Ejemplo: "1. Calentar el aceite en una sartén\n2. Agregar los ingredientes..."
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <textarea
                          name="instrucciones"
                          value={formData.instrucciones}
                          onChange={handleInputChange}
                          rows={10}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent transition-all resize-none ${
                            errors.instrucciones ? 'border-red-300 bg-red-50' : 'border-pavlova-300 hover:border-pavlova-400'
                          }`}
                          placeholder="Describe paso a paso cómo preparar la receta...

Ejemplo:
1. Calentar el aceite en una sartén grande
2. Agregar la cebolla picada y sofreír hasta que esté transparente
3. Incorporar los demás ingredientes..."
                        />
                        {errors.instrucciones && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.instrucciones}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navegación */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-pavlova-200 bg-gradient-to-r from-pavlova-50 to-transparent -mx-6 -mb-6 px-6 pb-6 space-y-4 sm:space-y-0">
              <button onClick={pasoAnterior} disabled={pasoActual === 1} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 text-pavlova-600 hover:text-pavlova-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-pavlova-100 rounded-lg sm:mr-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Anterior</span>
              </button>
              {pasoActual < totalPasos ? (
                <button onClick={siguientePaso} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-pavlova-500 to-pavlova-600 text-white rounded-lg hover:from-pavlova-600 hover:to-pavlova-700 transition-all shadow-lg hover:shadow-xl sm:ml-4">
                  <span className="font-medium">Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={crearReceta} disabled={submitting} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl sm:ml-4">
                  {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span className="font-medium">Creando...</span></>) : (<><Save className="w-4 h-4" /><span className="font-medium">Crear Receta</span></>)}
                </button>
              )}
            </div>
          </div>
        </AnimatedContent>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="bounce.out"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-pavlova-800 mb-3">¡Receta Creada!</h3>
              <p className="text-pavlova-600 mb-6">Tu receta se ha creado exitosamente y ya está disponible para la comunidad</p>
              <div className="flex justify-center space-x-1 mb-6">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <div className="text-sm text-pavlova-500">
                Redirigiendo a tu perfil...
              </div>
            </div>
          </AnimatedContent>
        </div>
      )}

      {/* Modal para crear ingrediente */}
      {showCrearIngredienteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="bounce.out"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-pavlova-800">Crear Nuevo Ingrediente</h3>
                <button
                  onClick={() => setShowCrearIngredienteModal(false)}
                  className="p-2 text-pavlova-400 hover:text-pavlova-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pavlova-700 mb-2">
                    Nombre del ingrediente *
                  </label>
                  <input
                    type="text"
                    value={nuevoIngrediente.nombre}
                    onChange={(e) => setNuevoIngrediente(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-4 py-3 border border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent"
                    placeholder="Ej: Tomate cherry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-pavlova-700 mb-2">
                    Unidad de medida *
                  </label>
                  <select
                    value={nuevoIngrediente.unidad_medida}
                    onChange={(e) => setNuevoIngrediente(prev => ({ ...prev, unidad_medida: e.target.value }))}
                    className="w-full px-4 py-3 border border-pavlova-300 rounded-lg focus:ring-2 focus:ring-pavlova-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar unidad</option>
                    {unidadesMedida.map(unidad => (
                      <option key={unidad} value={unidad}>
                        {unidad.charAt(0).toUpperCase() + unidad.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {errors.nuevoIngrediente && (
                  <p className="text-sm text-red-600">{errors.nuevoIngrediente}</p>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCrearIngredienteModal(false)}
                    className="flex-1 px-4 py-2 text-pavlova-600 border border-pavlova-300 rounded-lg hover:bg-pavlova-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={crearNuevoIngrediente}
                    disabled={creandoIngrediente}
                    className="flex-1 px-4 py-2 bg-pavlova-500 text-white rounded-lg hover:bg-pavlova-600 disabled:opacity-50 transition-colors"
                  >
                    {creandoIngrediente ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      'Crear Ingrediente'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      )}
    </div>
  )
}

export default CrearReceta 