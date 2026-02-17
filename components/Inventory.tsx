
import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { 
  Package, Search, Filter, Plus, ChevronRight, AlertCircle, 
  Sparkles, BrainCircuit, X, Check, Trash2, Edit3, 
  BarChart2, MapPin, IndianRupee, History, Cpu, Settings
} from 'lucide-react';
import { Product, UserRole } from '../types';
import { runAnalysis } from '../services/aiService';
import { SearchContext, AIConfigContext, AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

const initialProducts: Product[] = [
  { id: '1', sku: 'E-RPP-12', name: 'Recycled Plastic Panels', category: 'Interior & Infrastructure', stockLevel: 45000, minThreshold: 10000, maxThreshold: 100000, price: 1650.00, location: 'WH-A1-22', status: 'In Stock' },
  { id: '2', sku: 'W-PSP-75', name: 'Plastic Shuttering Ply/Panels', category: 'Structural & Foundation', stockLevel: 1200, minThreshold: 5000, maxThreshold: 50000, price: 1375.00, location: 'WH-B2-05', status: 'Low Stock' },
  { id: '3', sku: 'M-PPB-15', name: 'Plastic Paver Blocks', category: 'Interior & Infrastructure', stockLevel: 120000, minThreshold: 10000, maxThreshold: 80000, price: 250.00, location: 'WH-A4-10', status: 'Overstock' },
  { id: '4', sku: 'S-PWC-10', name: 'Plastic-Wood Composite Cladding', category: 'Walls & Roofing', stockLevel: 8500, minThreshold: 2000, maxThreshold: 20000, price: 135.00, location: 'WH-C1-15', status: 'In Stock' },
];

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { globalSearch } = useContext(SearchContext);
  const { provider, openAiKey } = useContext(AIConfigContext);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  
  // Detail Panel State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const filterRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Interior & Infrastructure',
    stockLevel: 0,
    minThreshold: 0,
    maxThreshold: 0,
    price: 0,
    location: '',
  });

  // Categories & Statuses for filter
  const categories = ['All', 'Interior & Infrastructure', 'Walls & Roofing', 'Furniture', 'Structural & Foundation'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Overstock'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAiInsights = async () => {
    setIsAiLoading(true);
    try {
      const result = await runAnalysis('inventory', products, { provider, openAiKey });
      setAiInsights(result);
    } catch (error: any) {
      alert(`NexBot Intelligence Error: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setProductForm({
      name: '',
      sku: '',
      category: 'Interior & Infrastructure',
      stockLevel: 0,
      minThreshold: 0,
      maxThreshold: 0,
      price: 0,
      location: '',
    });
    setIsModalOpen(true);
  };

  const openEditModalFromDrawer = () => {
    if (!selectedProduct) return;
    
    const productToEdit = {
      id: selectedProduct.id,
      name: selectedProduct.name || '',
      sku: selectedProduct.sku || '',
      category: selectedProduct.category || 'Interior & Infrastructure',
      stockLevel: selectedProduct.stockLevel ?? 0,
      minThreshold: selectedProduct.minThreshold ?? 0,
      maxThreshold: selectedProduct.maxThreshold ?? 0,
      price: selectedProduct.price ?? 0,
      location: selectedProduct.location || '',
    };

    setEditingId(selectedProduct.id);
    setProductForm(productToEdit);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku) return;

    const stock = Number(productForm.stockLevel) || 0;
    const min = Number(productForm.minThreshold) || 0;
    const max = Number(productForm.maxThreshold) || 0;

    let status: Product['status'] = 'In Stock';
    if (stock <= 0) status = 'Out of Stock';
    else if (stock < min) status = 'Low Stock';
    else if (stock > max) status = 'Overstock';

    const processedProduct: Product = {
      ...(productForm as Product),
      id: editingId || Math.random().toString(36).substr(2, 9),
      status,
      stockLevel: stock,
      minThreshold: min,
      maxThreshold: max,
      price: Number(productForm.price) || 0,
      location: productForm.location || 'Unassigned',
    };

    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? processedProduct : p));
      if (selectedProduct?.id === editingId) setSelectedProduct(processedProduct);
    } else {
      setProducts(prev => [processedProduct, ...prev]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    if (confirm(`Are you sure you want to delete SKU: ${selectedProduct.sku}?`)) {
      const idToDelete = selectedProduct.id;
      setProducts(prev => prev.filter(p => p.id !== idToDelete));
      setSelectedProduct(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const combinedSearch = (searchTerm + ' ' + globalSearch).trim().toLowerCase();
      const matchesSearch = combinedSearch === '' || 
                          p.name.toLowerCase().includes(combinedSearch) || 
                          p.sku.toLowerCase().includes(combinedSearch) ||
                          p.location.toLowerCase().includes(combinedSearch);
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesStatus = activeStatus === 'All' || p.status === activeStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, globalSearch, activeCategory, activeStatus]);

  const resetFilters = () => {
    setActiveCategory('All');
    setActiveStatus('All');
    setSearchTerm('');
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            Inventory Central <Package className="text-blue-500" />
          </h1>
          <p className="text-slate-500">Manage stock levels, thresholds, and warehousing</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchAiInsights}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-all shadow-sm"
          >
            {isAiLoading ? <div className="animate-spin h-4 w-4 border-2 border-indigo-700 border-t-transparent rounded-full" /> : <Sparkles size={18} />}
            AI Optimization
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Add SKU
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-300">
          <div className="p-4 bg-white/20 rounded-2xl">
            <BrainCircuit size={48} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">NexBot Intelligence Report</h3>
              <span className="text-xs bg-emerald-400 text-emerald-900 px-2 py-0.5 rounded-full font-bold">SCORE: {aiInsights.healthScore}</span>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed">{aiInsights.riskLevel}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.recommendations?.slice(0, 2).map((rec: any, i: number) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="font-bold text-sm underline">{rec.sku}</p>
                  <p className="text-xs text-indigo-50 font-medium">{rec.action}: {rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setAiInsights(null)} className="text-white/60 hover:text-white self-start md:self-center">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by SKU, Name or Location..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-all font-medium ${
                showFilters || activeCategory !== 'All' || activeStatus !== 'All'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} /> Filter
              {(activeCategory !== 'All' || activeStatus !== 'All') && (
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-900">Refine View</span>
                  <button onClick={resetFilters} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Reset</button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">By Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeCategory === cat 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">By Status</label>
                    <div className="grid grid-cols-1 gap-1">
                      {statuses.map(status => (
                        <button 
                          key={status}
                          onClick={() => setActiveStatus(status)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            activeStatus === status 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {status}
                          {activeStatus === status && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product / SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter mt-0.5">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                      ${product.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' : ''}
                      ${product.status === 'Overstock' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                      ${product.status === 'Out of Stock' ? 'bg-rose-50 text-rose-600 border border-rose-100' : ''}
                    `}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[120px]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-700">{product.stockLevel}</span>
                        <span className="text-[10px] text-slate-400">Target: {product.maxThreshold}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            product.stockLevel < product.minThreshold ? 'bg-rose-500' : 
                            product.stockLevel > product.maxThreshold ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min((product.stockLevel / (product.maxThreshold || 100)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No products found matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="text-blue-600" /> SKU Details
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  <Package size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 leading-tight">{selectedProduct.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedProduct.sku}</p>
                </div>
              </div>

              {/* Status & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <AlertCircle size={12} /> Status
                  </div>
                  <span className={`text-sm font-bold ${
                    selectedProduct.status === 'In Stock' ? 'text-emerald-600' :
                    selectedProduct.status === 'Low Stock' ? 'text-amber-600' : 'text-rose-600'
                  }`}>{selectedProduct.status}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <MapPin size={12} /> Location
                  </div>
                  <span className="text-sm font-bold text-slate-700">{selectedProduct.location}</span>
                </div>
              </div>

              {/* Stock Numbers */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h5 className="text-sm font-bold text-slate-900">Inventory Levels</h5>
                  <span className="text-xs font-bold text-blue-600">{selectedProduct.stockLevel} units total</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium text-slate-500">Unit Price</div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-1">
                      <IndianRupee size={16} />{selectedProduct.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Min Threshold</div>
                      <div className="text-xl font-bold text-rose-500">{selectedProduct.minThreshold}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Threshold</div>
                      <div className="text-xl font-bold text-blue-500">{selectedProduct.maxThreshold}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity History */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History size={16} className="text-slate-400" /> Recent Activity
                </h5>
                <div className="space-y-3">
                  {[
                    { type: 'Stock In', qty: '+40', date: '2 days ago', user: 'Admin' },
                    { type: 'Pick Order', qty: '-12', date: '4 days ago', user: 'Storekeeper' },
                    { type: 'Audit Update', qty: '0', date: '1 week ago', user: 'Auditor' }
                  ].map((act, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          act.qty.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 
                          act.qty === '0' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'
                        }`}>{act.qty}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{act.type}</p>
                          <p className="text-[10px] text-slate-400">{act.user}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                type="button"
                onClick={openEditModalFromDrawer}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Edit3 size={16} /> Edit
              </button>
              <button 
                type="button"
                onClick={handleDeleteProduct}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold hover:bg-rose-100 transition-all active:scale-95"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit SKU Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div 
            key={editingId || 'new'} 
            className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {editingId ? <Edit3 className="text-blue-600" /> : <Plus className="text-blue-600" />}
                {editingId ? 'Edit Existing SKU' : 'Register New SKU'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    placeholder="e.g. Premium Case"
                    value={productForm.name ?? ''}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">SKU Code</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-slate-900"
                    placeholder="PRM-001-BLU"
                    value={productForm.sku ?? ''}
                    onChange={e => setProductForm({...productForm, sku: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    value={productForm.category ?? 'Interior & Infrastructure'}
                    onChange={e => setProductForm({...productForm, category: e.target.value as any})}
                  >
                    <option>{"Walls & Roofing"}</option>
                    <option>{"Interior & Infrastructure"}</option>
                    <option>{"Furniture"}</option>
                    <option>{"Structural & Foundation"}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price (₹)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900"
                    placeholder="0.00"
                    value={productForm.price ?? 0}
                    onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Warehouse Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-900"
                      placeholder="e.g. WH-B2-04"
                      value={productForm.location ?? ''}
                      onChange={e => setProductForm({...productForm, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initial Stock</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900"
                    value={productForm.stockLevel ?? 0}
                    onChange={e => setProductForm({...productForm, stockLevel: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Min Threshold</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-900"
                    value={productForm.minThreshold ?? 0}
                    onChange={e => setProductForm({...productForm, minThreshold: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Threshold</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900"
                    value={productForm.maxThreshold ?? 0}
                    onChange={e => setProductForm({...productForm, maxThreshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
                >
                  {editingId ? 'Update SKU' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
