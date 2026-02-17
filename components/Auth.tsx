
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { UserRole } from '../types';
import { Lock, Mail, ChevronRight, LayoutGrid, Cpu, Boxes, Leaf } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'admin@nexchain.ai', selectedRole);
  };

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 font-sans overflow-hidden">
      {/* Decorative Left Side with EcoPlast Background */}
      <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-12 overflow-hidden eco-industrial-bg">
        <div className="relative z-10 space-y-10 max-w-xl">
          <div className="flex items-center gap-5 animate-float">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 border border-white/20">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/5f8d951916964a1324006c07/1603206240217-1P8A6O0M7N0F3L5T7I5T/EcoPlast+Logo+Circle.png" 
                alt="EcoPlast Brand Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/892/892926.png";
                }}
              />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter italic leading-none">ECOPLAST</h1>
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.4em] mt-2">Materials Innovation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
              A Future <br />
              <span className="text-emerald-400">Re-Manufactured.</span>
            </h2>
            <p className="text-xl text-slate-200/90 leading-relaxed font-medium max-w-lg">
              NexChain's custom workflows for EcoPlast Materials. Tracking recycled high-density products from sorting bins to structural lumber.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Boxes className="text-emerald-400" size={24} />
              </div>
              <h4 className="text-white font-bold mb-1">Circular Flow</h4>
              <p className="text-slate-400 text-sm leading-snug">Real-time tracking of recycled material batches.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="text-blue-400" size={24} />
              </div>
              <h4 className="text-white font-bold mb-1">Logistics AI</h4>
              <p className="text-slate-400 text-sm leading-snug">Automated routing for zero-emission distribution.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Right Side */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-emerald-100">
              Nexus Partner Access
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Enter Platform</h3>
            <p className="text-slate-500 font-medium">
              {isLogin ? "Authorized login for EcoPlast team members" : "Register as a new circular economy partner"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Duty</label>
              <div className="relative">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ')}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="corporate.id@ecoplast.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Pin</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-black py-5 rounded-[28px] hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 text-lg mt-4"
            >
              {isLogin ? 'Access Dashboard' : 'Initiate Registration'}
              <ChevronRight size={22} className="text-emerald-400" />
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-[0.15em] py-2"
            >
              {isLogin ? "Apply for Partner Status" : "Return to Secure Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
