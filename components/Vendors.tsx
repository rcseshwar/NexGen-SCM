
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { 
  Users, Search, Filter, Plus, Star, Phone, Globe, ShieldCheck, 
  X, Mail, MapPin, Building2, CheckCircle2, AlertCircle, TrendingUp,
  ExternalLink, MessageSquare, History, Loader2, Check
} from 'lucide-react';
import { Vendor } from '../types';
import { SearchContext } from '../App';

const initialVendors: Vendor[] = [
  { id: 'V-001', name: 'Global Logistics Inc', category: 'Logistics', rating: 4.8, onTimeRate: 98, contact: 'contact@globallog.com', status: 'Active' },
  { id: 'V-002', name: 'TechRetail Corp', category: 'Distributor', rating: 4.2, onTimeRate: 92, contact: 'ops@techretail.io', status: 'Under Review' },
  { id: 'V-003', name: 'AAJ Supply Chain Management', category: 'Supplier', rating: 3.9, onTimeRate: 85, contact: 'sales@aaj.net', status: 'Active' },
  { id: 'V-004', name: 'DHL', category: 'Logistics', rating: 4.5, onTimeRate: 95, contact: 'dispatch@DHL.com', status: 'Active' },
  { id: 'V-005', name: 'TVS Supply Chain Solutions (TVS SCS)', category: 'Supplier', rating: 4.9, onTimeRate: 99, contact: 'info@tvs.com', status: 'Active' },
];

const Vendors: React.FC = () => {
  const { globalSearch } = useContext(SearchContext);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Action states
  const [isRenewing, setIsRenewing] = useState(false);
  const [isConnectingChat, setIsConnectingChat] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Form state for new vendor
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({
    name: '',
    category: 'Supplier',
    contact: '',
    status: 'Active'
  });

  const categories = ['All', 'Supplier', 'Logistics', 'Distributor'];

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const combinedSearch = (searchTerm + ' ' + globalSearch).trim().toLowerCase();
      const matchesSearch = combinedSearch === '' ||
                          v.name.toLowerCase().includes(combinedSearch) || 
                          v.contact.toLowerCase().includes(combinedSearch) ||
                          v.category.toLowerCase().includes(combinedSearch);
      const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchTerm, globalSearch, activeCategory]);

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name) return;

    const newVendor: Vendor = {
      id: `V-00${vendors.length + 1}`,
      name: vendorForm.name || '',
      category: (vendorForm.category as any) || 'Supplier',
      rating: 0,
      onTimeRate: 0,
      contact: vendorForm.contact || '',
      status: (vendorForm.status as any) || 'Active',
    };

    setVendors([newVendor, ...vendors]);
    setIsAddModalOpen(false);
    setVendorForm({ name: '', category: 'Supplier', contact: '', status: 'Active' });
    showNotification(`Partner ${newVendor.name} registered successfully!`, 'success');
  };

  const handleChatWithPartner = () => {
    if (isConnectingChat) return;
    setIsConnectingChat(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnectingChat(false);
      showNotification(`Secure channel established with ${selectedVendor?.name}. Redirecting to Advisor...`, 'info');
    }, 1500);
  };

  const handleRenewAgreement = () => {
    if (isRenewing) return;
    setIsRenewing(true);
    
    // Simulate renewal process
    setTimeout(() => {
      setIsRenewing(false);
      showNotification(`Service Agreement for ${selectedVendor?.name} has been renewed for 12 months.`, 'success');
    }, 2000);
  };

  const showNotification = (message: string, type: 'success' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-8 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-right-8 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-blue-600 border-blue-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <MessageSquare size={20} />}
          <span className="font-bold text-sm">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-black/10 rounded-full p-1"><X size={14} /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            Supply Chain Partners <Users className="text-blue-500" />
          </h1>
          <p className="text-slate-500">Manage vendors, distributors, and logistics providers</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Globe size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Partners</p>
            <h3 className="text-2xl font-bold text-slate-900">{vendors.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Star size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Performance</p>
            <h3 className="text-2xl font-bold text-slate-900">4.6 / 5.0</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Rate</p>
            <h3 className="text-2xl font-bold text-slate-900">98.2%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or contact..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 relative">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/10' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
          {filteredVendors.length > 0 ? filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              onClick={() => setSelectedVendor(vendor)}
              className="group relative bg-white border border-slate-100 hover:border-blue-400 p-8 rounded-[32px] transition-all hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                  <Building2 size={32} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {vendor.status}
                </span>
              </div>
              
              <h4 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{vendor.name}</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 mb-6 flex items-center gap-1">
                <ShieldCheck size={12} className="text-blue-500" />
                {vendor.category} Partners Program
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reliability</p>
                  <p className="font-bold text-slate-800 text-sm">{vendor.onTimeRate}% OTD</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                  <div className="flex items-center justify-end gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold text-sm text-slate-800">{vendor.rating || 'New'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${vendor.contact}`; }}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center group/btn"
                >
                  <Mail size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setSelectedVendor(vendor)}
                  className="flex-1 text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white p-3 rounded-2xl transition-all text-center"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Partners Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">Adjust your filters or try a different search term to find partners.</p>
            </div>
          )}
        </div>
      </div>

      {/* Partner Detail Drawer */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedVendor(null)}></div>
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{selectedVendor.name}</h3>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Verified {selectedVendor.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-900/10">
                  <div className="flex items-center justify-between mb-4 text-blue-400">
                    <TrendingUp size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
                  </div>
                  <h4 className="text-3xl font-bold">{selectedVendor.onTimeRate}%</h4>
                  <p className="text-xs text-slate-400 mt-2">On-Time Fulfillment Rate</p>
                </div>
                <div className="p-6 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-600/10">
                  <div className="flex items-center justify-between mb-4 text-blue-200">
                    <Star size={20} fill="currentColor" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Quality Score</span>
                  </div>
                  <h4 className="text-3xl font-bold">{selectedVendor.rating || 'N/A'}</h4>
                  <p className="text-xs text-blue-100 mt-2">Global Vendor Benchmark</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" /> Contact Repository
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{selectedVendor.contact}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">Tech Park B, District 4</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History size={16} className="text-slate-400" /> Audit Log
                </h5>
                <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {[
                    { event: 'Performance Review Completed', date: 'Oct 12, 2025', status: 'Positive' },
                    { event: 'Contract Renewal Signed', date: 'Aug 24, 2025', status: 'Neutral' },
                    { event: 'Onboarding Initialized', date: 'Jan 10, 2025', status: 'Neutral' }
                  ].map((log, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-6 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{log.event}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/30">
              <button 
                disabled={isConnectingChat}
                onClick={handleChatWithPartner}
                className={`flex-1 py-4 border rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 ${
                  isConnectingChat ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isConnectingChat ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    Chat with Partner
                  </>
                )}
              </button>
              <button 
                disabled={isRenewing}
                onClick={handleRenewAgreement}
                className={`flex-1 py-4 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                  isRenewing ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                {isRenewing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Renewing...
                  </>
                ) : (
                  <>
                    <History size={18} />
                    Renew Agreement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Users className="text-blue-600" /> Register Global Partner
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-800"
                    placeholder="e.g. Acme Logistics"
                    value={vendorForm.name}
                    onChange={e => setVendorForm({...vendorForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-800"
                    value={vendorForm.category}
                    onChange={e => setVendorForm({...vendorForm, category: e.target.value as any})}
                  >
                    <option>Supplier</option>
                    <option>Logistics</option>
                    <option>Distributor</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="email" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-800"
                      placeholder="operations@partner.com"
                      value={vendorForm.contact}
                      onChange={e => setVendorForm({...vendorForm, contact: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-5 bg-blue-600 text-white font-bold rounded-3xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/20"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
