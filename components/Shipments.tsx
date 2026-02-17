
import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { Truck, MapPin, Navigation, Clock, Search, History as HistoryIcon, Radio, ChevronRight, X, CheckCircle2, Zap, Loader2, Sparkles } from 'lucide-react';
import { Shipment } from '../types';
import { SearchContext } from '../App';

const initialShipments: Shipment[] = [
  { id: 'SHP-781', orderId: 'ORD-1003', origin: 'Mangalore Port', destination: 'Warehouse A, Hubli', status: 'In Transit', estimatedArrival: 'Feb 28, 2026' },
  { id: 'SHP-902', orderId: 'ORD-998', origin: 'Mangalore Hub', destination: 'Distribution C, Bangalore', status: 'Delayed', estimatedArrival: 'Feb 26, 2026' },
  { id: 'SHP-124', orderId: 'ORD-1015', origin: 'Mangalore Facility', destination: 'Distribution Bidar', status: 'Delivered', estimatedArrival: 'Jan 22, 2026' },
  { id: 'SHP-255', orderId: 'ORD-1022', origin: 'Mangalore Logistics', destination: 'Warehouse B, Bangalore', status: 'In Transit', estimatedArrival: 'Feb 23, 2026' },
  { id: 'SHP-312', orderId: 'ORD-1050', origin: 'Mangalore Port', destination: 'Distribution Mysore', status: 'Delivered', estimatedArrival: 'Jan 15, 2026' },
];

const Shipments: React.FC = () => {
  const { globalSearch } = useContext(SearchContext);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [viewMode, setViewMode] = useState<'Live' | 'History'>('Live');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [showTimelineModal, setShowTimelineModal] = useState<Shipment | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const modeMatch = viewMode === 'Live' 
        ? (s.status === 'In Transit' || s.status === 'Delayed')
        : (s.status === 'Delivered');

      const combinedSearch = (localSearch + ' ' + globalSearch).trim().toLowerCase();
      const searchMatch = combinedSearch === '' ||
        s.id.toLowerCase().includes(combinedSearch) ||
        s.orderId.toLowerCase().includes(combinedSearch) ||
        s.origin.toLowerCase().includes(combinedSearch) ||
        s.destination.toLowerCase().includes(combinedSearch);

      return modeMatch && searchMatch;
    });
  }, [viewMode, shipments, localSearch, globalSearch]);

  const handleFocusShipment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShipmentId(id);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenTimeline = (shp: Shipment, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTimelineModal(shp);
  };

  const handleOptimizeRoutes = () => {
    setIsOptimizing(true);
    setOptimizationComplete(false);

    // Simulate AI route optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      
      // Simulate data update: slightly advance ETAs for efficiency
      setShipments(prev => prev.map(s => {
        if (s.status === 'In Transit' || s.status === 'Delayed') {
           // Visual confirmation of change
           return { ...s, status: s.status === 'Delayed' ? 'In Transit' : s.status };
        }
        return s;
      }));

      // Hide success message after 5 seconds
      setTimeout(() => setOptimizationComplete(false), 5000);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            Logistics & Fleet <Truck className="text-blue-500" />
          </h1>
          <p className="text-slate-500">Global shipment visibility and route optimization</p>
        </div>
        <div className="bg-white p-1.5 border border-slate-200 rounded-2xl flex items-center gap-1 shadow-sm">
          <button 
            onClick={() => setViewMode('Live')}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl text-sm transition-all ${
              viewMode === 'Live' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Radio size={16} className={viewMode === 'Live' ? 'animate-pulse' : ''} />
            Live Track
          </button>
          <button 
            onClick={() => setViewMode('History')}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl text-sm transition-all ${
              viewMode === 'History' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <HistoryIcon size={16} />
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative mb-4">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by ID, Order, or Origin..."
               className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm text-slate-900"
               value={localSearch}
               onChange={(e) => setLocalSearch(e.target.value)}
             />
          </div>

          <div className="space-y-4">
            {filteredShipments.length > 0 ? filteredShipments.map((shp) => (
              <div 
                key={shp.id} 
                onClick={() => setSelectedShipmentId(shp.id)}
                className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  selectedShipmentId === shp.id 
                    ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-xl translate-x-1' 
                    : 'border-slate-200 hover:border-blue-200 shadow-sm'
                }`}
              >
                <div className={`absolute top-0 right-0 w-1.5 h-full ${shp.status === 'In Transit' ? 'bg-blue-500' : shp.status === 'Delayed' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl transition-colors ${
                      shp.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : 
                      shp.status === 'Delayed' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    } ${selectedShipmentId === shp.id ? 'bg-blue-600 text-white' : ''}`}>
                      <Truck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        {shp.id}
                        {shp.status === 'In Transit' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Order: {shp.orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      shp.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      shp.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {shp.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center justify-end gap-1">
                      <Clock size={12} /> {shp.status === 'Delivered' ? 'Arrived' : 'ETA'}: {shp.estimatedArrival}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 border border-slate-200 shadow-sm">
                      <MapPin size={14} />
                    </div>
                    <div className="w-0.5 h-10 border-l-2 border-dashed border-slate-200 my-1"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-600 border border-slate-200 shadow-sm">
                      <Navigation size={14} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Origin Facility</p>
                      <p className="font-bold text-slate-800 text-sm">{shp.origin}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Destination Hub</p>
                      <p className="font-bold text-slate-800 text-sm">{shp.destination}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      title="View Status Timeline"
                      onClick={(e) => handleOpenTimeline(shp, e)}
                      className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 active:scale-95 shadow-sm"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      title="Focus on Map"
                      onClick={(e) => handleFocusShipment(shp.id, e)}
                      className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 active:scale-95 shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                   <Truck size={32} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">No shipments found</h3>
                   <p className="text-slate-500 max-w-xs mx-auto text-sm">There are currently no matching records in your logistics pipeline.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Map Sidebar */}
        <div 
          ref={mapRef}
          className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col h-fit lg:sticky lg:top-24 border border-white/5 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
               <Navigation className="text-blue-400" size={20} />
               Fleet Map
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
               Live
            </span>
          </div>

          <div className="h-96 w-full bg-slate-800 rounded-3xl relative overflow-hidden shadow-inner group ring-1 ring-white/10">
            <img src="https://picsum.photos/seed/map-dark/600/800" className="w-full h-full object-cover opacity-30 grayscale transition-all duration-1000" alt="Map Background" />
            
            {/* Optimization Overlay */}
            {isOptimizing && (
              <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                  <Zap className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={32} />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300 animate-pulse">Analyzing Routes...</p>
                {/* Simulated scan line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            {/* Dynamic Animated Markers */}
            <div className={`absolute top-1/4 left-1/3 transition-all duration-500 ${selectedShipmentId === 'SHP-781' ? 'scale-150 z-20' : 'scale-100 opacity-60'}`}>
              <div className={`w-4 h-4 bg-blue-500 rounded-full ring-8 ${selectedShipmentId === 'SHP-781' ? 'ring-blue-500/40' : 'ring-blue-500/10'} animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.6)]`}></div>
              <div className={`absolute -top-10 -left-8 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] border ${selectedShipmentId === 'SHP-781' ? 'border-blue-500 text-blue-200' : 'border-white/20'} whitespace-nowrap shadow-xl`}>
                 SHP-781 • In Transit
              </div>
            </div>
            
            <div className={`absolute bottom-1/3 right-1/4 transition-all duration-500 ${selectedShipmentId === 'SHP-124' ? 'scale-150 z-20' : 'scale-100 opacity-60'}`}>
              <div className={`w-4 h-4 bg-emerald-500 rounded-full ring-8 ${selectedShipmentId === 'SHP-124' ? 'ring-emerald-500/40' : 'ring-emerald-500/10'} shadow-[0_0_20px_rgba(16,185,129,0.6)]`}></div>
              <div className={`absolute -top-10 -left-8 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] border ${selectedShipmentId === 'SHP-124' ? 'border-emerald-500 text-emerald-200' : 'border-white/20'} whitespace-nowrap shadow-xl`}>
                 SHP-124 • Delivered
              </div>
            </div>

            <div className={`absolute top-1/2 right-1/3 transition-all duration-500 ${selectedShipmentId === 'SHP-902' ? 'scale-150 z-20' : 'scale-100 opacity-60'}`}>
              <div className={`w-4 h-4 bg-rose-500 rounded-full ring-8 ${selectedShipmentId === 'SHP-902' ? 'ring-rose-500/40' : 'ring-rose-500/10'} animate-bounce shadow-[0_0_20px_rgba(244,63,94,0.6)]`}></div>
              <div className={`absolute -top-10 -left-8 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] border ${selectedShipmentId === 'SHP-902' ? 'border-rose-500 text-rose-200' : 'border-white/20'} whitespace-nowrap shadow-xl`}>
                 SHP-902 • Delayed
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center text-sm p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-slate-400 font-medium">Active Fleet Units</span>
              <span className="font-bold text-lg">142</span>
            </div>
            <div className="flex justify-between items-center text-sm p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-slate-400 font-medium">Network Health</span>
              <span className="font-bold text-lg text-emerald-400">94.2%</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 relative">
             {optimizationComplete && (
               <div className="absolute -top-12 left-0 right-0 bg-emerald-500/90 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 justify-center animate-in slide-in-from-bottom-2">
                 <Sparkles size={14} /> Efficiency improved by 15%!
               </div>
             )}
             <button 
                onClick={handleOptimizeRoutes}
                disabled={isOptimizing}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  isOptimizing 
                    ? 'bg-blue-600/50 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
             >
                {isOptimizing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap size={18} className="text-blue-200" />
                    Optimize All Routes
                  </>
                )}
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Shipment Timeline Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowTimelineModal(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HistoryIcon className="text-blue-600" size={20} />
                Tracking Timeline
              </h3>
              <button onClick={() => setShowTimelineModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Truck className="text-blue-600" size={32} />
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Selected Shipment</p>
                  <p className="text-lg font-bold text-slate-900">{showTimelineModal.id}</p>
                </div>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {[
                  { label: 'Shipment Dispatched', location: showTimelineModal.origin, time: '3 days ago', status: 'done' },
                  { label: 'In Transit - Customs Cleared', location: 'Intermediate Hub', time: '1 day ago', status: 'done' },
                  { label: 'Out for Local Delivery', location: showTimelineModal.destination, time: showTimelineModal.status === 'Delivered' ? 'Completed' : 'Pending', status: showTimelineModal.status === 'Delivered' ? 'done' : 'active' },
                  { label: 'Arrived at Destination', location: showTimelineModal.destination, time: showTimelineModal.status === 'Delivered' ? 'Completed' : 'Expected: ' + showTimelineModal.estimatedArrival, status: showTimelineModal.status === 'Delivered' ? 'done' : 'waiting' }
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center ${
                      step.status === 'done' ? 'bg-emerald-500' : 
                      step.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'
                    }`}>
                      {step.status === 'done' && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-none">{step.label}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{step.location}</p>
                      <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setShowTimelineModal(null)}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-sm active:scale-95"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
