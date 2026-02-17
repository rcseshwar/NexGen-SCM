
import React, { useState, useMemo, useContext } from 'react';
import { ShoppingCart, Download, Filter, FileText, CheckCircle, Clock, AlertCircle, X, IndianRupee, Truck, User, Calendar, FileDown, Search, Leaf } from 'lucide-react';
import { Order } from '../types';
import { jsPDF } from 'jspdf';
import { SearchContext } from '../App';

const initialOrders: Order[] = [
  { id: 'ORD-1001', type: 'Purchase', status: 'Approved', vendor: 'Global Logistics Inc', total: 45000.00, createdAt: '2026-01-24' },
  { id: 'ORD-1002', type: 'Sales', status: 'Pending', vendor: 'TechRetail Corp', total: 12000.50, createdAt: '2026-01-25' },
  { id: 'ORD-1003', type: 'Purchase', status: 'Shipped', vendor: 'DHL', total: 8900.00, createdAt: '2026-01-22' },
  { id: 'ORD-1004', type: 'Sales', status: 'Delivered', vendor: 'TVS Supply Chain Solutions (TVS SCS)', total: 23000.00, createdAt: '2026-01-20' },
  { id: 'ORD-1005', type: 'Purchase', status: 'Cancelled', vendor: 'DHL', total: 4500.00, createdAt: '2026-01-18' },
  { id: 'ORD-1006', type: 'Sales', status: 'Delivered', vendor: 'AAJ Supply Chain Management', total: 11000.00, createdAt: '2026-01-19' },
];

const Orders: React.FC = () => {
  const { globalSearch } = useContext(SearchContext);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesFilter = 
        filter === 'All' || 
        (filter === 'Active' && ['Pending', 'Approved', 'Shipped'].includes(order.status)) ||
        (filter === 'Completed' && ['Delivered', 'Cancelled'].includes(order.status));
      
      const combinedSearch = (localSearch + ' ' + globalSearch).trim().toLowerCase();
      const matchesSearch = combinedSearch === '' ||
        order.id.toLowerCase().includes(combinedSearch) ||
        order.vendor.toLowerCase().includes(combinedSearch) ||
        order.status.toLowerCase().includes(combinedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, localSearch, globalSearch]);

  const exportToCSV = () => {
    const headers = ['Order ID', 'Type', 'Vendor', 'Total (INR)', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => `${o.id},${o.type},${o.vendor},${o.total},${o.status},${o.createdAt}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecoplast_orders_${filter.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Company Header / Logo Simulation
      doc.setFillColor(15, 23, 42); // Slate-900 (matches eco-industrial theme)
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Circular border simulation
      doc.setDrawColor(16, 185, 129); // Emerald-500
      doc.setLineWidth(1);
      doc.circle(30, 22, 10, 'S');
      
      doc.setFillColor(37, 99, 235); // Blue-600
      doc.circle(30, 22, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ECO", 26, 23.5);
      
      // Company Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ECOPLAST MATERIALS", 48, 22);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text("SUSTAINABLE RECYCLED PLASTIC", 48, 29);

      // Contact Details in Header
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text("NexChain Smart Node ID: XP-9921", pageWidth - 20, 20, { align: "right" });
      doc.text("supply-chain@ecoplast.ai", pageWidth - 20, 26, { align: "right" });

      // Invoice Title & Separator
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL ORDER INVOICE", 20, 65);
      doc.setDrawColor(16, 185, 129); // Emerald-500 line
      doc.setLineWidth(0.5);
      doc.line(20, 70, pageWidth - 20, 70);

      // Main Info Grid
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("LOGISTICS DATA", 20, 85);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Transaction Reference:`, 20, 95);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedOrder.id}`, 75, 95);

      doc.setFont("helvetica", "bold");
      doc.text(`Workflow Path:`, 20, 103);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedOrder.type} Fulfillment`, 75, 103);

      doc.setFont("helvetica", "bold");
      doc.text(`Processing Date:`, 20, 111);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedOrder.createdAt}`, 75, 111);

      doc.setFont("helvetica", "bold");
      doc.text(`Current Status:`, 20, 119);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(37, 99, 235); // Blue-600 for status
      doc.text(`${selectedOrder.status.toUpperCase()}`, 75, 119);

      // Entity Info
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text(selectedOrder.type === 'Purchase' ? "SUPPLIER INFORMATION" : "DISTRIBUTION PARTNER", 20, 140);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(selectedOrder.vendor, 20, 150);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Authorized EcoPlast Supply Network Member", 20, 156);

      // Financial Summary Box
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.roundedRect(20, 175, pageWidth - 40, 45, 5, 5, 'F');
      
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("SETTLEMENT VALUE (INR)", 30, 192);
      
      doc.setTextColor(16, 185, 129); // Emerald-600
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(`INR ${selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 30, 208);

      // Sustainability Footnote
      doc.setFillColor(236, 253, 245); // Emerald-50
      doc.roundedRect(20, 225, pageWidth - 40, 15, 2, 2, 'F');
      doc.setTextColor(5, 150, 105); // Emerald-600
      doc.setFontSize(8);
      doc.text("CIRCULAR ECONOMY IMPACT: This order represents 100% recycled material processing.", pageWidth / 2, 234, { align: "center" });

      // Terms & Conditions
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("OPERATIONAL NOTES:", 20, 250);
      doc.setFont("helvetica", "normal");
      doc.text("1. All EcoPlast batches are traceable via NexChain Smart Contracts.", 20, 256);
      doc.text("2. Sustainability verified at source sorting nodes.", 20, 261);

      // Footer
      doc.setDrawColor(241, 245, 249);
      doc.line(20, 275, pageWidth - 20, 275);
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text("SECURE BLOCKCHAIN HASH: " + Math.random().toString(36).substr(2, 12).toUpperCase(), pageWidth / 2, 283, { align: "center" });
      doc.text("© 2026 EcoPlast Materials • Intelligent SCM Systems", pageWidth / 2, 288, { align: "center" });

      doc.save(`EcoPlast_Invoice_${selectedOrder.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Encountered an issue generating the PDF. Please ensure browser popups are allowed.");
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    
    const statusLifecycle: Order['status'][] = ['Pending', 'Approved', 'Shipped', 'Delivered'];
    const currentIndex = statusLifecycle.indexOf(selectedOrder.status);
    
    if (currentIndex === -1 || currentIndex === statusLifecycle.length - 1 || selectedOrder.status === 'Cancelled') {
      alert("This order status is already at its final stage or was cancelled.");
      return;
    }

    const nextStatus = statusLifecycle[currentIndex + 1];
    const updatedOrder = { ...selectedOrder, status: nextStatus };
    
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={14} className="mr-1" />;
      case 'Pending': return <Clock size={14} className="mr-1" />;
      case 'Cancelled': return <AlertCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const logoUrl = "https://images.squarespace-cdn.com/content/v1/5f8d951916964a1324006c07/1603206240217-1P8A6O0M7N0F3L5T7I5T/EcoPlast+Logo+Circle.png";
  const fallbackLogo = "https://cdn-icons-png.flaticon.com/512/892/892926.png";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            Order Fulfillment <ShoppingCart className="text-blue-500" />
          </h1>
          <p className="text-slate-500">EcoPlast circular economy logistics tracking</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
        >
          <FileDown size={18} className="text-emerald-600" />
          Export Log
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, Vendor or Status..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
            {(['All', 'Active', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  filter === tab 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stakeholder</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 text-left focus:outline-none"
                    >
                      <FileText size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <span className="font-bold text-blue-600 underline underline-offset-4 decoration-blue-100 group-hover:decoration-blue-400">
                        {order.id}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${
                      order.type === 'Purchase' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{order.vendor}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${order.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                      ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''}
                      ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                      ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                      ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' : ''}
                    `}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm font-medium">{order.createdAt}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    No matching order records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-blue-600" /> Stakeholder Report
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-1 shadow-sm">
                   <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }}
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{selectedOrder.id}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedOrder.type} Verification</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <User size={10} /> Partner
                  </p>
                  <p className="text-sm font-bold text-slate-800">{selectedOrder.vendor}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar size={10} /> Issuance
                  </p>
                  <p className="text-sm font-bold text-slate-800">{selectedOrder.createdAt}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Circular Valuation</p>
                   <IndianRupee size={16} className="text-emerald-400" />
                </div>
                <h4 className="text-3xl font-bold relative z-10">{formatCurrency(selectedOrder.total)}</h4>
                <div className="mt-6 flex items-center gap-2 bg-white/5 p-3 rounded-2xl backdrop-blur-md relative z-10 border border-white/5">
                   <Truck size={16} className="text-emerald-400" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Green Logistics Routing Active</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900">Node Timeline Verification</h5>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                   {[
                     { label: 'Asset Registration', date: selectedOrder.createdAt, status: 'Completed' },
                     { label: 'Material Quality Pass', date: selectedOrder.createdAt, status: 'Completed' },
                     { label: 'Blockchain Settlement', date: selectedOrder.status === 'Pending' ? 'In Sync' : selectedOrder.createdAt, status: selectedOrder.status === 'Pending' ? 'Active' : 'Completed' },
                     { label: 'Last-Mile Handover', date: ['Shipped', 'Delivered'].includes(selectedOrder.status) ? selectedOrder.createdAt : 'Awaiting', status: selectedOrder.status === 'Shipped' ? 'Active' : (selectedOrder.status === 'Delivered' ? 'Completed' : 'Pending') }
                   ].map((item, idx) => (
                     <div key={idx} className="relative">
                        <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${
                          item.status === 'Completed' ? 'bg-emerald-500' : 
                          item.status === 'Active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'
                        }`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
               <button 
                 onClick={handleDownloadInvoice}
                 className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3"
               >
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center p-0.5">
                    <img 
                      src={logoUrl} 
                      alt="Brand" 
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }}
                    />
                 </div>
                 <span className="text-sm">Download PDF</span>
               </button>
               <button 
                 onClick={handleUpdateStatus}
                 disabled={selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
                 className={`flex-1 py-4 rounded-2xl text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/10 ${
                   selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled' ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700'
                 }`}
               >
                 {selectedOrder.status === 'Delivered' ? 'Finalized' : 'Advance Node'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
