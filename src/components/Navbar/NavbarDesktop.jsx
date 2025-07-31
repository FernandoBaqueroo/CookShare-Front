import NavbarItem from './NavbarItem'
import NavbarLogo from './NavbarLogo'
import { LogOut } from 'lucide-react'

function NavbarDesktop({ menuItems, isActive, onLogout }) {
  return (
    <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-md shadow-xl border-r border-pavlova-200/50 z-40">
      <div className="flex flex-col h-full">
        {/* Logo en la parte superior */}
        <div className="p-6 border-b border-pavlova-200/30">
          <NavbarLogo />
        </div>
        
        {/* Menú de navegación */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavbarItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
                isSidebar={true}
              />
            ))}
          </div>
        </div>
        
        {/* Botón de logout en la parte inferior */}
        <div className="p-4 border-t border-pavlova-200/30">
          <button
            onClick={onLogout}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-50 hover:scale-[1.02] text-pavlova-600 hover:text-red-600"
          >
            <div className="relative p-2 rounded-full transition-all duration-300 group-hover:bg-red-100">
              <LogOut className="w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
            </div>
            <span className="font-semibold tracking-wide transition-all duration-300">
              Cerrar sesión
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavbarDesktop 