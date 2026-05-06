import React, { useState } from 'react';
import { X, Code, Copy, Check, Activity } from 'lucide-react';

export default function ApiModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const dummyKey = "optd_live_9a8b7c6d5e4f3g2h1";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(dummyKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl glass-panel p-8 animate-fade-in border border-white/20 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-[#0A0F1A]/95">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full">
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Code className="text-cyan" size={28} /> Developer API
          </h2>
          <p className="text-muted text-sm">JSON orqali O'zbekistonning barcha transport nuqtalarini bepul oling.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cyan mb-2">Shaxsiy API Kalitingiz (Token)</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly
                value={dummyKey}
                className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3 px-4 text-muted font-mono"
              />
              <button 
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition text-white"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan mb-2">Ulanish namunasi (cURL)</label>
            <div className="bg-[#070B14] border border-white/10 rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <span className="text-pink-400">curl</span> <span className="text-blue-300">-X</span> GET \<br/>
              &nbsp;&nbsp;<span className="text-green-400">"https://api.optd.uz/v1/nodes?type=A"</span> \<br/>
              &nbsp;&nbsp;<span className="text-blue-300">-H</span> <span className="text-green-400">"Authorization: Bearer {dummyKey}"</span>
            </div>
          </div>
          
          <div className="bg-[#070B14] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Jonli JSON Ma'lumotlar</h3>
                <p className="text-[10px] text-muted">Barcha transport nuqtalari avtomatik yuklanadi.</p>
              </div>
              <Activity size={20} className="text-cyan animate-pulse" />
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 font-mono text-[10px] text-green-400/80 h-48 overflow-y-auto border border-white/5 custom-scrollbar">
              <pre>
{`[
  {
    "id": 1,
    "iata": "TAS",
    "name": "Toshkent Xalqaro Aeroporti",
    "type": "A",
    "region": "Tashkent"
  },
  {
    "id": 2,
    "iata": "SKD",
    "name": "Samarqand Xalqaro Aeroporti",
    "type": "A",
    "region": "Samarkand"
  },
  ... 18 ta obyekt yuklandi
]`}
              </pre>
            </div>
          </div>
          
          <div className="text-xs text-muted/60 mt-4 text-center">
            Tizim har safar yangilanganda JSON ma'lumotlarni avtomatik oladi.
          </div>
        </div>
      </div>
    </div>
  );
}
