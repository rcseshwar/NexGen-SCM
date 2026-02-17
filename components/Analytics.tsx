
import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  BarChart3, 
  Send, 
  Bot, 
  User, 
  Cpu, 
  Zap, 
  Settings,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { runChat } from '../services/aiService';
import { AuthContext, AIConfigContext } from '../App';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { provider, openAiKey } = useContext(AIConfigContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Welcome to NexBot. I've analyzed your current supply chain nodes. How can I help you optimize your logistics or inventory today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = messages.concat(userMessage).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await runChat(
        historyForApi,
        { provider, openAiKey }
      );
      setMessages(prev => [...prev, { role: 'assistant', text: response || 'I encountered an error processing your request.' }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${err.message || 'Unknown error'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm('Clear current session history?')) {
      setMessages([{ role: 'assistant', text: "Session reset. How can I assist you now?" }]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            SCM Intelligence <BarChart3 className="text-blue-500" />
          </h1>
          <p className="text-slate-500 font-medium">Conversational strategy powered by {provider === 'openai' ? 'GPT-4o' : 'Gemini 3 Pro'}</p>
        </div>
      </div>

      {/* Adjusted grid system for more chat space (5 columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        
        {/* Left Stats Column (Narrower - 1/5) */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Reduced height Key Performance Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={14} /> Key Performance
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-slate-600">Decision Precision</span>
                  <span className="text-blue-600">98%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[98%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-slate-600">Circular Utilization</span>
                  <span className="text-emerald-600">82%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[82%]"></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Latency</p>
                <p className="text-xs font-bold text-slate-900">240ms</p>
              </div>
              <div className="p-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Uptime</p>
                <p className="text-xs font-bold text-slate-900">99.9%</p>
              </div>
            </div>
          </div>
          
          {/* Reduced size "NexBot Tip" Banner */}
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <div className="flex items-center gap-2 mb-2">
               <Zap size={18} className="text-indigo-200" />
               <h4 className="font-bold text-sm italic">NexBot Tip</h4>
            </div>
            <p className="text-[11px] text-indigo-50 leading-relaxed">
              Recent trends suggest optimizing Warehouse B routes could save 4 hours daily.
            </p>
          </div>
        </div>

        {/* Chat Interface (Wider - 4/5) */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-none">NexBot Advisor</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: Online & Encrypted</p>
              </div>
            </div>
            <button 
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
              title="Clear Chat"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                  msg.role === 'assistant' 
                    ? 'bg-blue-50 border-blue-100 text-blue-600' 
                    : 'bg-slate-200 border-slate-300 text-slate-600'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-white text-slate-800 border border-slate-100 shadow-sm' 
                    : 'bg-blue-600 text-white shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-lg shrink-0 bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Ask about inventory strategy, logistics, or performance..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-900"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-200 transition-all active:scale-95 shadow-md shadow-blue-600/10"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 px-2">
               <ShieldCheck size={12} className="text-slate-400" />
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</p>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Analytics;
