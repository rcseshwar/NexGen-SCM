
import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Shipments from './components/Shipments';
import Analytics from './components/Analytics';
import Vendors from './components/Vendors';
import Settings from './components/Settings';
import AIEngine from './components/AIEngine';
import Auth from './components/Auth';
import MobileApp from './components/MobileApp';
import { User, UserRole } from './types';

// Mock Auth Context
export const AuthContext = React.createContext<{
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {}
});

// Search Context
export const SearchContext = createContext<{
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
}>({
  globalSearch: '',
  setGlobalSearch: () => {}
});

// AI Configuration Context
export type AIProvider = 'gemini' | 'openai';
export const AIConfigContext = createContext<{
  provider: AIProvider;
  setProvider: (p: AIProvider) => void;
  openAiKey: string;
  setOpenAiKey: (k: string) => void;
}>({
  provider: 'gemini',
  setProvider: () => {},
  openAiKey: '',
  setOpenAiKey: () => {}
});

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles: UserRole[] }> = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const defaultPath = user.role === UserRole.VENDOR ? '/orders' : 
                        user.role === UserRole.PROCUREMENT ? '/orders' :
                        user.role === UserRole.WAREHOUSE_MANAGER ? '/inventory' : '/';
    return <Navigate to={defaultPath} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // AI Config State
  const [provider, setProvider] = useState<AIProvider>(() => {
    return (localStorage.getItem('nexchain_ai_provider') as AIProvider) || 'gemini';
  });
  const [openAiKey, setOpenAiKey] = useState(() => {
    return localStorage.getItem('nexchain_openai_key') || '';
  });

  useEffect(() => {
    const stored = localStorage.getItem('nexchain_user');
    if (stored) setUser(JSON.parse(stored));
    
    const checkMobile = () => setIsMobileMode(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem('nexchain_ai_provider', provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('nexchain_openai_key', openAiKey);
  }, [openAiKey]);

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://picsum.photos/seed/${email}/200`
    };
    setUser(newUser);
    localStorage.setItem('nexchain_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexchain_user');
  };

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <Auth />
      </AuthContext.Provider>
    );
  }

  if (isMobileMode || user.role === UserRole.FIELD_STAFF || user.role === UserRole.STOREKEEPER) {
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        <AIConfigContext.Provider value={{ provider, setProvider, openAiKey, setOpenAiKey }}>
          <MobileApp />
        </AIConfigContext.Provider>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <SearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
        <AIConfigContext.Provider value={{ provider, setProvider, openAiKey, setOpenAiKey }}>
          <HashRouter>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.FINANCE]}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.WAREHOUSE_MANAGER, UserRole.STOREKEEPER, UserRole.AUDITOR]}>
                        <Inventory />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT, UserRole.FINANCE, UserRole.VENDOR]}>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    <Route path="/shipments" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.WAREHOUSE_MANAGER, UserRole.VENDOR]}>
                        <Shipments />
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT, UserRole.FINANCE, UserRole.AUDITOR]}>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendors" element={
                      <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SCM_MANAGER, UserRole.PROCUREMENT]}>
                        <Vendors />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai-engine" element={
                      <ProtectedRoute roles={[
                        UserRole.ADMIN, 
                        UserRole.SCM_MANAGER, 
                        UserRole.PROCUREMENT, 
                        UserRole.WAREHOUSE_MANAGER, 
                        UserRole.STOREKEEPER, 
                        UserRole.FINANCE, 
                        UserRole.AUDITOR
                      ]}>
                        <AIEngine />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute roles={Object.values(UserRole)}>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </HashRouter>
        </AIConfigContext.Provider>
      </SearchContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
