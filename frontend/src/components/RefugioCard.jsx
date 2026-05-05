import { MapPin, Phone } from "lucide-react";

export default function RefugioCard({ r }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5">

      <img
        src={r.imagen}
        alt={r.nombre}
        className="w-28 h-28 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          
          <div>
            <h3 className="font-extrabold text-[15px] text-gray-950 leading-tight group-hover:text-[#008f72] transition-colors">
              {r.nombre}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5">
              <MapPin size={12} className="text-gray-400" />
              {r.direccion}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-[#008f72] leading-none">
              {r.cupos}
            </p>
            <p className="text-[9px] text-gray-400 font-bold uppercase">
              cupos
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end mt-3">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <Phone size={12} className="text-gray-400" />
            {r.telefono}
          </p>

          <p className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-full border">
            {r.distancia}
          </p>
        </div>
      </div>
    </div>
  );
}