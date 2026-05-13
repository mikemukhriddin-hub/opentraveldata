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

  const adminTranslations = {
    uz: {
      title: "Boshqaruv Paneli", subtitle: "Baza ma'lumotlarini real vaqtda boshqarish",
      addBtn: "Yangi nuqta", searchPlaceholder: "Shahar yoki kod bo'yicha...",
      thType: "Turi", thCity: "Shahar (UZ/EN)", thCode: "Kod", thCoords: "Koordinatalar", thActions: "Amallar",
      confirmDelete: "Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?", serverError: "Server bilan bog'lanishda xatolik!"
    },
    en: {
      title: "Admin Dashboard", subtitle: "Manage database nodes in real-time",
      addBtn: "Add New", searchPlaceholder: "Search city or code...",
      thType: "Type", thCity: "City (UZ/EN)", thCode: "Code", thCoords: "Coordinates", thActions: "Actions",
      confirmDelete: "Are you sure you want to delete this node?", serverError: "Error connecting to server!"
    },
    ru: {
      title: "Панель управления", subtitle: "Управление узлами базы в реальном времени",
      addBtn: "Добавить", searchPlaceholder: "Поиск по городам...",
      thType: "Тип", thCity: "Город (УЗ/АНГ)", thCode: "Код", thCoords: "Координаты", thActions: "Действия",
      confirmDelete: "Вы уверены, что хотите удалить этот узел?", serverError: "Ошибка подключения к серверу!"
    }
  };
  const at = adminTranslations[activeLang] || adminTranslations.uz;

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
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      alert(at.serverError);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(at.confirmDelete)) {
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
          alert(`Error: ${err.error}`);
        }
      } catch (error) {
        alert(at.serverError);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0F1A]/60 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-cyan" />
            {at.title}
          </h2>
          <p className="text-muted text-sm mt-1">{at.subtitle}</p>
        </div>
        <button className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm">
          <Plus size={18} /> {at.addBtn}
        </button>
      </div>

      <div className="glass-panel p-4 flex items-center gap-3">
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder={at.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full text-left border-collapse bg-[#0A0F1A]/40 backdrop-blur-xl">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-muted">
              <th className="px-6 py-4 font-semibold">{at.thType}</th>
              <th className="px-6 py-4 font-semibold">{at.thCity}</th>
              <th className="px-6 py-4 font-semibold">{at.thCode}</th>
              <th className="px-6 py-4 font-semibold">{at.thCoords}</th>
              <th className="px-6 py-4 font-semibold text-right">{at.thActions}</th>
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
                        value={editForm.latitude || ''}
                        onChange={e => setEditForm({...editForm, latitude: e.target.value})}
                      />
                      <input 
                        className="bg-white/5 border border-white/10 rounded px-2 py-0.5 w-full outline-none"
                        value={editForm.longitude || ''}
                        onChange={e => setEditForm({...editForm, longitude: e.target.value})}
                      />
                    </div>
                  ) : (
                    node.latitude ? `${node.latitude}, ${node.longitude}` : 'N/A'
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
