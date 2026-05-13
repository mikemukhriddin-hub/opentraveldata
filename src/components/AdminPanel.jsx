import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Search, MapPin, Plane, Train, Save, X } from 'lucide-react';

export default function AdminPanel({ nodes, onUpdateNodes, activeLang }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filteredNodes = nodes.filter(node => 
    node.name_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.iata_code && node.iata_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartEdit = (node) => {
    setEditingId(node.id);
    setEditForm({ ...node });
  };

  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://opentraveldataoptd-uzbekistan-api.onrender.com';

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/nodes/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const updatedNodes = nodes.map(n => n.id === editingId ? editForm : n);
        onUpdateNodes(updatedNodes);
        setEditingId(null);
      } else {
        const err = await response.json();
        alert(`Xatolik: ${err.error}`);
      }
    } catch (error) {
      alert("Server bilan bog'lanishda xatolik!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?")) {
      try {
        const response = await fetch(`${API_URL}/api/nodes/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${user?.token}`
          }
        });

        if (response.ok) {
          const updatedNodes = nodes.filter(n => n.id !== id);
          onUpdateNodes(updatedNodes);
        } else {
          const err = await response.json();
          alert(`Xatolik: ${err.error}`);
        }
      } catch (error) {
        alert("Server bilan bog'lanishda xatolik!");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0F1A]/60 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-cyan" />
            Boshqaruv Paneli
          </h2>
          <p className="text-muted text-sm mt-1">Baza ma'lumotlarini real vaqtda tahrirlash va boshqarish</p>
        </div>
        <button className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm">
          <Plus size={18} /> Yangi nuqta qo'shish
        </button>
      </div>

      <div className="glass-panel p-4 flex items-center gap-3">
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder="Shahar, stansiya yoki kod bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full text-left border-collapse bg-[#0A0F1A]/40 backdrop-blur-xl">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-muted">
              <th className="px-6 py-4 font-semibold">Turi</th>
              <th className="px-6 py-4 font-semibold">Shahar (UZ/EN)</th>
              <th className="px-6 py-4 font-semibold">Kod (IATA)</th>
              <th className="px-6 py-4 font-semibold">Koordinatalar</th>
              <th className="px-6 py-4 font-semibold text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredNodes.map(node => (
              <tr key={node.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  {node.type === 'airport' ? (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Plane size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Train size={18} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === node.id ? (
                    <div className="space-y-2">
                      <input 
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm w-full outline-none focus:border-cyan"
                        value={editForm.name_uz}
                        onChange={e => setEditForm({...editForm, name_uz: e.target.value})}
                      />
                      <input 
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm w-full outline-none focus:border-cyan"
                        value={editForm.name_en}
                        onChange={e => setEditForm({...editForm, name_en: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-white">{node.name_uz}</div>
                      <div className="text-xs text-muted">{node.name_en}</div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === node.id ? (
                    <input 
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm w-20 outline-none focus:border-cyan"
                      value={editForm.iata_code || ''}
                      onChange={e => setEditForm({...editForm, iata_code: e.target.value})}
                    />
                  ) : (
                    <span className="font-mono text-cyan bg-cyan/5 px-2 py-1 rounded border border-cyan/10">
                      {node.iata_code || node.locode}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs font-mono text-muted">
                  {editingId === node.id ? (
                    <div className="space-y-1">
                      <input 
                        className="bg-white/5 border border-white/10 rounded px-2 py-0.5 w-full outline-none"
                        value={editForm.coordinates?.lat || ''}
                        onChange={e => setEditForm({...editForm, coordinates: {...editForm.coordinates, lat: e.target.value}})}
                      />
                      <input 
                        className="bg-white/5 border border-white/10 rounded px-2 py-0.5 w-full outline-none"
                        value={editForm.coordinates?.lon || ''}
                        onChange={e => setEditForm({...editForm, coordinates: {...editForm.coordinates, lon: e.target.value}})}
                      />
                    </div>
                  ) : (
                    node.coordinates ? `${node.coordinates.lat}, ${node.coordinates.lon}` : 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === node.id ? (
                      <>
                        <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(node)} className="p-2 bg-white/5 text-muted hover:text-white hover:bg-white/10 rounded-lg transition">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(node.id)} className="p-2 bg-white/5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShieldCheck({ size = 20, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
