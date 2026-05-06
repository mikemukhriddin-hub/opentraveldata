import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Globe, PlaneTakeoff, Train, Activity, Menu, Bell, User, Star, ChevronRight, Edit2 } from 'lucide-react';
import transportNodes from './data/transport_nodes.json';
import AuthModal from './components/AuthModal';
import EditModal from './components/EditModal';
import ApiModal from './components/ApiModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState([]);
  const [activeLang, setActiveLang] = useState('uz'); // uz, en, ru
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [isApiOpen, setIsApiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('discover'); // discover, routes
  const [routeSearch, setRouteSearch] = useState({ from: 'Toshkent (TAS)', to: 'Samarqand (SKD)' });
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResults, setRouteResults] = useState(null);

  useEffect(() => {
    // Automatically load nodes from JSON
    setNodes(transportNodes);
  }, []);

  const handleCalculateRoute = () => {
    setIsCalculating(true);
    setRouteResults(null);
    
    // Simulate calculation delay
    setTimeout(() => {
      const isAir = routeSearch.from.includes('(TAS)') || routeSearch.to.includes('(TAS)');
      const results = [
        {
          id: 1,
          type: 'air',
          from: routeSearch.from.split(' ')[0],
          to: routeSearch.to.split(' ')[0],
          duration: '1 soat 10 daqiqa',
          price: '340,000 UZS',
          carrier: 'A-320 Uzbekistan Airways'
        },
        {
          id: 2,
          type: 'rail',
          from: routeSearch.from.split(' ')[0],
          to: routeSearch.to.split(' ')[0],
          duration: '3 soat 45 daqiqa',
          price: '210,000 UZS',
          carrier: 'Afrosiyob Tezurar Poezdi'
        }
      ];
      setRouteResults(results);
      setIsCalculating(false);
    }, 1500);
  };

  // Search/Filter Logic
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    
    return nodes.filter(node => 
      node.iata_code?.toLowerCase().includes(lowerQuery) ||
      node.locode?.toLowerCase().includes(lowerQuery) ||
      node.name_uz?.toLowerCase().includes(lowerQuery) ||
      node.name_en?.toLowerCase().includes(lowerQuery) ||
      node.region?.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, nodes]);

  // Helper to get localized name
  const getLocalizedName = (node) => {
    if (activeLang === 'en') return node.name_en;
    if (activeLang === 'ru') return node.name_ru;
    return node.name_uz; // default uz
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Overlay (For desktop, static sidebar) */}
      <div className="hidden md:flex flex-col w-64 glass-panel border-l-0 border-t-0 border-b-0 rounded-none h-screen fixed left-0 top-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-cyan flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(0,229,255,0.5)]">
            O
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">OPTD</h1>
            <p className="text-xs text-cyan">Uzbekistan Platform</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'discover' ? 'bg-white/5 text-cyan border border-white/10' : 'text-muted hover:text-white hover:bg-white/5'}`}
          >
            <Globe size={20} />
            <span className="font-medium">Katalog</span>
          </button>
          <button 
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'routes' ? 'bg-white/5 text-cyan border border-white/10' : 'text-muted hover:text-white hover:bg-white/5'}`}
          >
            <PlaneTakeoff size={20} />
            <span className="font-medium">Yo'nalishlar</span>
          </button>
          <div className="h-px bg-white/5 my-2"></div>
          <a href="#" className="flex items-center gap-3 p-3 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all">
            <MapPin size={20} />
            <span className="font-medium">Hududlar (GPS)</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-muted">OPTD Uzbekistan v1.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 glass-panel rounded-none border-x-0 border-t-0 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-muted hover:text-white">
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm bg-[#0f172a] p-1 rounded-lg border border-white/10">
              <span onClick={() => setActiveLang('uz')} className={`px-3 py-1.5 rounded-md cursor-pointer transition ${activeLang === 'uz' ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-muted hover:text-white'}`}>UZ</span>
              <span onClick={() => setActiveLang('en')} className={`px-3 py-1.5 rounded-md cursor-pointer transition ${activeLang === 'en' ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-muted hover:text-white'}`}>EN</span>
              <span onClick={() => setActiveLang('ru')} className={`px-3 py-1.5 rounded-md cursor-pointer transition ${activeLang === 'ru' ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-muted hover:text-white'}`}>RU</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded border border-gold/20">{user.badge}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer hover:scale-105 transition">
                  <User size={18} />
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="text-xs text-muted hover:text-red-400 transition ml-2"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 glass-panel py-1.5 px-3 rounded-full hover:border-cyan/30 transition">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-cyan flex items-center justify-center">
                  <User size={14} className="text-black" />
                </div>
                <span className="text-sm font-medium pr-1">
                  {activeLang === 'uz' ? 'Tizimga kirish' : activeLang === 'en' ? 'Sign In' : 'Войти'}
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Search Section */}
        <div className="pt-12 px-6 md:px-10 max-w-5xl mx-auto w-full relative z-10 flex-none animate-fade-in">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan/10 blur-[100px] rounded-full -z-10"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-center">
            Open Travel Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-400">Uzbekistan</span>
          </h1>
          <p className="text-muted text-center max-w-2xl mx-auto mb-10">
            {activeLang === 'uz' && "O'zbekistonning barcha transport nuqtalari, IATA/ICAO kodlari va xalqaro ochiq ma'lumotlar bazasi."}
            {activeLang === 'en' && "Centralized database for all transport nodes, IATA/ICAO codes in Uzbekistan."}
            {activeLang === 'ru' && "Единая база транспортных узлов, кодов IATA/ICAO и открытых данных Узбекистана."}
          </p>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center w-full glass-panel !border-white/20 !bg-[#0f172a]/90 p-2 shadow-2xl">
              <div className="pl-4 pr-2 text-cyan">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder={activeLang === 'uz' ? "Shahar, stansiya nomi, yoki TAS kodi bo'yicha qidiring..." : "Search by city, station name, or IATA code..."}
                className="bg-transparent border-none outline-none text-white w-full py-4 px-2 text-lg placeholder:text-muted/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section (Results or Dashboard or Routes) */}
        <main className="flex-1 px-6 md:px-10 pb-10 max-w-5xl mx-auto w-full mt-10">
          {activeTab === 'routes' ? (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <PlaneTakeoff className="text-cyan" /> Avtomatik yo'nalishlar
              </h2>
              <div className="glass-panel p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-sm text-muted mb-2">Qayerdan</label>
                    <select 
                      value={routeSearch.from}
                      onChange={(e) => setRouteSearch({...routeSearch, from: e.target.value})}
                      className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-cyan"
                    >
                      {nodes.map(node => (
                        <option key={`from-${node.id}`}>{getLocalizedName(node)} ({node.iata_code || node.locode})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Qayerga</label>
                    <select 
                      value={routeSearch.to}
                      onChange={(e) => setRouteSearch({...routeSearch, to: e.target.value})}
                      className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-cyan"
                    >
                      {nodes.map(node => (
                        <option key={`to-${node.id}`}>{getLocalizedName(node)} ({node.iata_code || node.locode})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleCalculateRoute}
                  disabled={isCalculating}
                  className="btn-primary w-full mt-6 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCalculating ? <Activity size={20} className="animate-spin" /> : <Activity size={20} />}
                  {isCalculating ? 'Hisoblanmoqda...' : "Yo'nalishni hisoblash"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {routeResults ? routeResults.map(res => (
                  <div key={res.id} className={`glass-panel p-6 border-l-4 ${res.type === 'air' ? 'border-l-cyan' : 'border-l-gold'} flex items-center justify-between animate-fade-in`}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${res.type === 'air' ? 'bg-cyan/10 text-cyan' : 'bg-gold/10 text-gold'}`}>
                          {res.type === 'air' ? "Havo yo'li" : "Temir yo'l"}
                        </span>
                        <span className="text-muted text-xs">{res.carrier}</span>
                      </div>
                      <h4 className="font-bold text-lg">{res.from} → {res.to}</h4>
                      <p className="text-sm text-muted">Davomiyligi: {res.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${res.type === 'air' ? 'text-cyan' : 'text-gold'}`}>{res.price}</div>
                      <button className="text-xs text-muted hover:text-white underline mt-1">Chipta olish</button>
                    </div>
                  </div>
                )) : !isCalculating && (
                  <div className="text-center py-10 text-muted italic">
                    Shahar va stansiyalarni tanlang va tugmani bosing.
                  </div>
                )}
              </div>
            </div>
          ) : searchQuery ? (
            // Search Results
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-cyan flex items-center gap-2">
                Qidiruv natijalari <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-white">{filteredNodes.length}</span>
              </h2>
              {filteredNodes.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {filteredNodes.map(node => (
                    <div key={node.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-cyan/30 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${node.type === 'A' ? 'bg-gradient-to-br from-blue-600 to-cyan' : 'bg-gradient-to-br from-orange-500 to-gold'}`}>
                          {node.type === 'A' ? <PlaneTakeoff size={24} /> : <Train size={24} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-cyan transition-colors">{getLocalizedName(node)}</h3>
                          <div className="flex items-center gap-3 text-sm mt-1">
                            {node.iata_code && (
                              <span className="text-cyan font-mono bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/20">IATA: {node.iata_code}</span>
                            )}
                            <span className="text-muted flex items-center gap-1"><MapPin size={12} /> {node.region}</span>
                            <span className="text-muted font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-xs">UN/LOCODE: {node.locode}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingNode(node); }}
                            className="mr-3 p-2 bg-cyan/10 hover:bg-cyan/20 text-cyan rounded-full transition-colors flex items-center justify-center border border-cyan/20 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                            title="Tahrirlash"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full">
                          <ChevronRight size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-10 text-center border-dashed border-white/20">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={30} className="text-muted" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Hech narsa topilmadi</h3>
                  <p className="text-muted">Boshqa so'z bilan qidirib ko'ring yoki bazaga yangi ma'lumot qo'shing.</p>
                </div>
              )}
            </div>
          ) : (
            // Default Dashboard Modules
            <div className="animate-fade-in mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-panel p-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan mb-4 group-hover:scale-110 transition-transform">
                    <PlaneTakeoff size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aviatsiya Bazasida</h3>
                  <p className="text-muted text-sm">{nodes.filter(n=>n.type==='A').length} ta aeroport va ularning IATA/ICAO kodlari.</p>
                </div>
                
                <div className="glass-panel p-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10">
                    <Train size={120} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                    <Train size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Temir Yo'llar</h3>
                  <p className="text-muted text-sm">{nodes.filter(n=>n.type==='R').length} ta poezd stansiyalari koordinatalari bilan.</p>
                </div>

                <div className="glass-panel p-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ko'p Tilli Tizim</h3>
                  <p className="text-muted text-sm">Barcha hududlar 3+ tilda xaritalangan (Geonames/Wiki).</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={(userData) => setUser(userData)}
        activeLang={activeLang}
      />

      <EditModal 
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        node={editingNode}
        activeLang={activeLang}
      />

      <ApiModal 
        isOpen={isApiOpen}
        onClose={() => setIsApiOpen(false)}
      />
    </div>
  );
}

export default App;
