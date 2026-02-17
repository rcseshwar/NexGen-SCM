
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut,
  Cpu
} from 'lucide-react';
import { AuthContext } from '../App';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.FINANCE] 
    },
    { 
      icon: Package, 
      label: 'Inventory', 
      path: '/inventory', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.WAREHOUSE_MANAGER, UserRole.STOREKEEPER, UserRole.AUDITOR] 
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      path: '/orders', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT, UserRole.FINANCE, UserRole.VENDOR] 
    },
    { 
      icon: Truck, 
      label: 'Logistics', 
      path: '/shipments', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.WAREHOUSE_MANAGER, UserRole.VENDOR] 
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT, UserRole.FINANCE, UserRole.AUDITOR] 
    },
    { 
      icon: Cpu, 
      label: 'AI Engine', 
      path: '/ai-engine', 
      roles: [
        UserRole.ADMIN, 
        UserRole.SCM_MANAGER, 
        UserRole.PROCUREMENT, 
        UserRole.WAREHOUSE_MANAGER, 
        UserRole.STOREKEEPER, 
        UserRole.FINANCE, 
        UserRole.AUDITOR
      ] 
    },
  ];

  const bottomItems = [
    { 
      icon: Users, 
      label: 'Vendors', 
      path: '/vendors', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT] 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings', 
      roles: [UserRole.ADMIN, UserRole.SCM_MANAGER] 
    },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));
  const filteredBottom = bottomItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-white/5">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-lg ring-2 ring-blue-500/20">
          <img 
            src="https://images.squarespace-cdn.com/content/v1/5f8d951916964a1324006c07/1603206240217-1P8A6O0M7N0F3L5T7I5T/EcoPlast+Logo+Circle.png" 
            alt="EcoPlast Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/892/892926.png";
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter leading-none italic text-white uppercase">ECOPLAST</span>
          <span className="text-[8px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Materials</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        {filteredBottom.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
