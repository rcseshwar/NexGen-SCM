
import React, { useContext, useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Save, Globe, Smartphone, Truck, Info, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../App';
import { UserRole } from '../types';

const Settings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, roles: Object.values(UserRole) },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: Object.values(UserRole) },
    { id: 'security', label: 'Security', icon: Shield, roles: Object.values(UserRole) },
    { id: 'scm', label: 'SCM Config', icon: Database, roles: [UserRole.ADMIN, UserRole.SCM_MANAGER] },
  ];

  const filteredTabs = tabs.filter(tab => user && tab.roles.includes(user.role));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            System Settings <SettingsIcon className="text-blue-500" />
          </h1>
          <p className="text-slate-500">Manage your preferences and organization parameters</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img src={user?.avatar} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 shadow-md" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{user?.name}</h4>
                  <p className="text-slate-500">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Display Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-medium" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-medium" defaultValue={user?.email} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scm' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
              <h4 className="text-xl font-bold flex items-center gap-2 text-slate-900">Global SCM Parameters</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800">Auto-Reorder System</p>
                    <p className="text-xs text-slate-500">Generate POs automatically when stock hits thresholds</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
