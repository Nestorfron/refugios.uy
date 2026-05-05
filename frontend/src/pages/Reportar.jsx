import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, AlertTriangle } from "lucide-react";

export default function Reportar() {
  const [params] = useSearchParams();

  const lat = params.get("lat");
  const lng = params.get("lng");

  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      lat,
      lng,
      descripcion,
      tipo,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-4">

        <h1 className="font-bold text-lg flex items-center gap-2 mb-4">
          <AlertTriangle />
          Reportar situación
        </h1>

        <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
          <MapPin size={14} />
          {lat}, {lng}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">

          <select
            className="w-full border rounded-lg p-2 text-sm"
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Tipo</option>
            <option>Persona durmiendo</option>
            <option>Necesita asistencia</option>
          </select>

          <textarea
            placeholder="Descripción"
            className="w-full border rounded-lg p-2 text-sm"
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <button className="w-full bg-[#008f72] text-white py-2 rounded-lg">
            Enviar reporte
          </button>

        </form>

      </div>
    </div>
  );
}