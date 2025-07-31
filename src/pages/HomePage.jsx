import { Link } from 'react-router-dom'
import { Search, Heart, MessageCircle, Users, BookOpen, Star } from 'lucide-react'
import AnimatedContent from '../components/Animations/AnimatedContent'

function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Conecta con otros amantes de la cocina, comparte experiencias y descubre nuevas recetas de chefs de todo el mundo."
    },
    {
      icon: BookOpen,
      title: "Recetas Organizadas",
      description: "Encuentra fácilmente las recetas que buscas con nuestro sistema de categorías y filtros inteligentes."
    },
    {
      icon: Star,
      title: "Calificaciones Reales",
      description: "Lee reseñas auténticas de otros cocineros y califica las recetas que pruebes para ayudar a la comunidad."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pavlova-400/20 to-pavlova-600/20" />
        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={1.2}
              ease="bounce.out"
              initialOpacity={0.3}
              scale={0.8}
              delay={0.2}
            >
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/images/logo/LogoCookie.png" 
                  alt="CookShare Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain mr-1"
                />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pavlova-800">
                  CookShare
                </h1>
              </div>
            </AnimatedContent>
            
            <AnimatedContent
              distance={100}
              direction="vertical"
              duration={1}
              ease="power3.out"
              initialOpacity={0}
              delay={0.4}
            >
              <p className="text-xl sm:text-2xl lg:text-3xl text-pavlova-700 mb-4 max-w-3xl mx-auto">
                Comparte y descubre las mejores recetas de cocina
              </p>
            </AnimatedContent>
            
            <AnimatedContent
              distance={100}
              direction="vertical"
              duration={1}
              ease="power3.out"
              initialOpacity={0}
              delay={0.6}
            >
              <p className="text-lg sm:text-xl text-pavlova-600 mb-8 max-w-2xl mx-auto">
                Únete a nuestra comunidad gastronómica donde los amantes de la cocina comparten sus creaciones favoritas
              </p>
            </AnimatedContent>
            
            {/* Botones de acción */}
            <AnimatedContent
              distance={150}
              direction="vertical"
              duration={1.2}
              ease="bounce.out"
              initialOpacity={0.2}
              scale={1.1}
              delay={0.8}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-pavlova-500 to-pavlova-600 hover:from-pavlova-600 hover:to-pavlova-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-lift"
                >
                  Únete gratis
                </Link>
                <Link
                  to="/login"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white text-pavlova-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pavlova-200 hover-lift"
                >
                  Inicia sesión
                </Link>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </header>

      {/* Sección de características */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            delay={0.2}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pavlova-800 mb-6">
                ¿Por qué elegir CookShare?
              </h2>
              <p className="text-xl text-pavlova-600 max-w-3xl mx-auto">
                Una plataforma digital diseñada para entusiastas de la cocina que quieren compartir y descubrir recetas de forma fácil y organizada
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedContent
                key={index}
                distance={150}
                direction="horizontal"
                reverse={index % 2 === 0}
                duration={1.2}
                ease="bounce.out"
                initialOpacity={0.2}
                scale={1.1}
                delay={0.4 + (index * 0.2)}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pavlova-200/50 hover:border-pavlova-300 hover-lift">
                  <div className="bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto transition-transform duration-300 hover:scale-110">
                    <feature.icon className="w-8 h-8 text-white transition-transform duration-300 hover:rotate-12" />
                  </div>
                  <h3 className="text-xl font-bold text-pavlova-800 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-pavlova-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de descripción detallada */}
      <section className="py-16 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedContent
              distance={100}
              direction="vertical"
              duration={1.2}
              ease="power3.out"
              initialOpacity={0.3}
              scale={0.9}
              delay={0.2}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-pavlova-200/50">
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  delay={0.5}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-pavlova-800 mb-8 text-center">
                    El corazón de CookShare
                  </h2>
                </AnimatedContent>
                
                <div className="space-y-8">
                  <AnimatedContent
                    distance={200}
                    direction="horizontal"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0.2}
                    delay={0.7}
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-pavlova-700 mb-4">
                          Feed principal cronológico
                        </h3>
                        <p className="text-pavlova-600 leading-relaxed">
                          Nuestro feed principal muestra las recetas publicadas por la comunidad ordenadas por recencia, 
                          permitiéndote explorar libremente el contenido y descubrir nuevas inspiraciones culinarias.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-2xl p-6 w-full lg:w-64 h-48 flex items-center justify-center">
                        <Search className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </AnimatedContent>

                  <AnimatedContent
                    distance={200}
                    direction="horizontal"
                    reverse={true}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0.2}
                    delay={0.9}
                  >
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-pavlova-700 mb-4">
                          Filtros inteligentes
                        </h3>
                        <p className="text-pavlova-600 leading-relaxed">
                          Utiliza nuestros filtros inteligentes para encontrar recetas específicas. 
                          Filtra por ingredientes que tengas disponibles o busca por palabras clave para tipos de platos particulares.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-2xl p-6 w-full lg:w-64 h-48 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </AnimatedContent>

                  <AnimatedContent
                    distance={200}
                    direction="horizontal"
                    reverse={false}
                    duration={1.2}
                    ease="power3.out"
                    initialOpacity={0.2}
                    delay={1.1}
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-pavlova-700 mb-4">
                          Interacción y comunidad
                        </h3>
                        <p className="text-pavlova-600 leading-relaxed">
                          Cada receta tiene su página dedicada donde puedes calificarla con un sistema de estrellas, 
                          dejar comentarios sobre tus experiencias y ver las opiniones de otros cocineros. 
                          Esta interacción fomenta un entorno colaborativo para compartir consejos, modificaciones y resultados.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-2xl p-6 w-full lg:w-64 h-48 flex items-center justify-center">
                        <MessageCircle className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </AnimatedContent>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1.2}
            ease="bounce.out"
            initialOpacity={0.3}
            scale={0.9}
            delay={0.2}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pavlova-800 mb-6">
              ¿Listo para empezar?
            </h2>
          </AnimatedContent>
          
          <AnimatedContent
            distance={100}
            direction="vertical"
            duration={1}
            ease="power3.out"
            initialOpacity={0}
            delay={0.5}
          >
            <p className="text-xl text-pavlova-600 mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad y comienza a compartir tus recetas favoritas con el mundo
            </p>
          </AnimatedContent>
          
          <AnimatedContent
            distance={150}
            direction="vertical"
            duration={1.2}
            ease="bounce.out"
            initialOpacity={0.2}
            scale={1.1}
            delay={0.8}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-pavlova-500 to-pavlova-600 hover:from-pavlova-600 hover:to-pavlova-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-lift"
              >
                Crear cuenta gratis
              </Link>
              <Link
                to="/login"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-pavlova-700 font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pavlova-200 hover-lift"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </AnimatedContent>
        </div>
      </section>
    </div>
  )
}

export default HomePage 