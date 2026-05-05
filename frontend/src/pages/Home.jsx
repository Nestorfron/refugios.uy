import { useState } from "react";
import Mapa from "../pages/Mapa";
import ModalReporte from "../components/ModalReporte";

import {
  Search,
  SlidersHorizontal,
  Home as HomeIcon,
  AlertTriangle,
  Menu,
  MapPin,
  Phone,
  Heart,
  ChevronDown,
  X // Importamos X para cerrar el menú mobile
} from "lucide-react";

export default function Home() {
  // Datos extendidos para que coincidan con la imagen
  const [refugios] = useState([
    { id: 1, nombre: "Refugio Centro", direccion: "Mercedes 1234, Centro", telefono: "099 123 456", cupos: 12, distancia: "500 m", imagen: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400" },
    { id: 2, nombre: "Casa Abierta", direccion: "Canelones 1450, Centro", telefono: "098 765 432", cupos: 8, distancia: "1.2 km", imagen: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400" },
    { id: 3, nombre: "Refugio Norte", direccion: "Av. Italia 3200, Aguada", telefono: "094 555 789", cupos: 15, distancia: "1.8 km", imagen: "https://images.unsplash.com/photo-1486406146926-c627a92af1bd?q=80&w=400" },
    { id: 4, nombre: "Hogar Solidario", direccion: "Bvar Artigas 1999, Unión", telefono: "097 246 810", cupos: 5, distancia: "2.1 km", imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased text-gray-900">

      {/* 1. NAVBAR SUPERIOR (Identico a la imagen) */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-3.5">
          {/* Logo */}
          <div className="w-11 h-11 bg-[#008f72] rounded-2xl flex items-center justify-center text-white shadow-inner">
            <HomeIcon size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-950 tracking-tight leading-none">RefugiosUY</h1>
            <p className="text-xs text-gray-400 mt-0.5">Red de apoyo y solidaridad</p>
          </div>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-semibold text-gray-700">
          <button className="text-[#008f72] border-b-2 border-[#008f72] pb-1.5 px-1">Mapa</button>
          <button className="hover:text-[#008f72] transition-colors pb-1.5 px-1">Refugios</button>
          <button className="hover:text-[#008f72] transition-colors pb-1.5 px-1">Cómo ayudar</button>
          <button className="hover:text-[#008f72] transition-colors pb-1.5 px-1">Sobre la iniciativa</button>
        </nav>

        <div className="flex items-center gap-4">
          {/* Botón Reportar Principal (Desktop) */}
          <button
            onClick={() => setModalOpen(true)}
            className="hidden md:flex items-center gap-2.5 border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            <AlertTriangle size={17} className="text-red-500" />
            Reportar situación
          </button>

          {/* MENU MOBILE ICON */}
          <Menu
            className="lg:hidden cursor-pointer text-gray-800 hover:text-[#008f72]"
            size={26}
            onClick={() => setSidebarOpen(true)}
          />
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">

        {/* 2. MAPA (FONDO TOTAL) */}
        <div className="absolute inset-0 z-0">
          <Mapa
            mostrarReportes={true}
            onMapClick={(latlng) => {
              setCoords(latlng);
              setModalOpen(true);
            }}
          />

          {/* BUSCADOR Y FILTROS SOBRE EL MAPA (Desktop) */}
          <div className="hidden md:flex absolute top-6 left-6 z-20 gap-3">
            <div className="bg-white shadow-xl rounded-2xl flex items-center px-5 py-3.5 w-[380px] border border-gray-100/50 backdrop-blur-sm bg-white/95">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Buscar dirección o lugar"
                className="outline-none text-[15px] w-full placeholder:text-gray-400 bg-transparent"
              />
            </div>

            <button className="bg-white shadow-xl rounded-2xl px-5 py-3.5 border border-gray-100/50 flex items-center gap-2 text-[15px] font-semibold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all">
              <SlidersHorizontal size={18} className="text-gray-600" />
              Filtros
              <ChevronDown size={16} className="text-gray-400 ml-1" />
            </button>
          </div>

          {/* LEYENDA (Mejorada visualmente) */}
          <div className="hidden md:block absolute top-6 right-[430px] z-20 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 text-xs border border-gray-100/50 space-y-2.5 font-medium text-gray-700">
            <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 bg-[#008f72] rounded-full shadow"></span> Refugios</div>
            <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow"></span> Reportes recientes</div>
          </div>
        </div>

        {/* 3. SIDEBAR DESKTOP (Efecto Glassmorphism) */}
        <aside className="hidden md:flex absolute right-0 top-0 bottom-0 w-[410px] bg-white/80 backdrop-blur-xl border-l border-gray-100 z-20 flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.03)]">
          <Sidebar refugios={refugios} />
        </aside>

        {/* 4. SIDEBAR MOBILE (Mejorado) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex animate-fadeInTransition">
            <div className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Menú</h2>
                    <X className="cursor-pointer text-gray-500" onClick={() => setSidebarOpen(false)} />
                </div>
                <nav className="flex flex-col gap-3 p-5 text-lg font-medium text-gray-700">
                  <button className="text-left py-2 text-[#008f72]">Mapa</button>
                  <button className="text-left py-2 hover:text-[#008f72]">Refugios</button>
                  <button className="text-left py-2 hover:text-[#008f72]">Cómo ayudar</button>
                  <button className="text-left py-2 hover:text-[#008f72]">Sobre la iniciativa</button>
                  <button
                    onClick={() => { setModalOpen(true); setSidebarOpen(false); }}
                    className="flex items-center gap-2.5 border border-red-200 bg-red-50 rounded-xl px-5 py-3 text-sm font-semibold text-red-800 mt-4"
                  >
                    <AlertTriangle size={17} />
                    Reportar situación
                  </button>
                </nav>
                <div className="border-t mt-auto">
                    <Sidebar refugios={refugios} />
                </div>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* 5. SECCIÓN INFERIOR: STATS Y CARD REPORTAR (Flotantes) */}
        <div className="hidden md:flex absolute bottom-8 left-8 right-[440px] z-20 gap-5 items-end">
          
          {/* Card Reportar Flotante (Izquierda) */}
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 w-[300px] flex-shrink-0 animate-floatUp">
             <div className="flex gap-4 items-start mb-4">
               <div className="bg-green-50 p-3 rounded-2xl text-[#008f72] shadow-inner border border-green-100">
                 <HomeIcon size={24} strokeWidth={2}/>
                </div>
               <div>
                 <p className="text-[15px] font-bold text-gray-950 leading-tight">¿Ves a alguien que necesita ayuda?</p>
                 <p className="text-xs text-gray-500 mt-1">Podés reportar una situación de calle de forma anónima y segura.</p>
               </div>
             </div>
             <button onClick={() => setModalOpen(true)} className="w-full bg-[#008f72] hover:bg-[#007660] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-colors active:scale-[0.98] shadow-md">
               <AlertTriangle size={16}/> Reportar situación
             </button>
          </div>

          {/* Grid de Stats + Tu Ayuda */}
          <div className="flex flex-1 gap-5">
            <StatCard icon={<HomeIcon className="text-green-600"/>} value="28" label="Refugios disponibles" />
            <StatCard icon={<div className="flex -space-x-1.5"><div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow"/><div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow"/></div>} value="190" label="Cupos disponibles" />
            <StatCard icon={<AlertTriangle className="text-orange-500"/>} value="7" label="Reportes recientes (últimas 24hs)" />

            {/* Card Tu Ayuda */}
            <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4.5 flex-1 max-w-[280px]">
              <div className="bg-red-50 p-4 rounded-full text-red-500 shadow-inner border border-red-100">
                <Heart className="animate-pulseHeart" fill="currentColor" size={26}/>
              </div>
              <div>
                <p className="font-extrabold text-lg text-gray-950 leading-tight">Tu ayuda</p>
                <p className="text-xs text-gray-500 mt-0.5">Hace la diferencia</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. BUSCADOR MOBILE (Abajo para fácil acceso) */}
        <div className="md:hidden fixed top-24 left-4 right-4 z-30">
             <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl flex items-center px-4 py-3 border border-gray-100">
              <Search size={18} className="text-gray-400 mr-3" />
              <input type="text" placeholder="Buscar dirección o refugio" className="outline-none text-sm w-full bg-transparent" />
              <SlidersHorizontal size={16} className="text-gray-500 ml-2" />
            </div>
        </div>

        {/* 7. BOTÓN FLOATING MOBILE REPORTAR (Esquina) */}
        <button
          onClick={() => setModalOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 bg-[#008f72] text-white p-5 rounded-full shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
        >
          <AlertTriangle size={26} />
        </button>
      </main>

      <ModalReporte open={modalOpen} onClose={() => setModalOpen(false)} coords={coords} />
    </div>
  );
}

/* ================= COMPONENTES AUXILIARES MEJORADOS ================= */

/* SIDEBAR (Con scroll elegante) */
function Sidebar({ refugios }) {
  return (
    <div className="flex flex-col h-full">
        <div className="p-7 pb-5 border-b border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">Refugios cercanos</h2>
          <p className="text-sm text-gray-500 mt-1">Mostrando lugares a menos de 5km.</p>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-4.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {refugios.map((r) => (
            <RefugioCard key={r.id} r={r} />
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full py-3.5 border-2 border-[#008f72]/20 text-[#008f72] rounded-2xl font-bold text-[15px] hover:bg-[#008f72]/5 hover:border-[#008f72]/30 transition-all active:scale-[0.99]">
              Ver todos los refugios
            </button>
        </div>
    </div>
  );
}

/* STATS (Jerarquía tipográfica exacta) */
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-5 flex-1 min-w-[220px]">
      <div className="bg-gray-50 p-3.5 rounded-2xl shadow-inner border border-gray-100">{icon}</div>
      <div>
        <p className="text-4xl font-black text-gray-950 leading-none tracking-tighter">{value}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

/* CARD DE REFUGIO (Diseño horizontal idéntico) */
function RefugioCard({ r }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0">
      <img src={r.imagen} alt={r.nombre} className="w-28 h-28 object-cover transition-transform duration-500 group-hover:scale-105" />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
              <h3 className="font-extrabold text-[15px] text-gray-950 leading-tight group-hover:text-[#008f72] transition-colors">{r.nombre}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5">
                <MapPin size={12} className="text-gray-400" /> {r.direccion}
              </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-[#008f72] leading-none tracking-tight">{r.cupos}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">cupos</p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-3 gap-2">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Phone size={12} className="text-gray-400" /> {r.telefono}
            </p>
            <p className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">{r.distancia}</p>
        </div>
      </div>
    </div>
  );
}