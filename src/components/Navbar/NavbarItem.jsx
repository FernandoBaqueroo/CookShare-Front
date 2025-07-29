import { Link } from 'react-router-dom'

function NavbarItem({ to, icon: Icon, label, active, extraClass = "", isSidebar = false }) {
  const getLinkClasses = () => {
    if (isSidebar) {
      const baseClasses = 'group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]'
      const colorClasses = active ? 'text-pavlova-800 bg-pavlova-100/50' : 'text-pavlova-600 hover:text-pavlova-800 hover:bg-pavlova-50'
      return `${baseClasses} ${colorClasses} ${extraClass}`
    } else {
      const baseClasses = 'group flex flex-col items-center gap-1 xl:gap-2 transition-all duration-300 hover:scale-105'
      const colorClasses = active ? 'text-pavlova-800' : 'text-pavlova-600 hover:text-pavlova-800'
      return `${baseClasses} ${colorClasses} ${extraClass}`
    }
  }

  const getIconContainerClasses = () => {
    if (isSidebar) {
      const baseClasses = 'relative p-2 rounded-full transition-all duration-300'
      return active 
        ? `${baseClasses} bg-white/60 backdrop-blur-sm shadow-sm border border-white/40` 
        : `${baseClasses} group-hover:bg-white/40 backdrop-blur-sm border border-transparent group-hover:border-white/30`
    } else {
      const baseClasses = 'relative p-1.5 xl:p-2 rounded-full transition-all duration-300'
      return active 
        ? `${baseClasses} bg-white/40 backdrop-blur-sm shadow-sm border border-white/30` 
        : `${baseClasses} group-hover:bg-white/30 backdrop-blur-sm border border-transparent group-hover:border-white/20`
    }
  }

  const getIconSize = () => {
    if (isSidebar) {
      return active ? 'w-6 h-6' : 'w-5 h-5'
    } else {
      return active ? 'w-6 h-6 xl:w-7 xl:h-7' : 'w-5 h-5 xl:w-6 xl:h-6'
    }
  }

  const getLabelClasses = () => {
    if (isSidebar) {
      const baseClasses = 'font-semibold tracking-wide transition-all duration-300'
      const opacityClasses = active ? 'opacity-100' : 'opacity-90'
      return `${baseClasses} ${opacityClasses}`
    } else {
      const baseClasses = 'font-semibold tracking-wide transition-all duration-300'
      const sizeClasses = active ? 'text-base xl:text-lg' : 'text-sm xl:text-base'
      const opacityClasses = active ? 'opacity-100' : 'opacity-90'
      return `${baseClasses} ${sizeClasses} ${opacityClasses}`
    }
  }

  return (
    <Link to={to} className={getLinkClasses()}>
      <div className={getIconContainerClasses()}>
        <Icon className={`transition-all duration-300 hover:rotate-12 ${getIconSize()}`} />
        {active && !isSidebar && (
          <div className="absolute -bottom-1 xl:-bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pavlova-700 rounded-full animate-pulse-slow" />
        )}
      </div>
      <span className={getLabelClasses()}>
        {label}
      </span>
    </Link>
  )
}

export default NavbarItem 