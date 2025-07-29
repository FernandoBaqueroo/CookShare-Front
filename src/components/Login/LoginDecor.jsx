function LoginDecor() {
  return (
    <>
      {/* Círculos flotantes más pequeños y elegantes */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-pavlova-300/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-pavlova-400/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-20 h-20 bg-pavlova-500/25 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-14 h-14 bg-pavlova-300/40 rounded-full animate-bounce"></div>
      
      {/* Líneas decorativas sutiles */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-pavlova-400/30 to-transparent"></div>
      <div className="absolute bottom-1/4 right-0 w-32 h-px bg-gradient-to-l from-transparent via-pavlova-400/30 to-transparent"></div>
      
      {/* Puntos decorativos */}
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pavlova-600/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-pavlova-600/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      
      {/* Formas geométricas sutiles */}
      <div className="absolute top-1/2 left-5 w-8 h-8 border-2 border-pavlova-400/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-1/2 right-5 w-6 h-6 border-2 border-pavlova-300/30 rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
    </>
  )
}

export default LoginDecor 