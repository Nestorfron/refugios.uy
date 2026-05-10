import React from "react";
import { X, Clock, Thermometer, CloudRain, Activity, User } from "lucide-react";

const SidebarReport = ({ open, onClose, reportes, onSelectReport, getUrgenciaColor }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* CONTENEDOR SIDEBAR */}
      <div className="relative w-[85%] md:w-[65%] max-w-sm bg-white h-full flex flex-col shadow-2xl z-[1001] animate-in slide-in-from-left duration-300">
        
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            🚨 Reportes Activos
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* LISTA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
          {reportes.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No hay reportes para mostrar.</p>
            </div>
          ) : (
            reportes.map((r) => {
              const fecha = r.creado_en
                ? new Date(r.creado_en).toLocaleString("es-UY", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Reciente";

              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectReport(r);
                    onClose();
                  }}
                  className="group relative bg-white p-4 rounded-2xl border border-gray-100 hover:border-[#008f72]/30 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer transition-all duration-300 flex flex-col gap-3"
                >
                  {/* LÍNEA DE URGENCIA LATERAL */}
                  <div
                    className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full transition-transform group-hover:scale-y-110 ${getUrgenciaColor(r)}`}
                  />

                  <div className="flex-1 pl-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">#{r.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            r.estado === "pendiente" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          }`}>
                            {r.estado}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                          <Clock size={10} />
                          {fecha}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#008f72] bg-[#008f72]/5 px-2 py-1 rounded-lg italic">
                        {r.estado_persona || "Estándar"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                      {r.descripcion || "Sin descripción."}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {r.frio && <Badge icon={<Thermometer size={12} />} text="FRÍO" color="bg-blue-50 text-blue-600" />}
                      {r.lluvia && <Badge icon={<CloudRain size={12} />} text="LLUVIA" color="bg-indigo-50 text-indigo-600" />}
                      {r.salud && <Badge icon={<Activity size={12} />} text="SALUD" color="bg-red-50 text-red-600" />}
                      {r.esta_solo && <Badge icon={<User size={12} />} text="SOLO/A" color="bg-gray-100 text-gray-600" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-componente para los Badges (limpia el código principal)
const Badge = ({ icon, text, color }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border border-current/10 ${color}`}>
    {icon} {text}
  </div>
);

export default SidebarReport;