import { useState } from "react";
import { X, MapPin, AlertTriangle } from "lucide-react";
import { postData } from "../services/api";
import { useAppContext } from "../context/AppContext";

export default function ModalReporte({ open, onClose, coords }) {
  const [descripcion, setDescripcion] = useState("");
  const [estadoPersona, setEstadoPersona] = useState("");
  const [estaSolo, setEstaSolo] = useState(false);
  const [frio, setFrio] = useState(false);
  const [lluvia, setLluvia] = useState(false);
  const [salud, setSalud] = useState(false);


  const { refreshData, user } = useAppContext();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      await postData("/reportes", reporte, localStorage.getItem("token"));

      if (user === null) {
        alert("Reporte creado correctamente");
        onClose();
        return;
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Reportar situación
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* UBICACION */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <MapPin size={14} />
          {coords
            ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "Seleccioná un punto en el mapa"}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ESTADO PERSONA */}
          <select
            value={estadoPersona}
            onChange={(e) => setEstadoPersona(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm"
            required
          >
            <option value="">Estado de la persona</option>
            <option value="estable">Estable</option>
            <option value="critico">Crítico</option>
            <option value="inconsciente">Inconsciente</option>
          </select>

          {/* CHECKS */}
          <div className="flex flex-col gap-2 text-sm">
            <label>
              <input
                type="checkbox"
                checked={estaSolo}
                onChange={(e) => setEstaSolo(e.target.checked)}
              />{" "}
              Está solo
            </label>

            <label>
              <input
                type="checkbox"
                checked={frio}
                onChange={(e) => setFrio(e.target.checked)}
              />{" "}
              Tiene frío
            </label>

            <label>
              <input
                type="checkbox"
                checked={lluvia}
                onChange={(e) => setLluvia(e.target.checked)}
              />{" "}
              Expuesto a lluvia
            </label>

            <label>
              <input
                type="checkbox"
                checked={salud}
                onChange={(e) => setSalud(e.target.checked)}
              />{" "}
              Problema de salud
            </label>
          </div>

          {/* DESCRIPCION */}
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción breve (opcional)"
            className="w-full border rounded-xl p-2 text-sm"
            rows={3}
          />

          {/* BOTONES */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-xl py-2 text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#008f72] text-white rounded-xl py-2 text-sm font-semibold"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
