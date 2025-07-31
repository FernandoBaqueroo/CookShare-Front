import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { User, Mail, UserCircle, Camera, Lock, Eye, EyeOff, Save, X, Edit3, LogOut, Upload, Trash2, Shield, Settings, Palette, Bell, Globe, AlertTriangle } from 'lucide-react'
import AnimatedContent from '../components/Animations/AnimatedContent'
import api from '../functions/api.js'
const { apiGet, apiPut, uploadProfileImage } = api

function UserProfileEdit() {
  const { logout, user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(true) // Cambiado a true para mostrar directamente
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'success' | 'error'
  const [modalMessage, setModalMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'security', 'preferences'
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    nombre_completo: '',
    bio: '',
    foto_perfil: '',
    telefono: ''
  })
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    password_nuevo: '',
    password_confirmar: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Estados para foto de perfil
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  
  // Estados de validación
  const [focusedField, setFocusedField] = useState('')
  const [errors, setErrors] = useState({})

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const result = await apiGet('perfil', token)
      const userData = result.data
      
      setFormData({
        nombre_usuario: userData.nombre_usuario || '',
        email: userData.email || '',
        nombre_completo: userData.nombre_completo || '',
        bio: userData.bio || '',
        foto_perfil: userData.foto_perfil || '',
        telefono: userData.telefono || ''
      })
      // Usar la URL completa de la imagen para la vista previa
      setImagePreview(userData.foto_perfil || '')

    } catch (error) {
      setModalType('error')
      setModalMessage('Error al cargar los datos del perfil')
      setShowModal(true)
    }
  }

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Activar el modo de cambio de contraseña si el usuario empieza a escribir
    if (value && !isChangingPassword) {
      setIsChangingPassword(true)
    }
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(formData.foto_perfil || '')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre_usuario.trim()) {
      newErrors.nombre_usuario = 'El nombre de usuario es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre completo es requerido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordChange = () => {
    const newErrors = {}
    
    if (!passwordData.password_actual) {
      newErrors.password_actual = 'La contraseña actual es requerida'
    }
    
    if (!passwordData.password_nuevo) {
      newErrors.password_nuevo = 'La nueva contraseña es requerida'
    } else if (passwordData.password_nuevo.length < 6) {
      newErrors.password_nuevo = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!passwordData.password_confirmar) {
      newErrors.password_confirmar = 'Confirma la nueva contraseña'
    } else if (passwordData.password_nuevo !== passwordData.password_confirmar) {
      newErrors.password_confirmar = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateForm()) return

    // Validar cambio de contraseña si se está cambiando
    if (isChangingPassword && !validatePasswordChange()) {
      return
    }

    // Validar que el usuario esté disponible
    if (!user || !user.id) {
      setModalType('error')
      setModalMessage('Error: Usuario no autenticado')
      setShowModal(true)
      return
    }
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      const updateData = {
        nombre_usuario: formData.nombre_usuario,
        nombre_completo: formData.nombre_completo,
        email: formData.email,
        bio: formData.bio,
        telefono: formData.telefono
      }
      
      // Agregar contraseña si se está cambiando
      if (isChangingPassword && passwordData.password_nuevo) {
        updateData.password_actual = passwordData.password_actual
        updateData.password_nuevo = passwordData.password_nuevo
        updateData.password_confirmar = passwordData.password_confirmar
      }
      
      // Si hay una imagen seleccionada, subirla
      if (selectedImage) {
        setIsUploadingImage(true)
        try {
          const response = await uploadProfileImage(selectedImage, token, user.id)
  
          
          // Verificar que la respuesta tenga los datos esperados
          if (response && response.data && response.data.foto_url) {
            // Construir la URL completa para la vista previa
            const fotoUrl = response.data.foto_url
            const baseUrl = window.location.origin
            const fullUrl = baseUrl + fotoUrl
            
            // Actualizar la vista previa con la URL completa
            setImagePreview(fullUrl)
            
            // Extraer solo el nombre del archivo para guardar en formData
            const filename = fotoUrl.split('/').pop() // Obtiene "1.jpg" de "/api/images/profiles/1.jpg"
            setFormData(prev => ({
              ...prev,
              foto_perfil: filename
            }))
            
            // Actualizar el usuario en el contexto para que se refleje inmediatamente
            await updateUser()
            
          } else {
            // Respuesta inesperada del servidor
            setModalType('error')
            setModalMessage('Error: Respuesta inesperada del servidor')
            setShowModal(true)
            return
          }
        } catch (uploadError) {
          setModalType('error')
          setModalMessage('Error de red al subir la imagen')
          setShowModal(true)
          return
        } finally {
          setIsUploadingImage(false)
        }
      }
      
      // Actualizar los datos del perfil
      await sendUpdateRequest(updateData, token)
      
    } catch (error) {
      setModalType('error')
      setModalMessage(error.message)
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Función auxiliar para convertir imagen a base64
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Error al convertir imagen'))
      reader.readAsDataURL(imageFile)
    })
  }

  const sendUpdateRequest = async (updateData, token) => {
    try {
      const result = await apiPut('perfil', updateData, token)
      
      // Actualizar el usuario en el contexto
      await updateUser()
      
      setModalType('success')
      setModalMessage(result.message || 'Perfil actualizado correctamente')
      setShowModal(true)
      setIsEditing(false)
      setIsChangingPassword(false)
      setSelectedImage(null)
      
      // Recargar datos actualizados
      await loadUserData()
      
      // Limpiar datos de contraseña
      setPasswordData({
        password_actual: '',
        password_nuevo: '',
        password_confirmar: ''
      })
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar el perfil')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsChangingPassword(false)
    setSelectedImage(null)
    setImagePreview(formData.foto_perfil)
    setErrors({})
    setPasswordData({
      password_actual: '',
      password_nuevo: '',
      password_confirmar: ''
    })
    loadUserData()
  }

  const handleLogout = () => {
    logout()
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'preferences', label: 'Preferencias', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 pt-20 lg:pt-8 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={1.2}
          ease="bounce.out"
          initialOpacity={0.2}
          scale={0.9}
        >
          <div className="max-w-6xl mx-auto overflow-x-hidden">
            {/* Header con navegación */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pavlova-200/50 mb-8 overflow-x-hidden">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Foto de perfil con opciones avanzadas */}
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-pavlova-200 shadow-lg">
                    <img
                      src={imagePreview || formData.foto_perfil || '/images/logo/LogoCookie.png'}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/logo/LogoCookie.png'
                      }}
                    />
                  </div>
                  
                  {isEditing && (
                    <>
                      <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      
                      {imagePreview && imagePreview !== formData.foto_perfil && (
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {/* Información básica */}
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-pavlova-800 mb-2 break-words">
                    {formData.nombre_completo || 'Mi Perfil'}
                  </h1>
                  <p className="text-lg text-pavlova-600 mb-4 break-words">
                    @{formData.nombre_usuario}
                  </p>
                  <p className="text-pavlova-500 mb-6 break-words">
                    {formData.bio || 'Sin biografía'}
                  </p>
                  
                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-pavlova-500 to-pavlova-600 hover:from-pavlova-600 hover:to-pavlova-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar perfil
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading || isUploadingImage}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap shadow-lg"
                        >
                          <Save className="w-4 h-4" />
                          {isLoading || isUploadingImage ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs de navegación */}
            {isEditing && (
              <AnimatedContent
                distance={50}
                direction="vertical"
                duration={0.8}
                ease="power3.out"
                initialOpacity={0}
                delay={0.2}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-pavlova-200/50 mb-8">
                  <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                          activeTab === tab.id
                            ? 'bg-pavlova-500 text-white shadow-lg'
                            : 'text-pavlova-600 hover:bg-pavlova-100 hover:text-pavlova-800'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedContent>
            )}

            {/* Contenido de las tabs */}
            {isEditing && (
              <AnimatedContent
                distance={100}
                direction="vertical"
                duration={1}
                ease="power3.out"
                initialOpacity={0}
                delay={0.4}
              >
                {activeTab === 'profile' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pavlova-200/50 mb-8 overflow-x-hidden">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-pavlova-100 rounded-xl">
                        <User className="w-6 h-6 text-pavlova-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-pavlova-800">Información personal</h2>
                        <p className="text-pavlova-600">Actualiza tu información de perfil</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Información básica */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-pavlova-700 border-b border-pavlova-200 pb-2">
                          Información básica
                        </h3>
                        
                        {/* Nombre de usuario */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                            Nombre de usuario *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                            <input
                              type="text"
                              name="nombre_usuario"
                              value={formData.nombre_usuario}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('nombre_usuario')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-10 pr-4 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                                focusedField === 'nombre_usuario' 
                                  ? 'border-pavlova-500 bg-white/70' 
                                  : 'border-pavlova-200 hover:border-pavlova-300'
                              } ${errors.nombre_usuario ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.nombre_usuario && (
                            <p className="text-red-500 text-sm mt-1">{errors.nombre_usuario}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                            Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-10 pr-4 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                                focusedField === 'email' 
                                  ? 'border-pavlova-500 bg-white/70' 
                                  : 'border-pavlova-200 hover:border-pavlova-300'
                              } ${errors.email ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>

                        {/* Nombre completo */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                            Nombre completo *
                          </label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                            <input
                              type="text"
                              name="nombre_completo"
                              value={formData.nombre_completo}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('nombre_completo')}
                              onBlur={() => setFocusedField('')}
                              className={`w-full pl-10 pr-4 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] ${
                                focusedField === 'nombre_completo' 
                                  ? 'border-pavlova-500 bg-white/70' 
                                  : 'border-pavlova-200 hover:border-pavlova-300'
                              } ${errors.nombre_completo ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.nombre_completo && (
                            <p className="text-red-500 text-sm mt-1">{errors.nombre_completo}</p>
                          )}
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-pavlova-700 border-b border-pavlova-200 pb-2">
                          Información adicional
                        </h3>
                        
                        {/* Biografía */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                            Biografía
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('bio')}
                            onBlur={() => setFocusedField('')}
                            rows={4}
                            placeholder="Cuéntanos sobre ti, tus pasiones culinarias..."
                            className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] resize-none ${
                              focusedField === 'bio' 
                                ? 'border-pavlova-500 bg-white/70' 
                                : 'border-pavlova-200 hover:border-pavlova-300'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pavlova-200/50 mb-8 overflow-x-hidden">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Shield className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-pavlova-800">Seguridad</h2>
                        <p className="text-pavlova-600">Gestiona la seguridad de tu cuenta</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Cambio de contraseña */}
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Lock className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-pavlova-800">Cambiar contraseña</h3>
                            <p className="text-pavlova-600 text-sm">Actualiza tu contraseña para mantener tu cuenta segura</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Contraseña actual */}
                          <div className="relative">
                            <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                              Contraseña actual
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                              <input
                                type={showPasswords.actual ? 'text' : 'password'}
                                name="password_actual"
                                value={passwordData.password_actual}
                                onChange={handlePasswordChange}
                                className={`w-full pl-10 pr-12 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] border-pavlova-200 hover:border-pavlova-300 ${
                                  errors.password_actual ? 'border-red-500' : ''
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, actual: !prev.actual }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pavlova-500 hover:text-pavlova-700"
                              >
                                {showPasswords.actual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.password_actual && (
                              <p className="text-red-500 text-sm mt-1">{errors.password_actual}</p>
                            )}
                          </div>

                          {/* Nueva contraseña */}
                          <div className="relative">
                            <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                              Nueva contraseña
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                              <input
                                type={showPasswords.nuevo ? 'text' : 'password'}
                                name="password_nuevo"
                                value={passwordData.password_nuevo}
                                onChange={handlePasswordChange}
                                className={`w-full pl-10 pr-12 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] border-pavlova-200 hover:border-pavlova-300 ${
                                  errors.password_nuevo ? 'border-red-500' : ''
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, nuevo: !prev.nuevo }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pavlova-500 hover:text-pavlova-700"
                              >
                                {showPasswords.nuevo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.password_nuevo && (
                              <p className="text-red-500 text-sm mt-1">{errors.password_nuevo}</p>
                            )}
                          </div>

                          {/* Confirmar nueva contraseña */}
                          <div className="relative lg:col-span-2">
                            <label className="block text-sm font-semibold text-pavlova-700 mb-2">
                              Confirmar nueva contraseña
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pavlova-500" />
                              <input
                                type={showPasswords.confirmar ? 'text' : 'password'}
                                name="password_confirmar"
                                value={passwordData.password_confirmar}
                                onChange={handlePasswordChange}
                                className={`w-full pl-10 pr-12 py-3 bg-white/50 border-2 rounded-xl text-pavlova-800 transition-all duration-300 focus:outline-none focus:scale-[1.02] border-pavlova-200 hover:border-pavlova-300 ${
                                  errors.password_confirmar ? 'border-red-500' : ''
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pavlova-500 hover:text-pavlova-700"
                              >
                                {showPasswords.confirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {errors.password_confirmar && (
                              <p className="text-red-500 text-sm mt-1">{errors.password_confirmar}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Información de seguridad */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-pavlova-800">Información de seguridad</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-pavlova-600">Último inicio de sesión: Hoy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-pavlova-600">Verificación de email: Activa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pavlova-200/50 mb-8 overflow-x-hidden">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Settings className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-pavlova-800">Preferencias</h2>
                        <p className="text-pavlova-600">Personaliza tu experiencia en CookShare</p>
                      </div>
                    </div>
                    
                    {/* Mensaje Beta */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-800">Función en Beta</h3>
                          <p className="text-yellow-700 text-sm">Las preferencias están en desarrollo. Las funciones de notificaciones y privacidad no están activas en esta versión.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6 opacity-50">
                      {/* Notificaciones */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Bell className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-pavlova-800">Notificaciones</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-pavlova-800">Notificaciones de nuevos seguidores</p>
                              <p className="text-sm text-pavlova-600">Recibe alertas cuando alguien te siga</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                              <input type="checkbox" className="sr-only peer" disabled />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-pavlova-800">Notificaciones de likes</p>
                              <p className="text-sm text-pavlova-600">Recibe alertas cuando alguien likee tus recetas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                              <input type="checkbox" className="sr-only peer" disabled />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-pavlova-800">Notificaciones de comentarios</p>
                              <p className="text-sm text-pavlova-600">Recibe alertas cuando alguien comente en tus recetas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                              <input type="checkbox" className="sr-only peer" disabled />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Privacidad */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Shield className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-pavlova-800">Privacidad</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-pavlova-800">Perfil público</p>
                              <p className="text-sm text-pavlova-600">Permite que otros usuarios vean tu perfil</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                              <input type="checkbox" className="sr-only peer" disabled />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-pavlova-800">Mostrar email</p>
                              <p className="text-sm text-pavlova-600">Permite que otros usuarios vean tu email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-not-allowed">
                              <input type="checkbox" className="sr-only peer" disabled />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatedContent>
            )}
          </div>
        </AnimatedContent>
      </div>

      {/* Modal de notificación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            scale={0.9}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border-2 border-pavlova-200">
              <div className={`rounded-full p-4 mb-4 shadow-lg flex items-center justify-center ${
                modalType === 'success' 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-gradient-to-br from-red-400 to-red-600'
              }`}>
                {modalType === 'success' ? (
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h2 className={`text-xl font-bold mb-2 text-center ${
                modalType === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {modalType === 'success' ? '¡Éxito!' : 'Error'}
              </h2>
              
              <p className={`text-center mb-4 ${
                modalType === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {modalMessage}
              </p>
              
              <button
                onClick={() => setShowModal(false)}
                className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  modalType === 'success'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Cerrar
              </button>
            </div>
          </AnimatedContent>
        </div>
      )}
    </div>
  )
}

export default UserProfileEdit 