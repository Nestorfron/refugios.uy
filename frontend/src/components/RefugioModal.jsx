import { useState } from "react";

import { X, Home, MapPin, Phone, Users, PlusCircle } from "lucide-react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { postData } from "../services/api";

import { useAppContext } from "../context/AppContext";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ setForm, position }) {
  useMapEvents({
    click(e) {
      setForm((prev) => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }));
    },
  });

  if (!position) return null;

  return <Marker position={position} icon={markerIcon} />;
}

export default function CreateRefugioModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const { refreshData } = useAppContext();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    lat: "",
    lng: "",
    telefono: "",
    capacidad_total: "",
    cupos_disponibles: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await postData(
        "/refugios",
        {
          nombre: form.nombre,
          direccion: form.direccion,
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
          telefono: form.telefono,
          capacidad_total: parseInt(form.capacidad_total),
          cupos_disponibles: parseInt(form.cupos_disponibles),
        },
        localStorage.getItem("token")
      );

      alert("Refugio creado correctamente");

      setForm({
        nombre: "",
        direccion: "",
        lat: "",
        lng: "",
        telefono: "",
        capacidad_total: "",
        cupos_disponibles: "",
      });

      refreshData();

      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 overflow-y-auto">
      <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-6">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-0 max-h-[95vh] flex flex-col">
          {/* HEADER */}
          <div className="bg-[#008f72] px-5 py-4 text-white flex items-center justify-between sticky top-0 z-20">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Nuevo refugio</h2>

              <p className="text-xs sm:text-sm text-white/80">
                Registrar refugio en el sistema
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <X className="cursor-pointer" />
            </button>
          </div>

          {/* BODY */}
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-5 overflow-y-auto flex-1"
          >
            {/* NOMBRE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nombre
              </label>

              <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                <Home size={18} className="text-gray-400 mr-2 shrink-0" />

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Refugio Centro"
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* DIRECCION */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Dirección
              </label>

              <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                <MapPin size={18} className="text-gray-400 mr-2 shrink-0" />

                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* MAPA */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ubicación del refugio
              </label>

              <div className="mt-2 overflow-hidden rounded-2xl border">
                <MapContainer
                  center={[-34.9011, -56.1645]}
                  zoom={13}
                  className="h-[220px] sm:h-[300px] w-full z-0"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <LocationSelector
                    setForm={setForm}
                    position={
                      form.lat && form.lng ? [form.lat, form.lng] : null
                    }
                  />
                </MapContainer>
              </div>

              {form.lat && form.lng && (
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                  <p>
                    <span className="font-semibold">Lat:</span> {form.lat}
                  </p>

                  <p>
                    <span className="font-semibold">Lng:</span> {form.lng}
                  </p>
                </div>
              )}
            </div>

            {/* TELEFONO */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Teléfono
              </label>

              <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                <Phone size={18} className="text-gray-400 mr-2 shrink-0" />

                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="099 123 456"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* CUPOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Capacidad total
                </label>

                <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                  <Users size={18} className="text-gray-400 mr-2 shrink-0" />

                  <input
                    type="number"
                    name="capacidad_total"
                    value={form.capacidad_total}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Cupos disponibles
                </label>

                <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                  <Users size={18} className="text-gray-400 mr-2 shrink-0" />

                  <input
                    type="number"
                    name="cupos_disponibles"
                    value={form.cupos_disponibles}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="sticky bottom-0 bg-white pt-2 pb-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#008f72] hover:bg-[#00715b] transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusCircle size={18} />

                {loading ? "Creando..." : "Crear refugio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
