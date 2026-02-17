
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, Truck, Clock, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'Mon', inventory: 4000, shipments: 2400 },
  { name: 'Tue', inventory: 3000, shipments: 1398 },
  { name: 'Wed', inventory: 2000, shipments: 9800 },
  { name: 'Thu', inventory: 2780, shipments: 3908 },
  { name: 'Fri', inventory: 1890, shipments: 4800 },
  { name: 'Sat', inventory: 2390, shipments: 3800 },
  { name: 'Sun', inventory: 3490, shipments: 4300 },
];

const categoryData = [
  { name: 'Interior & Infrastructure', value: 400 },
  { name: 'Structural & Foundation Materials', value: 300 },
  { name: 'Furniture', value: 300 },
  { name: 'Walls & Roofing', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
      </div>
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      <span className={`text-sm font-medium flex items-center ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {Math.abs(change)}%
      </span>
      <span className="text-slate-400 text-sm">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supply Chain Overview</h1>
        <p className="text-slate-500">Real-time logistics and inventory tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory" value="12,842" change={12.5} icon={Package} color="blue" />
        <StatCard title="Active Shipments" value="84" change={-2.4} icon={Truck} color="amber" />
        <StatCard title="Avg. Cycle Time" value="4.2 Days" change={5.1} icon={Clock} color="emerald" />
        <StatCard title="Stock Alerts" value="18" change={-15} icon={AlertTriangle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900">Inventory Flow</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none text-slate-700 font-medium">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="inventory" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-slate-900">Stock Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-sm text-slate-600">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{cat.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
