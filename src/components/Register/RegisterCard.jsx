import { UtensilsCrossed } from 'lucide-react'

function RegisterCard({ children }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-2xl xl:rounded-3xl shadow-2xl border border-pavlova-200/50 w-full 2xl:max-w-3xl xl:px-16 2xl:px-24 p-4 sm:p-5 lg:p-5 xl:p-6 2xl:p-8 relative overflow-hidden transition-all duration-500 mx-auto">
      <div className="absolute top-0 left-0 right-0 h-1 lg:h-1.5 xl:h-2 bg-gradient-to-r from-pavlova-400 via-pavlova-500 to-pavlova-600 rounded-t-2xl lg:rounded-t-2xl xl:rounded-t-3xl" />
      
      <div className="text-center mb-3 sm:mb-4 lg:mb-4 xl:mb-5 2xl:mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-gradient-to-br from-pavlova-400 to-pavlova-600 rounded-full mb-2 sm:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4 shadow-lg transition-transform duration-300">
          <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-white" />
        </div>
        <h1 className="text-lg sm:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-pavlova-800 mb-1">
          ¡Únete a CookShare!
        </h1>
        <p className="text-pavlova-600 text-xs sm:text-xs lg:text-xs xl:text-sm px-2">
          Comparte tus recetas favoritas con el mundo
        </p>
      </div>
      {children}
    </div>
  )
}

export default RegisterCard 