import { User, UserCircle, Mail, Lock, Eye, EyeOff, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'

function RegisterForm({ formData, setFormData, showPassword, setShowPassword, focusedField, setFocusedField, handleSubmit }) {
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 lg:space-y-3 xl:space-y-4 2xl:space-y-6">
      {/* Campo Nombre de Usuario */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 lg:pl-3 xl:pl-3 2xl:pl-4 flex items-center pointer-events-none transition-all duration-300">
          <User className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-pavlova-700" />
        </div>
        <input
          type="text"
          name="nombre_usuario"
          placeholder="Nombre de usuario"
          value={formData.nombre_usuario}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('nombre_usuario')}
          onBlur={() => setFocusedField('')}
          className={`w-full pl-10 sm:pl-10 lg:pl-10 xl:pl-11 2xl:pl-12 pr-3 sm:pr-3 lg:pr-3 xl:pr-3 2xl:pr-4 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 2xl:py-4 bg-white/50 border-2 rounded-xl 2xl:rounded-2xl text-pavlova-800 placeholder-pavlova-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm lg:text-sm xl:text-sm 2xl:text-base ${
            focusedField === 'nombre_usuario' 
              ? 'border-pavlova-500 bg-white/70' 
              : 'border-pavlova-200 hover:border-pavlova-300'
          }`}
          required
        />
      </div>
      {/* Campo Nombre Completo */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 lg:pl-3 xl:pl-3 2xl:pl-4 flex items-center pointer-events-none transition-all duration-300">
          <UserCircle className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-pavlova-700" />
        </div>
        <input
          type="text"
          name="nombre_completo"
          placeholder="Nombre completo"
          value={formData.nombre_completo}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('nombre_completo')}
          onBlur={() => setFocusedField('')}
          className={`w-full pl-10 sm:pl-10 lg:pl-10 xl:pl-11 2xl:pl-12 pr-3 sm:pr-3 lg:pr-3 xl:pr-3 2xl:pr-4 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 2xl:py-4 bg-white/50 border-2 rounded-xl 2xl:rounded-2xl text-pavlova-800 placeholder-pavlova-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm lg:text-sm xl:text-sm 2xl:text-base ${
            focusedField === 'nombre_completo' 
              ? 'border-pavlova-500 bg-white/70' 
              : 'border-pavlova-200 hover:border-pavlova-300'
          }`}
          required
        />
      </div>
      {/* Campo Email */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 lg:pl-3 xl:pl-3 2xl:pl-4 flex items-center pointer-events-none transition-all duration-300">
          <Mail className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-pavlova-700" />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          className={`w-full pl-10 sm:pl-10 lg:pl-10 xl:pl-11 2xl:pl-12 pr-3 sm:pr-3 lg:pr-3 xl:pr-3 2xl:pr-4 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 2xl:py-4 bg-white/50 border-2 rounded-xl 2xl:rounded-2xl text-pavlova-800 placeholder-pavlova-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm lg:text-sm xl:text-sm 2xl:text-base ${
            focusedField === 'email' 
              ? 'border-pavlova-500 bg-white/70' 
              : 'border-pavlova-200 hover:border-pavlova-300'
          }`}
          required
        />
      </div>
      {/* Campo Contraseña */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 lg:pl-3 xl:pl-3 2xl:pl-4 flex items-center pointer-events-none transition-all duration-300">
          <Lock className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-pavlova-700" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          className={`w-full pl-10 sm:pl-10 lg:pl-10 xl:pl-11 2xl:pl-12 pr-10 sm:pr-10 lg:pr-10 xl:pr-10 2xl:pr-12 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 2xl:py-4 bg-white/50 border-2 rounded-xl 2xl:rounded-2xl text-pavlova-800 placeholder-pavlova-400 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-sm lg:text-sm xl:text-sm 2xl:text-base ${
            focusedField === 'password' 
              ? 'border-pavlova-500 bg-white/70' 
              : 'border-pavlova-200 hover:border-pavlova-300'
          }`}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-3 lg:pr-3 xl:pr-3 2xl:pr-4 flex items-center text-pavlova-500 hover:text-pavlova-700 transition-colors duration-200"
        >
          {showPassword ? <EyeOff className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" /> : <Eye className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />}
        </button>
      </div>
      {/* Botón de registro */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pavlova-500 to-pavlova-600 text-white font-bold py-2 sm:py-2.5 lg:py-2.5 xl:py-3 2xl:py-4 px-4 2xl:px-6 rounded-xl 2xl:rounded-2xl hover:from-pavlova-600 hover:to-pavlova-700 transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pavlova-300 relative overflow-hidden group text-sm lg:text-sm xl:text-sm 2xl:text-base"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <UtensilsCrossed className="w-4 h-4 sm:w-4 sm:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
          Crear mi cuenta
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pavlova-600 to-pavlova-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </form>
  )
}

export default RegisterForm; 