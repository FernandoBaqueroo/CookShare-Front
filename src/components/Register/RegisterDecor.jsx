import { UtensilsCrossed, Sparkles, Heart } from 'lucide-react'

function RegisterDecor() {
  return (
    <>
      {/* Elementos decorativos animados - Solo desktop */}
      <div className="hidden lg:block absolute top-20 left-20 animate-bounce delay-100">
        <UtensilsCrossed className="w-8 h-8 text-pavlova-400/30" />
      </div>
      <div className="hidden lg:block absolute top-20 right-20 animate-pulse delay-300">
        <Sparkles className="w-6 h-6 text-pavlova-500/40" />
      </div>
      <div className="hidden lg:block absolute bottom-20 left-20 animate-bounce delay-500">
        <Heart className="w-7 h-7 text-pavlova-600/30" />
      </div>
      <div className="hidden lg:block absolute bottom-20 right-20 animate-pulse delay-700">
        <UtensilsCrossed className="w-9 h-9 text-pavlova-400/25" />
      </div>
      {/* Círculos decorativos flotantes - Responsive */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-32 md:h-32 bg-pavlova-300/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-20 h-20 md:w-40 md:h-40 bg-pavlova-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </>
  )
}

export default RegisterDecor; 