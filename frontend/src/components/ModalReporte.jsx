import { useState } from "react";
import { X, MapPin, AlertTriangle } from "lucide-react";

export default function ModalReporte({ open, onClose, coords }) {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const reporte = {
      descripcion,
      tipo,
      lat: coords?.lat,
      lng: coords?.lng,
    };

    console.log("REPORTE:", reporte);

    // reset
    setDescripcion("");
    setTipo("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-fadeIn">

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

          {/* TIPO */}
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded-xl p-2 text-sm"
            required
          >
            <option value="">Tipo de situación</option>
            <option>Persona durmiendo</option>
            <option>Necesita asistencia</option>
            <option>Posible riesgo</option>
          </select>

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