import {
  MapPin,
  Phone,
  Users,
  ChevronRight,
} from "lucide-react";

import refugioIcon from "../assets/favicon.svg";

export default function RefugioCard({ r }) {
  const disponible = Number(r.cupos || 0) > 0;

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
      
      {/* EFECTO */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,#00b89410,transparent_45%)]" />

      <div className="relative flex">
        
        {/* IMAGE */}
        <div className="relative w-24 h-24 shrink-0 overflow-hidden">
          <img
            src={r.imagen || refugioIcon}
            alt={r.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* CUPOS */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md rounded-xl px-2 py-1 shadow">
            <div className="flex items-center gap-1">
              <Users
                size={10}
                className="text-[#008f72]"
              />

              <span className="text-[10px] font-extrabold text-gray-900">
                {r.cupos}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          
          {/* TOP */}
          <div>
            <div className="flex items-start justify-between gap-2">
              
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-gray-900 leading-tight truncate group-hover:text-[#008f72] transition-colors">
                  {r.nombre}
                </h3>

                <div className="mt-1 flex items-start gap-1 text-[11px] text-gray-500">
                  <MapPin
                    size={11}
                    className="mt-[2px] shrink-0"
                  />

                  <span className="line-clamp-1">
                    {r.direccion}
                  </span>
                </div>
              </div>

              <ChevronRight
                size={15}
                className="text-gray-300 group-hover:text-[#008f72] group-hover:translate-x-1 transition-all shrink-0"
              />
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-2 flex items-center justify-between gap-2">
            
            {/* PHONE */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 min-w-0">
              <Phone size={10} className="shrink-0" />

              <span className="truncate">
                {r.telefono || "Sin teléfono"}
              </span>
            </div>

            {/* STATUS */}
            <div
              className={`px-2 py-1 rounded-full text-[9px] font-bold border whitespace-nowrap ${
                disponible
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-700 border-red-100"
              }`}
            >
              {disponible
                ? r.distancia || "Disponible"
                : "Sin cupos"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}