import { useState } from "react";
import {
  X,
  MapPin,
  AlertTriangle,
  Thermometer,
  CloudRain,
  Activity,
  User,
} from "lucide-react";

import { postData } from "../services/api";
import { useAppContext } from "../context/AppContext";

export default function ModalReporte({ open, onClose, coords }) {
  const [descripcion, setDescripcion] = useState("");
  const [estadoPersona, setEstadoPersona] = useState("");
  const [estaSolo, setEstaSolo] = useState(false);
  const [frio, setFrio] = useState(false);
  const [lluvia, setLluvia] = useState(false);
  const [salud, setSalud] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshData, user } = useAppContext();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const reporte = {
        descripcion,
        estado_persona: estadoPersona,
        esta_solo: estaSolo,
        frio,
        lluvia,
        salud,
        lat: coords?.lat,
        lng: coords?.lng,
      };

      await postData(
        "/reportes",
        reporte,
        localStorage.getItem("token")
      );

      if (user === null) {
        alert("Reporte creado correctamente");
      } else {
        refreshData();
      }

      setDescripcion("");
      setEstadoPersona("");
      setEstaSolo(false);
      setFrio(false);
      setLluvia(false);
      setSalud(false);

      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const CheckCard = ({
    active,
    onClick,
    icon,
    label,
    activeColor,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-sm font-semibold ${
        active
          ? `${activeColor} border-transparent shadow-lg scale-[1.02]`
          : "bg-white border-gray-200 text-gray-600 hover:border-[#008f72]/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP */}
        <div className="relative bg-gradient-to-br from-[#008f72] to-[#00b894] px-6 py-6 text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

          <div className="relative flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h2 className="font-extrabold text-xl">
                    Reportar situación
                  </h2>

                  <p className="text-sm text-white/80">
                    Ayudanos a identificar personas en riesgo
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-white/90 bg-white/10 w-fit px-3 py-2 rounded-xl">
                <MapPin size={15} />

                {coords
                  ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : "Seleccioná un punto"}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 bg-[#f8fafc]"
        >
          {/* ESTADO */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Estado de la persona
            </label>

            <select
              value={estadoPersona}
              onChange={(e) =>
                setEstadoPersona(e.target.value)
              }
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#008f72]/20"
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="estable">🟢 Estable</option>
              <option value="critico">🔴 Crítico</option>
              <option value="inconsciente">
                ⚫ Inconsciente
              </option>
            </select>
          </div>

          {/* OPCIONES */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">
              Situación detectada
            </label>

            <div className="grid grid-cols-2 gap-3">
              <CheckCard
                active={estaSolo}
                onClick={() => setEstaSolo(!estaSolo)}
                icon={<User size={18} />}
                label="Está solo"
                activeColor="bg-gray-900 text-white"
              />

              <CheckCard
                active={frio}
                onClick={() => setFrio(!frio)}
                icon={<Thermometer size={18} />}
                label="Tiene frío"
                activeColor="bg-blue-500 text-white"
              />

              <CheckCard
                active={lluvia}
                onClick={() => setLluvia(!lluvia)}
                icon={<CloudRain size={18} />}
                label="Lluvia"
                activeColor="bg-indigo-500 text-white"
              />

              <CheckCard
                active={salud}
                onClick={() => setSalud(!salud)}
                icon={<Activity size={18} />}
                label="Problema salud"
                activeColor="bg-red-500 text-white"
              />
            </div>
          </div>

          {/* DESCRIPCION */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              placeholder="Agregá detalles importantes..."
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm outline-none resize-none focus:ring-2 focus:ring-[#008f72]/20"
            />
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#008f72] to-[#00b894] hover:opacity-90 text-white text-sm font-bold shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}