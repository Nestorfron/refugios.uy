import { useState } from "react";
import RefugioCard from "./RefugioCard";
import UserRefugioCard from "./userRefugioCard";


import {
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({ refugios, userRef, onSelectRefugio, }) {

  const [editingField, setEditingField] = useState(null);

  const [formData, setFormData] = useState({
    nombre: userRef?.nombre || "",
    direccion: userRef?.direccion || "",
    telefono: userRef?.telefono || "",
    email: userRef?.email || "",
    cupos: userRef?.cupos || "",
  });

  console.log(userRef)


  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">

      {/* User Refugio */}

      {userRef? (
        <div className="px-2 pt-2">

          <button
            key={userRef.id}
            onClick={() => onSelectRefugio(userRef)}
            className="w-full text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
          >
            <UserRefugioCard
              r={userRef}
              editingField={editingField}
              setEditingField={setEditingField}
              formData={formData}
              setFormData={setFormData}
            />
          </button>
        </div>) : ("")
      }
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