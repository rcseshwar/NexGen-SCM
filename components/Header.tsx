
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, AlertTriangle, Box, History, X, LogOut, Settings, Check } from 'lucide-react';
import { AuthContext, SearchContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { globalSearch, setGlobalSearch } = useContext(SearchContext);
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Critical: Stock-out Risk', message: 'Elite Phone Case is below minimum threshold in WH-A1.', time: '5m ago', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 2, title: 'Shipment Delayed', message: 'SHP-902 (Delhi Hub) is delayed by 4 hours.', time: '1h ago', icon: Box, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 3, title: 'New Order Request', message: 'Purchase Order ORD-2291 requires approval.', time: '3h ago', icon: History, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileNav = (path: string) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
      <div className="relative w-96 max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search products, orders, or tracking IDs..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition-all active:scale-95 ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            aria-label="View notifications"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-sm text-slate-900 tracking-tight text-slate-900">System Alerts</span>
                <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3">
                    <div className={`w-10 h-10 ${notif.bg} ${notif.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                      <notif.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                        <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 mt-0.5">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center bg-slate-50/30">
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
                >
                  <Check size={12} /> Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all ${isProfileOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          >
            <div className="relative">
              <img src={user?.avatar} alt="Profile" className="w-9 h-9 rounded-lg object-cover shadow-sm ring-1 ring-slate-200" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <button 
                  onClick={() => handleProfileNav('/settings')}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-lg flex items-center gap-3 text-slate-700"
                >
                  <User size={16} className="text-slate-400" /> My Account
                </button>
                <button 
                  onClick={() => handleProfileNav('/settings')}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium hover:bg-slate-50 rounded-lg flex items-center gap-3 text-slate-700"
                >
                  <Settings size={16} className="text-slate-400" /> Preferences
                </button>
                <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-3"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
