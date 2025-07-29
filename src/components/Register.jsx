import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import RegisterCard from './Register/RegisterCard'
import RegisterForm from './Register/RegisterForm'
import RegisterDecor from './Register/RegisterDecor'
import AnimatedContent from './Animations/AnimatedContent'

function Register() {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre_completo: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await register(
        formData.nombre_usuario, 
        formData.nombre_completo, 
        formData.email, 
        formData.password
      )
      setResult(response)
      setError('')
      setShowModal(true)
      
      if (response) {
        setTimeout(() => {
          navigate('/feed')
        }, 2000)
      }
    } catch (err) {
      setResult(null)
      setError(err.message || 'Error en el registro')
      setShowModal(true)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    if (result) {
      navigate('/feed')
    }
  }

  const renderModalContent = () => {
    if (result && !error) {
      return (
        <>
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.8}
            ease="bounce.out"
            initialOpacity={0.3}
            scale={0.8}
          >
            <div className="bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-full p-4 mb-4 shadow-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </AnimatedContent>
          
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            delay={0.2}
          >
            <h2 className="text-xl font-bold text-pavlova-700 mb-2 text-center">
              ¡Registro exitoso!
            </h2>
          </AnimatedContent>
          
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            delay={0.4}
          >
            <p className="text-pavlova-600 text-center mb-4">
              Tu cuenta ha sido creada correctamente.<br/>Serás redirigido al feed en unos segundos.
            </p>
          </AnimatedContent>
          
          <AnimatedContent
            distance={150}
            direction="vertical"
            duration={1.2}
            ease="bounce.out"
            initialOpacity={0.2}
            scale={1.1}
            delay={0.6}
          >
            <button onClick={handleModalClose} className="mt-2 px-4 py-2 rounded-lg bg-pavlova-500 hover:bg-pavlova-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover-lift">
              Ir al feed
            </button>
          </AnimatedContent>
        </>
      )
    }
    
    return (
      <>
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="bounce.out"
          initialOpacity={0.3}
          scale={0.8}
        >
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full p-4 mb-4 shadow-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </AnimatedContent>
        
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          delay={0.2}
        >
          <h2 className="text-xl font-bold text-red-700 mb-2 text-center">
            Error en el registro
          </h2>
        </AnimatedContent>
        
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={1}
          ease="power3.out"
          initialOpacity={0}
          delay={0.4}
        >
          <p className="text-red-600 text-center mb-4">{error || 'Ha ocurrido un error inesperado.'}</p>
        </AnimatedContent>
        
        <AnimatedContent
          distance={150}
          direction="vertical"
          duration={1.2}
          ease="bounce.out"
          initialOpacity={0.2}
          scale={1.1}
          delay={0.6}
        >
          <button onClick={() => setShowModal(false)} className="mt-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover-lift">
            Cerrar
          </button>
        </AnimatedContent>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <RegisterDecor />
      
      <AnimatedContent
        distance={200}
        direction="vertical"
        duration={1.2}
        ease="bounce.out"
        initialOpacity={0.2}
        scale={0.9}
        delay={0.2}
      >
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl 2xl:max-w-2xl flex items-center justi1fy-center mx-auto">
          <RegisterCard>
            <RegisterForm
              formData={formData}
              setFormData={setFormData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              handleSubmit={handleSubmit}
            />
            
            <AnimatedContent
              distance={100}
              direction="vertical"
              duration={1}
              ease="power3.out"
              initialOpacity={0}
              delay={0.4}
            >
              <div className="text-center mt-3 sm:mt-4 lg:mt-4 xl:mt-5 2xl:mt-8 pt-2.5 sm:pt-3 lg:pt-3 xl:pt-4 2xl:pt-6 border-t border-pavlova-200/50">
                <p className="text-pavlova-600 text-xs sm:text-xs lg:text-xs xl:text-xs 2xl:text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <Link 
                    to="/login" 
                    className="text-pavlova-700 font-semibold hover:text-pavlova-900 transition-colors duration-200 hover:underline"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </AnimatedContent>
          </RegisterCard>
        </div>
      </AnimatedContent>
      
      {showModal && (
        <AnimatedContent
          distance={100}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          scale={0.9}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs sm:max-w-sm w-full flex flex-col items-center border-2 border-pavlova-200">
              {renderModalContent()}
            </div>
          </div>
        </AnimatedContent>
      )}
      
      <div className="lg:hidden h-20" />
    </div>
  )
}

export default Register 