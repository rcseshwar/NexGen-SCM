
import React, { useContext, useState, useEffect } from 'react';
import { Cpu, Sparkles, Braces, Key, ShieldCheck, Save } from 'lucide-react';
import { AIConfigContext } from '../App';

const AIEngine: React.FC = () => {
  const { provider, setProvider, openAiKey, setOpenAiKey } = useContext(AIConfigContext);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        setHasGeminiKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
  }, []);

  const handleUpdateGeminiKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasGeminiKey(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            AI Intelligence Hub <Cpu className="text-blue-500" />
          </h1>
          <p className="text-slate-500">Configure global AI models and provider credentials</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Save size={18} /> Save Config
        </button>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-200 space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Intelligence Provider</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setProvider('gemini')}
                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 font-bold ${provider === 'gemini' ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                <Sparkles size={32} />
                <div className="text-center">
                  <p className="text-lg">Google Gemini</p>
                  <p className={`text-[10px] font-medium ${provider === 'gemini' ? 'text-blue-100' : 'text-slate-400'}`}>Native Real-time Audio/Video</p>
                </div>
              </button>
              <button 
                onClick={() => setProvider('openai')}
                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 font-bold ${provider === 'openai' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                <Braces size={32} />
                <div className="text-center">
                  <p className="text-lg">OpenAI GPT-4</p>
                  <p className={`text-[10px] font-medium ${provider === 'openai' ? 'text-emerald-100' : 'text-slate-400'}`}>Advanced Logic Models</p>
                </div>
              </button>
            </div>
          </div>

          {provider === 'gemini' ? (
            <div className="p-8 border border-slate-100 rounded-[28px] bg-slate-50/50 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <p className="text-lg font-bold text-slate-900">Gemini Session Configuration</p>
                   <p className="text-sm text-slate-500">Securely managed via AI Studio session vault.</p>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${hasGeminiKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {hasGeminiKey ? 'Key Verified' : 'Key Missing'}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                <p className="text-sm text-slate-600 leading-relaxed">Gemini keys are strictly session-bound and are never persisted on EcoPlast data nodes. You must re-authenticate for high-priority AI tasks.</p>
                <button 
                  onClick={handleUpdateGeminiKey}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  <Key size={18} /> Re-link Gemini Key
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-slate-100 rounded-[28px] bg-slate-50/50 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <p className="text-lg font-bold text-slate-900">OpenAI API Access</p>
                   <p className="text-sm text-slate-500">Provide your custom API secret for GPT-4 access.</p>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${openAiKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {openAiKey ? 'Key Saved' : 'Key Missing'}
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                     <Key size={12} /> Secret API Key
                   </label>
                   <input 
                     type="password"
                     value={openAiKey}
                     onChange={(e) => setOpenAiKey(e.target.value)}
                     placeholder="sk-..."
                     className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-mono text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                   />
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-start gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                     <ShieldCheck size={18} />
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed italic">Your OpenAI key is stored strictly within your browser's local storage node. It is never transmitted to our backend infrastructure.</p>
                 </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-2xl border border-blue-100">
            <ShieldCheck size={18} className="text-blue-600" />
            <p className="text-[11px] text-blue-700 font-bold uppercase tracking-tight">EcoPlast Zero-Trust Policy Active: AI credentials remain client-side only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEngine;
