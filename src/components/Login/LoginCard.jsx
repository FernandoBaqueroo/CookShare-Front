function LoginCard({ children }) {
  const renderLogo = () => (
    <div className="flex items-center justify-center mb-4 space-x-0.5 sm:space-x-1 lg:space-x-2 xl:space-x-3 2xl:space-x-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-800 leading-none">
        C
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-800 leading-none">
        o
      </h1>
      <img 
        src="/images/logo/LogoCookie.png" 
        alt="CookShare Logo" 
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 object-contain -mx-0.5 sm:-mx-0.5 lg:-mx-1 xl:-mx-1 2xl:-mx-1.5"
      />
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-800 leading-none ml-1 sm:ml-1.5 lg:ml-2 xl:ml-2.5 2xl:ml-3">
        k
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-600 leading-none ml-1.5 sm:ml-2 lg:ml-3 xl:ml-4 2xl:ml-5">
        S
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-600 leading-none">
        h
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-600 leading-none">
        a
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-600 leading-none">
        r
      </h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-pavlova-600 leading-none">
        e
      </h1>
    </div>
  )

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12 2xl:mb-16 relative z-10">
        {renderLogo()}
        <p className="text-pavlova-600 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
          Inicia sesión en tu cuenta
        </p>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default LoginCard 