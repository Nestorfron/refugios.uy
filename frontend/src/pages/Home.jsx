import { useState } from "react";
import Mapa from "../pages/Mapa";
import ModalReporte from "../components/ModalReporte";
import LoginModal from "../components/LoginModal";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

import {
  Search,
  SlidersHorizontal,
  Home as HomeIcon,
  AlertTriangle,
  Menu,
  Heart,
  ChevronDown,
  X,
  User
} from "lucide-react";

export default function Home() {
  const [refugios] = useState([
    {
      id: 1,
      nombre: "Refugio Centro",
      direccion: "Mercedes 1234, Centro",
      telefono: "099 123 456",
      cupos: 12,
      distancia: "500 m",
      imagen:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400",
    },
    {
      id: 2,
      nombre: "Casa Abierta",
      direccion: "Canelones 1450, Centro",
      telefono: "098 765 432",
      cupos: 8,
      distancia: "1.2 km",
      imagen:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400",
    },
    {
      id: 3,
      nombre: "Refugio Norte",
      direccion: "Av. Italia 3200, Aguada",
      telefono: "094 555 789",
      cupos: 15,
      distancia: "1.8 km",
      imagen:
        "https://images.unsplash.com/photo-1486406146926-c627a92af1bd?q=80&w=400",
    },
    {
      id: 4,
      nombre: "Hogar Solidario",
      direccion: "Bvar Artigas 1999, Unión",
      telefono: "097 246 810",
      cupos: 5,
      distancia: "2.1 km",
      imagen:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOGIN
  const [loginOpen, setLoginOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased text-gray-900">
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-30 shadow-sm">
        {/* LOGO */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#008f72] rounded-2xl flex items-center justify-center text-white">
            <HomeIcon size={22} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold">RefugiosUY</h1>
            <p className="text-xs text-gray-400">Red de apoyo y solidaridad</p>
          </div>
        </div>

        {/* NAV DESKTOP */}
        <nav className="hidden lg:flex gap-8 font-semibold text-gray-700">
          <button className="text-[#008f72] border-b-2 border-[#008f72]">
            Mapa
          </button>

          <button>Refugios</button>

          <button>Cómo ayudar</button>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* REPORTAR */}
          <button
            onClick={() => setModalOpen(true)}
            className="hidden md:flex items-center gap-2 border rounded-xl px-4 py-2 text-sm hover:bg-gray-50 transition"
          >
            <AlertTriangle size={16} className="text-red-500" />
            Reportar
          </button>

          {/* LOGIN */}
          {/* LOGIN */}
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#008f72] text-white hover:bg-[#00715b] transition shadow-sm"
          >
            {usuario ? (
              <span className="text-sm font-bold">
                {usuario.nombre.charAt(0)}
              </span>
            ) : (
              <User size={20} />
            )}
          </button>

          {/* MOBILE MENU */}
          <Menu
            size={26}
            onClick={() => setSidebarOpen(true)}
            className="md:hidden cursor-pointer"
          />
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">
        {/* MAPA */}
        <div className="absolute inset-0 z-0">
          <Mapa
            mostrarReportes={true}
            onMapClick={(latlng) => {
              setCoords(latlng);
              setModalOpen(true);
            }}
          />

          {/* BUSCADOR */}
          <div className="hidden md:flex absolute top-6 left-6 z-50 gap-3">
            <div className="bg-white rounded-xl flex items-center px-4 py-3 shadow-md w-[300px]">
              <Search size={18} className="text-gray-400 mr-2" />

              <input
                type="text"
                placeholder="Buscar refugios..."
                className="outline-none w-full"
              />
            </div>

            <button className="bg-white rounded-xl px-4 py-3 shadow-md flex items-center gap-2 hover:bg-gray-50 transition">
              <SlidersHorizontal size={16} />
              Filtros
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:flex absolute right-0 top-0 bottom-0 w-[410px] bg-white/80 backdrop-blur-xl border-l z-20">
          <Sidebar refugios={refugios} />
        </aside>

        {/* SIDEBAR MOBILE */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex">
            <div className="w-[85%] max-w-sm bg-white h-full flex flex-col">
              <div className="p-5 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Menú</h2>

                <X
                  onClick={() => setSidebarOpen(false)}
                  className="cursor-pointer"
                />
              </div>

              <Sidebar refugios={refugios} />
            </div>

            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* BARRA INFERIOR */}
        <div className="ms-10 hidden lg:flex absolute bottom-6 left-6 right-[420px] z-20 gap-3 flex-wrap justify-center">
          <StatCard value="28" label="Refugios" icon={<HomeIcon size={18} />} />

          <StatCard value="190" label="Cupos" icon={<HomeIcon size={18} />} />

          <StatCard
            value="7"
            label="Reportes"
            icon={<AlertTriangle size={18} />}
          />

          <div className="bg-white px-3 py-3 lg:px-4 lg:py-4 rounded-2xl shadow-md border border-gray-100 flex items-center gap-3 w-[150px] lg:w-[170px] xl:w-[190px]">
            <Heart size={20} className="text-red-500" />

            <div>
              <p className="font-bold text-sm">Tu ayuda</p>

              <p className="text-xs text-gray-500">Hace la diferencia</p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL REPORTE */}
      <ModalReporte
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        coords={coords}
      />

      {/* LOGIN MODAL */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(user) => setUsuario(user)}
      />
    </div>
  );
}
