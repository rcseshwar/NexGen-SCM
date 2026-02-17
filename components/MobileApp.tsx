
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { 
  Scan, 
  Package, 
  MapPin, 
  CheckCircle2, 
  History, 
  Camera, 
  User, 
  LogOut,
  ChevronRight,
  Bell,
  ArrowLeft,
  Search,
  Box,
  CornerDownRight,
  Navigation,
  X,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ShieldAlert,
  Truck,
  Leaf,
  Check,
  Cpu,
  Zap,
  Key
} from 'lucide-react';
import { AuthContext } from '../App';
import { UserRole } from '../types';

type ActionView = 'home' | 'inbound' | 'locate' | 'notifications' | 'activity';

const MobileApp: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('home');
  const [activeView, setActiveView] = useState<ActionView>('home');
  const [showScanner, setShowScanner] = useState(false);
  const [scannerPurpose, setScannerPurpose] = useState<'generic' | 'locate' | 'inbound'>('generic');
  const [locatedItem, setLocatedItem] = useState<{sku: string, zone: string, bin: string} | null>(null);
  const [hasUnread, setHasUnread] = useState(true);

  const permissions = useMemo(() => ({
    [UserRole.ADMIN]: ['inbound', 'locate', 'activity', 'notifications'],
    [UserRole.SCM_MANAGER]: ['inbound', 'locate', 'activity', 'notifications'],
    [UserRole.WAREHOUSE_MANAGER]: ['inbound', 'locate', 'activity', 'notifications'],
    [UserRole.STOREKEEPER]: ['inbound', 'locate', 'activity', 'notifications'],
    [UserRole.FIELD_STAFF]: ['inbound', 'notifications'],
    [UserRole.AUDITOR]: ['locate', 'activity'],
    [UserRole.VENDOR]: ['inbound'],
    [UserRole.PROCUREMENT]: ['notifications'],
    [UserRole.FINANCE]: [],
  }), []);

  const hasAccess = (view: string) => {
    if (!user) return false;
    const allowed = permissions[user.role] || [];
    return allowed.includes(view);
  };

  const navigateToView = (view: ActionView) => {
    if (view === 'home' || hasAccess(view)) {
      if (view === 'notifications') setHasUnread(false);
      setActiveView(view);
    } else {
      alert("Access Restricted: Duty role insufficient.");
    }
  };

  const handleScanTrigger = (purpose: 'generic' | 'locate' | 'inbound') => {
    setScannerPurpose(purpose);
    setShowScanner(true);
    setTimeout(() => {
      setShowScanner(false);
      if (purpose === 'locate') {
        setLocatedItem({ sku: 'ECO-POST-784', zone: 'Material Zone B', bin: 'Bay 04, Rack 2' });
        setActiveView('locate');
      }
    }, 2500);
  };

  const notifications = [
    { id: 1, title: 'Batch Alert', message: 'Recycled HDPE Batch #441 exceeds moisture threshold.', time: '10m ago', icon: AlertTriangle, color: 'text-amber-400' },
    { id: 2, title: 'Inbound Delivery', message: 'Truck NEX-42 has entered Yard A.', time: '1h ago', icon: Truck, color: 'text-emerald-400' },
  ];

  const renderHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="relative group overflow-hidden rounded-[32px] p-8 border border-white/10 bg-[#0a1020] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-14 h-14 bg-white rounded-full p-2 shadow-[0_0_25px_rgba(255,255,255,0.3)] ring-2 ring-emerald-500/20">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/5f8d951916964a1324006c07/1603206240217-1P8A6O0M7N0F3L5T7I5T/EcoPlast+Logo+Circle.png" 
                  alt="EcoPlast" 
                  className="w-full h-full object-contain"
                />
             </div>
             <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Duty Verified</p>
                <h2 className="text-2xl font-black text-white leading-none italic uppercase tracking-tighter">EcoPlast HUD</h2>
             </div>
          </div>
        </div>

        <div className="mt-10 space-y-6 relative z-10">
           <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Active Hub</p>
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight">MUMBAI NORTH NODE</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="glass-hud p-4 rounded-2xl border border-white/5">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Batch Queue</p>
                 <span className="text-2xl font-black text-white">42</span>
              </div>
              <div className="glass-hud p-4 rounded-2xl border border-white/5">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Material Flow</p>
                 <span className="text-2xl font-black text-emerald-400">98%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigateToView('inbound')}
          className="group relative h-44 overflow-hidden rounded-[32px] glass-hud active:scale-95 transition-all p-6 flex flex-col justify-between border border-white/5"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Package size={28} />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-0.5">Inbound</p>
            <h4 className="text-lg font-black text-white tracking-tight">Receipt Hub</h4>
          </div>
        </button>
        <button 
          onClick={() => navigateToView('locate')}
          className="group relative h-44 overflow-hidden rounded-[32px] glass-hud active:scale-95 transition-all p-6 flex flex-col justify-between border border-white/5"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-400">
            <MapPin size={28} />
          </div>
          <div>
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-0.5">Asset</p>
            <h4 className="text-lg font-black text-white tracking-tight">Locator AI</h4>
          </div>
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigateToView('home')} className="p-4 glass-hud rounded-2xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Eco-Alerts</h3>
      </div>
      <div className="space-y-4">
        {notifications.map(notif => (
          <div key={notif.id} className="glass-hud p-6 rounded-[32px] border border-white/5 flex items-start gap-5">
            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${notif.color}`}>
              <notif.icon size={28} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-black text-white text-lg leading-tight">{notif.title}</p>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{notif.time}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInbound = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigateToView('home')} className="p-4 glass-hud rounded-2xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Receipt Hub</h3>
      </div>
      <div className="glass-hud p-8 rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4">
         <Truck size={48} className="text-emerald-400 mx-auto" />
         <h4 className="text-xl font-black text-white">Awaiting Verification</h4>
         <p className="text-sm text-slate-400 px-6">3 Haulers in Yard A requiring circularity certification.</p>
         <button onClick={() => handleScanTrigger('inbound')} className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest text-xs">Initialize Dock Scan</button>
      </div>
    </div>
  );

  const renderScanner = () => (
    <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
         <div className="scanner-line"></div>
         <div className="mobile-grid-bg absolute inset-0"></div>
      </div>
      <div className="relative z-10 text-center space-y-10 w-full max-w-xs">
         <div className="w-64 h-64 border-2 border-emerald-500/30 rounded-[64px] mx-auto flex items-center justify-center relative bg-emerald-500/5 backdrop-blur-sm">
            <Scan size={80} className="text-emerald-400 animate-pulse" />
         </div>
         <div className="space-y-2">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Initializing Scan</h3>
            <p className="text-emerald-400 font-bold mono-font text-[10px] tracking-[0.4em] uppercase">Syncing with NexChain Node...</p>
         </div>
         <button onClick={() => setShowScanner(false)} className="px-8 py-4 glass-hud rounded-2xl text-white font-black text-xs uppercase tracking-widest">Abort Sync</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen futuristic-dark text-white font-sans max-w-md mx-auto relative overflow-hidden flex flex-col border-x border-white/5 shadow-2xl">
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px]"></div>
      
      <div className="p-8 pb-12 sticky top-0 z-40 bg-transparent flex items-center justify-between">
         <div className="flex items-center gap-4">
            <img src={user?.avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-2xl" />
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Session Active</p>
              <h1 className="text-xl font-black text-white tracking-tighter leading-none italic uppercase">{user?.name.split(' ')[0]}</h1>
            </div>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => navigateToView('notifications')}
              className={`w-12 h-12 glass-hud rounded-2xl flex items-center justify-center transition-all active:scale-90 relative ${activeView === 'notifications' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              <Bell size={22} />
              {hasUnread && <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050810]"></span>}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-32">
        {activeView === 'home' && renderHome()}
        {activeView === 'inbound' && renderInbound()}
        {activeView === 'notifications' && renderNotifications()}
        {activeView === 'locate' && locatedItem && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-8 pb-20">
             <div className="flex items-center gap-3 mb-2">
                <button onClick={() => navigateToView('home')} className="p-3 glass-hud rounded-2xl text-slate-400">
                   <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Asset Lock</h2>
             </div>
             <div className="glass-hud p-10 rounded-[48px] border border-white/5 text-center space-y-6">
                <Cpu size={48} className="text-blue-400 mx-auto animate-pulse" />
                <div>
                   <h3 className="text-3xl font-black text-white tracking-tighter italic">{locatedItem.sku}</h3>
                   <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-2">Circularity ID Verified</p>
                </div>
                <div className="grid grid-cols-1 gap-3 pt-6">
                   <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Zone</span>
                      <span className="text-sm font-black text-white">{locatedItem.zone}</span>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Node</span>
                      <span className="text-sm font-black text-white">{locatedItem.bin}</span>
                   </div>
                </div>
             </div>
             <button onClick={() => handleScanTrigger('locate')} className="w-full py-6 bg-emerald-600 rounded-3xl text-white font-black text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">Scan Next Asset</button>
          </div>
        )}
        {(activeView === 'activity') && (
          <div className="py-20 text-center space-y-6">
             <History size={48} className="text-slate-700 mx-auto" />
             <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Secure Log Syncing...</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-6 pb-8">
         <div className="glass-hud p-4 rounded-[40px] flex justify-between items-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => navigateToView('home')} 
              className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all ${activeView === 'home' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-slate-500 hover:text-white'}`}
            >
               <Package size={24} />
            </button>
            <div className="relative -top-12">
               <button 
                 onClick={() => handleScanTrigger('generic')}
                 className="w-20 h-20 bg-[#0a1020] rounded-[30px] border-4 border-[#050810] flex items-center justify-center shadow-2xl active:scale-90 transition-all"
               >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                     <Scan size={32} />
                  </div>
               </button>
            </div>
            <button onClick={logout} className="w-14 h-14 rounded-[24px] flex items-center justify-center text-slate-500 hover:text-rose-500">
               <LogOut size={24} />
            </button>
         </div>
      </div>

      {showScanner && renderScanner()}
    </div>
  );
};

export default MobileApp;
