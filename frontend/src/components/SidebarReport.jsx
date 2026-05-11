import React, { useState } from "react";
import {
  X,
  Clock,
  Thermometer,
  CloudRain,
  Activity,
  User,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { putData } from "../services/api";
import { useAppContext } from "../context/AppContext";

const Badge = ({ icon, text, color }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-current/10 ${color}`}
  >
    {icon}
    {text}
  </div>
);

export default function SidebarReport({
  open,
  onClose,
  reportes,
  onSelectReport,
  getUrgenciaColor,
}) {
  const [loadingId, setLoadingId] = useState(null);

  const { refreshData } = useAppContext();

  if (!open) return null;

  const handleChangeStatus = async (r, e) => {
    e.stopPropagation();

    try {
      setLoadingId(r.id);

      await putData(
        `/reportes/${r.id}`,
        {
          estado:
            r.estado === "pendiente"
              ? "cerrado"
              : "pendiente",
        },
        localStorage.getItem("token")
      );

      refreshData();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <div className="relative w-[88%] md:w-[65%] max-w-md h-full bg-[#f8fafc] shadow-2xl z-[1001] flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#008f72] to-[#00b894] px-5 py-5 text-white border-b border-white/10">
          
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">
                    Reportes activos
                  </h2>

                  <p className="text-sm text-white/80">
                    Situaciones registradas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {reportes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <AlertTriangle size={40} className="mb-3 opacity-40" />

              <p className="font-semibold">
                No hay reportes disponibles
              </p>
            </div>
          ) : (
            reportes.map((r) => {
              const fecha = r.creado_en
                ? new Date(r.creado_en).toLocaleString(
                    "es-UY",
                    {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "Reciente";

              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectReport(r);
                    onClose();
                  }}
                  className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 hover:border-[#008f72]/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer"
                >
                  {/* COLOR LATERAL */}
                  <div
                    className={`absolute left-0 top-5 bottom-5 w-1.5 rounded-r-full ${getUrgenciaColor(
                      r
                    )}`}
                  />

                  <div className="p-4 pl-5">
                    {/* TOP */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-gray-900">
                            #{r.id}
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              r.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {r.estado}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                          <Clock size={11} />
                          {fecha}
                        </div>
                      </div>

                      <div className="px-2 py-1 rounded-lg bg-[#008f72]/5 text-[#008f72] text-[11px] font-bold capitalize">
                        {r.estado_persona || "Normal"}
                      </div>
                    </div>

                    {/* DESC */}
                    <p className="text-sm leading-relaxed text-gray-600 mb-4">
                      {r.descripcion ||
                        "Sin descripción proporcionada"}
                    </p>

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {r.frio && (
                        <Badge
                          icon={<Thermometer size={12} />}
                          text="FRÍO"
                          color="bg-blue-50 text-blue-600"
                        />
                      )}

                      {r.lluvia && (
                        <Badge
                          icon={<CloudRain size={12} />}
                          text="LLUVIA"
                          color="bg-indigo-50 text-indigo-600"
                        />
                      )}

                      {r.salud && (
                        <Badge
                          icon={<Activity size={12} />}
                          text="SALUD"
                          color="bg-red-50 text-red-600"
                        />
                      )}

                      {r.esta_solo && (
                        <Badge
                          icon={<User size={12} />}
                          text="SOLO"
                          color="bg-gray-100 text-gray-700"
                        />
                      )}
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-end">
                      <button
                        onClick={(e) =>
                          handleChangeStatus(r, e)
                        }
                        disabled={loadingId === r.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-md ${
                          r.estado === "pendiente"
                            ? "bg-gradient-to-r from-[#008f72] to-[#00b894] hover:opacity-90 text-white"
                            : "bg-gray-900 hover:bg-black text-white"
                        }`}
                      >
                        {r.estado === "pendiente" ? (
                          <Eye size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}

                        {loadingId === r.id
                          ? "Procesando..."
                          : r.estado === "pendiente"
                          ? "Cerrar reporte"
                          : "Reabrir"}
                      </button>
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
}