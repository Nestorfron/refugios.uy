import RefugioCard from "./RefugioCard";

import {
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({
  refugios,
  onSelectRefugio,
}) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#008f72] to-[#00b894] px-4 sm:px-6 py-5 sm:py-6 text-white border-b border-white/10">
        
        {/* EFECTO */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative">
          
          {/* TOP */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            
            {/* ICON */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-3xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
              <Home size={24} className="sm:w-7 sm:h-7" />
            </div>

            {/* TEXT */}
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight break-words">
                Refugios cercanos
              </h2>

              <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
                Lugares disponibles cerca de tu ubicación.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 gap-3">
            
            {/* TOTAL */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-white/60 font-bold">
                    Refugios
                  </p>

                  <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                    {refugios.length}
                  </p>
                </div>

                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-white/15 flex items-center justify-center">
                  <MapPin size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {refugios.length > 0 ? (
          refugios.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRefugio(r)}
              className="w-full text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              <RefugioCard r={r} />
            </button>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
            
            {/* EMPTY ICON */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#008f72]/10 blur-2xl rounded-full" />

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-white shadow-xl border border-gray-100 flex items-center justify-center">
                <Home
                  size={36}
                  className="sm:w-[42px] sm:h-[42px] text-[#008f72]"
                />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800">
              No hay refugios
            </h3>

            <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs">
              Todavía no existen refugios registrados
              en esta zona o filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}