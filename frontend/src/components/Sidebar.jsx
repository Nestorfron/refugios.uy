import RefugioCard from "./RefugioCard";
import { Home, MapPin } from "lucide-react";

export default function Sidebar({ refugios, onSelectRefugio }) {
  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#008f72]/10 flex items-center justify-center">
            <Home size={24} className="text-[#008f72]" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight leading-none">
              Refugios cercanos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Mostrando lugares próximos a tu ubicación.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between bg-[#f8fafc] border border-gray-100 rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
              Disponibles
            </p>

            <p className="text-2xl font-extrabold text-gray-900">
              {refugios.length}
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-[#008f72] flex items-center justify-center text-white shadow-sm">
            <MapPin size={20} />
          </div>
        </div>
      </div>

      {/* LISTADO */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {refugios.length > 0 ? (
          refugios.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRefugio(r)}
              className="w-full text-left transition-transform duration-200 hover:scale-[1.01]"
            >
              <RefugioCard r={r} />
            </button>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
              <Home size={36} className="text-gray-400" />
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              No hay refugios disponibles
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Todavía no existen refugios registrados en esta zona.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-5 border-t border-gray-100 bg-white/90 backdrop-blur-md">
        
      </div>
    </div>
  );
}
