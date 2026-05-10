import { useEffect, useState } from "react";
import Mapa from "../pages/Mapa";
import ModalReporte from "../components/ModalReporte";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import CreateRefugioModal from "../components/RefugioModal";

import { useAppContext } from "../context/AppContext";

import Sidebar from "../components/Sidebar";
import SidebarReport from "../components/SidebarReport";
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
  User,
  UserPlus,
  Building2,
  LogOut,
} from "lucide-react";

export default function Home() {
  const { user, refugios, totalCupos, reportes, loading, logout } =
    useAppContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createRefugioOpen, setCreateRefugioOpen] = useState(false);
  const [selectedRefugio, setSelectedRefugio] = useState(null);
  const [search, setSearch] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  

  useEffect(() => {
    if (
      selectedRefugio &&
      !refugiosFiltrados.some((r) => r.id === selectedRefugio.id)
    ) {
      setSelectedRefugio(null);
    }
  }, [search, soloDisponibles, refugios]);

  // LOGIN
  const [loginOpen, setLoginOpen] = useState(false);

  // REGISTER
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleUserButton = () => {
    if (user) {
      const confirmar = window.confirm("¿Seguro que querés cerrar sesión?");

      if (confirmar) {
        logout();
      }

      return;
    }

    setLoginOpen(true);
  };

  // FILTROS

  const refugiosFiltrados = refugios.filter((r) => {
    const coincideBusqueda = r.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const coincideDisponibles = soloDisponibles
      ? Number(r.cupos || 0) > 0
      : true;

    return coincideBusqueda && coincideDisponibles;
  });


  const getUrgenciaColor = (r) => {
    if (r.estado_persona === "critico") return "bg-red-500";
    if (r.salud) return "bg-orange-400";
    if (r.frio || r.lluvia) return "bg-yellow-400";
    return "bg-blue-400";
  };

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
        <nav className="hidden lg:flex gap-8 font-semibold text-gray-700"></nav>

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

          {/* REGISTER */}
          {user?.rol === "ADMIN" && (
            <button
              onClick={() => setRegisterOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
            >
              <UserPlus size={20} />
            </button>
          )}

          {/* CREATE REFUGIO */}
          {user?.rol === "ADMIN" && (
            <button
              onClick={() => setCreateRefugioOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
            >
              <Building2 size={20} />
              <p className="flex font-bold">+</p>
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          <button
            onClick={handleUserButton}
            className={`flex items-center justify-center w-11 h-11 rounded-2xl transition shadow-sm ${
              user
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#008f72] hover:bg-[#00715b] text-white"
            }`}
            title={user ? "Cerrar sesión" : "Iniciar sesión"}
          >
            {user ? <LogOut size={20} /> : <User size={20} />}
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
            selectedRefugio={selectedRefugio}
            selectedReport={selectedReport}
            onMapClick={(latlng) => {
              setCoords(latlng);
              setModalOpen(true);
            }}
          />

          {/* BUSCADOR + FILTROS */}
          <div className="absolute top-5 left-12 right-5 md:right-auto z-[1000]">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* SEARCH */}
              <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center px-4 py-3 shadow-2xl w-full md:w-[360px]">
                <Search size={18} className="text-gray-400 mr-3 shrink-0" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar refugios..."
                  className="outline-none w-full bg-transparent text-sm font-medium placeholder:text-gray-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* FILTRO */}
              <button
                onClick={() => setSoloDisponibles(!soloDisponibles)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl shadow-xl border transition-all font-semibold text-sm backdrop-blur-xl ${
                  soloDisponibles
                    ? "bg-[#008f72] text-white border-[#008f72]"
                    : "bg-white/95 text-gray-700 border-white/40 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal size={16} />
                Disponibles
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    soloDisponibles ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR DESKTOP */}
        <aside className="flex ms-auto max-w-[25%] hidden md:flex bg-white/80 backdrop-blur-xl border-l z-20">
          <Sidebar
            refugios={refugiosFiltrados}
            onSelectRefugio={setSelectedRefugio}
          />
        </aside>

        {/* SIDEBAR MOBILE */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex">
            <div className="w-[65%] max-w-sm bg-white h-full flex flex-col">
              <div className="p-5 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Menú</h2>

                <X
                  onClick={() => setSidebarOpen(false)}
                  className="cursor-pointer"
                />
              </div>

              <Sidebar
                refugios={refugiosFiltrados}
                onSelectRefugio={setSelectedRefugio}
              />
            </div>

            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* BARRA INFERIOR */}
        <div className="ms-10 hidden lg:flex absolute bottom-6 left-6 right-[420px] z-20 gap-3 flex-wrap justify-center">
          <StatCard
            value={refugios.length}
            label="Refugios"
            icon={<HomeIcon size={18} />}
          />

          <StatCard
            value={totalCupos}
            label="Cupos"
            icon={<HomeIcon size={18} />}
          />

          <div onClick={() => setReportsOpen(true)} className="cursor-pointer">
            <StatCard
              value={reportes.length}
              label="Reportes"
              icon={<AlertTriangle size={18} />}
            />
          </div>

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

      {/* LOGIN */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* REGISTER */}
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />

      {/* CREATE REFUGIO */}
      <CreateRefugioModal
        open={createRefugioOpen}
        onClose={() => setCreateRefugioOpen(false)}
      />

      {/* SIDEBAR REPORTS */}
      <SidebarReport
        open={reportsOpen}
        onClose={() => setReportsOpen(false)}
        reportes={reportes}
        onSelectReport={setSelectedReport}
        getUrgenciaColor={getUrgenciaColor}
      />
    </div>
  );
}
