import { LogOut } from 'lucide-react'
import NavbarItem from './NavbarItem'

function NavbarMobile({ menuItems, isActive, onLogout }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-pavlova-100/95 backdrop-blur-md border-t border-pavlova-200/50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4 safe-area-bottom">
        {menuItems.map((item) => (
          <NavbarItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={isActive(item.path)}
            isScrolled={false}
            extraClass="text-xs"
          />
        ))}
      </div>
    </nav>
  )
}

export default NavbarMobile 