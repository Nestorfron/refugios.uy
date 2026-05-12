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
import LoadingScreen from "../components/LoadingScreen";

import Logo from "../assets/favicon.svg";



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
  MapPin,
} from "lucide-react";

export default function Home() {
  const {
    user,
    refugios,
    userRefugio,
    totalCupos,
    reportesAbiertos,
    reportesCerrados,
    loading,
    logout,
  } = useAppContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refugiosOpen, setRefugiosOpen] = useState(false);

  const [createRefugioOpen, setCreateRefugioOpen] = useState(false);

  const [selectedRefugio, setSelectedRefugio] = useState(null);

  const [search, setSearch] = useState("");

  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const [reportsOpen, setReportsOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // LOGIN
  const [loginOpen, setLoginOpen] = useState(false);

  // REGISTER
  const [registerOpen, setRegisterOpen] = useState(false);

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


  useEffect(() => {
    if (
      selectedRefugio &&
      !refugiosFiltrados.some((r) => r.id === selectedRefugio.id)
    ) {
      setSelectedRefugio(null);
    }
  }, [search, soloDisponibles, refugios]);

  const handleUserButton = () => {
    if (user) {
      setShowLogoutModal(true);

      return;
    }

    setLoginOpen(true);
  };

  const getUrgenciaColor = (r) => {
    if (r.estado_persona === "critico") return "bg-red-500";

    if (r.salud) return "bg-orange-400";

    if (r.frio || r.lluvia) return "bg-yellow-400";

    return "bg-blue-400";
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8fafc] overflow-hidden font-sans antialiased text-gray-900">
      {/* NAVBAR */}
      <header className="relative bg-white/90 backdrop-blur-2xl border-b border-white/20 px-4 md:px-6 py-4 flex items-center justify-between z-30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* EFECTO */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,#00b89415,transparent_40%)]" />

        {/* LOGO */}
        <div className="relative flex items-center gap-4">
          {/* ICON */}
          <div className="relative">
            {/* GLOW */}
            <div className="absolute inset-0 bg-[#00b894]/20 blur-xl rounded-full" />

            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#008f72] to-[#00b894] rounded-3xl flex items-center justify-center overflow-hidden shadow-xl border border-white/20">
              <img
                src={Logo}
                alt="RefugiosUY"
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
              RefugiosUY
            </h1>

            <p className="text-sm text-gray-500 mt-1 font-medium">
              Red de apoyo y solidaridad
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="relative flex items-center gap-2 md:gap-3">
          {/* REGISTER */}
          {user?.rol === "ADMIN" && (
            <button
              onClick={() => setRegisterOpen(true)}
              className="group flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white border border-gray-200 hover:border-[#008f72]/30 hover:bg-[#008f72]/5 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <UserPlus
                size={20}
                className="text-gray-700 group-hover:text-[#008f72] transition-colors"
              />
            </button>
          )}

          {/* CREATE REFUGIO */}
          {user?.rol === "ADMIN" && (
            <button
              onClick={() => setCreateRefugioOpen(true)}
              className="group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#008f72] to-[#00b894] text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.03] transition-all duration-300 overflow-hidden"
            >
              {/* EFECTO */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />

              <Building2 size={18} className="relative" />

              <span className="absolute top-1 right-1 text-[10px] font-black">
                +
              </span>
            </button>
          )}

          {/* MOBILE ACTIONS */}
          <div className="md:hidden flex items-center gap-2">
            {/* REFUGIOS */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#008f72] to-[#00b894] shadow-lg shadow-emerald-500/20 overflow-hidden border border-white/20"
            >
              {/* EFECTO */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />

              <MapPin size={20} className="relative text-white" />
            </button>

            {/* REPORTES */}
            {user?.rol === "ADMIN" && (
              <button
                onClick={() => setReportsOpen(true)}
                className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20 overflow-hidden border border-white/20"
              >
                {/* EFECTO */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />

                <AlertTriangle
                  size={20}
                  className="relative text-white animate-pulse"
                />
              </button>
            )}
          </div>

          {/* LOGIN / LOGOUT */}
          <button
            onClick={handleUserButton}
            title={user ? "Cerrar sesión" : "Iniciar sesión"}
            className={`group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
              user
                ? "bg-gradient-to-br from-red-500 to-red-600 hover:scale-[1.03] text-white"
                : "bg-gradient-to-br from-[#008f72] to-[#00b894] hover:scale-[1.03] text-white"
            }`}
          >
            {/* EFECTO */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />

            {user ? (
              <LogOut size={19} className="relative" />
            ) : (
              <User size={19} className="relative" />
            )}
          </button>
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden min-h-0">
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
        </div>

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
                userRef={userRefugio}
                onSelectRefugio={(r) => {
                  setSelectedRefugio(r);
                }}
              />
            </div>

            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* SIDEBAR REFUGIOS */}
        {refugiosOpen && (
          <div className="fixed inset-0 z-[1000] flex">
            {/* OVERLAY */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setRefugiosOpen(false)}
            />

            {/* PANEL */}
            <div className="relative w-[90%] md:w-[420px] h-full bg-white shadow-2xl z-[1001] animate-in slide-in-from-left duration-300">
              <Sidebar
                refugios={refugiosFiltrados}
                userRef={userRefugio}
                onSelectRefugio={(r) => {
                  setSelectedRefugio(r);
                }}
              />
            </div>
          </div>
        )}

        {/* BOTTOM BAR */}
        <div className="ms-10 hidden lg:flex absolute bottom-6 left-6 right-6 z-20 gap-4 flex-wrap justify-center">
          {/* REFUGIOS */}
          <div
            onClick={() => setRefugiosOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.03]"
          >
            <StatCard
              value={refugios.length}
              label="Refugios"
              icon={
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <HomeIcon size={18} />
                </div>
              }
            />
          </div>

          {/* CUPOS */}
          <div className="transition-transform hover:scale-[1.03]">
            <StatCard
              value={totalCupos}
              label="Cupos"
              icon={
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <HomeIcon size={18} />
                </div>
              }
            />
          </div>

          {/* REPORTES */}
          <div
            onClick={() => setReportsOpen(true)}
            className="cursor-pointer transition-transform hover:scale-[1.03]"
          >
            <StatCard
              value={reportesAbiertos.length}
              label="Reportes"
              icon={
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
                  <AlertTriangle size={18} />
                </div>
              }
            />
          </div>

          {/* INFO */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#008f72] to-[#00b894] px-5 py-4 rounded-3xl shadow-2xl border border-white/20 flex items-center gap-4 min-w-[230px]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

            <div className="relative w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Heart size={24} className="text-white animate-pulse" />
            </div>

            <div className="relative">
              <p className="font-extrabold text-white text-sm tracking-wide">
                Tu ayuda importa
              </p>

              <p className="text-xs text-white/80 leading-relaxed">
                Cada reporte puede salvar una vida.
              </p>
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
        reportes={reportesAbiertos}
        onSelectReport={setSelectedReport}
        getUrgenciaColor={getUrgenciaColor}
      />

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* MODAL */}
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-300">
            {/* EFECTO */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,#ef444420,transparent_45%)]" />

            <div className="relative p-7">
              {/* ICON */}
              <div className="mx-auto mb-5 relative w-20 h-20">
                {/* GLOW */}
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />

                <div className="relative w-full h-full rounded-[28px] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl shadow-red-500/20">
                  <LogOut size={34} className="text-white" />
                </div>
              </div>

              {/* TEXT */}
              <div className="text-center">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  Cerrar sesión
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-gray-500 max-w-sm mx-auto">
                  ¿Seguro que querés cerrar sesión en{" "}
                  <span className="font-bold text-[#008f72]">RefugiosUY</span>?
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {/* CANCEL */}
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="h-12 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancelar
                </button>

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutModal(false);
                  }}
                  className="group relative overflow-hidden h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all duration-300"
                >
                  {/* EFECTO */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />

                  <span className="relative flex items-center justify-center gap-2">
                    <LogOut size={16} />
                    Salir
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
