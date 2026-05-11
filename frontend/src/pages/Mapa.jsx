import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { LocateFixed, MapPin, Phone, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../context/AppContext";
import pinIcon from "../assets/pin.svg";
import Logo from "../assets/favicon.svg";

/* ICONOS */
const refugioIcon = new L.Icon({
  iconUrl: pinIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#1e90ff;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
});

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/* CLICK MAPA */
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng);
    },
  });
  return null;
};

/* COMPONENTE PRINCIPAL */
const Mapa = ({
  mostrarReportes = false,
  onMapClick,
  selectedRefugio,
  selectedReport,
}) => {
  const { refugios, reportesAbiertos } = useAppContext();
  const mapRef = useRef(null);
  const reportRefs = useRef({});

  const [userLocation, setUserLocation] = useState(null);
  const [followUser, setFollowUser] = useState(true);

  const refugiosConDistancia = refugios
    .map((r) => {
      if (!userLocation) {
        return {
          ...r,
          distancia: null,
        };
      }

      const distancia = calcularDistancia(
        userLocation[0],
        userLocation[1],
        Number(r.lat),
        Number(r.lng)
      );

      return {
        ...r,
        distancia,
      };
    })
    .sort((a, b) => {
      if (a.distancia == null) return 1;
      if (b.distancia == null) return -1;

      return a.distancia - b.distancia;
    });

  /* 1. GPS TRACKING */
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
      },
      (err) => console.log("❌ GPS error", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* 2. AUTO CENTRADO EN USUARIO */
  useEffect(() => {
    if (followUser && userLocation && mapRef.current) {
      mapRef.current.flyTo(userLocation, 16, { animate: true, duration: 1.5 });
    }
  }, [userLocation, followUser]);

  /* 3. ENFOQUE EN REPORTE SELECCIONADO */
  useEffect(() => {
    if (selectedReport && mapRef.current) {
      const { id, lat, lng } = selectedReport;
      setFollowUser(false);

      mapRef.current.flyTo([lat, lng], 17, {
        animate: true,
        duration: 1.2,
      });

      const timer = setTimeout(() => {
        const marker = reportRefs.current[id];
        if (marker) {
          marker.openPopup();
        }
      }, 1100);

      return () => clearTimeout(timer);
    }
  }, [selectedReport]);

  /* 4. ENFOQUE EN REFUGIO SELECCIONADO */
  useEffect(() => {
    if (selectedRefugio && mapRef.current) {
      setFollowUser(false);
      mapRef.current.flyTo([selectedRefugio.lat, selectedRefugio.lng], 17, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedRefugio]);

  /* ICONOS DINÁMICOS PARA REPORTES */
  const getReporteIcon = (rep) => {
    const outerColor =
      rep.estado_persona === "critico"
        ? "#ef4444"
        : rep.salud
        ? "#f97316"
        : "#facc15";

    const innerColor =
      rep.estado_persona === "critico"
        ? "#dc2626"
        : rep.salud
        ? "#ea580c"
        : "#f59e0b";

    return new L.DivIcon({
      className: "",
      html: `
        <div
          style="
            width:64px;
            height:64px;
            display:flex;
            align-items:center;
            justify-content:center;
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
            animation:pulseWarning 2s infinite;
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="48"
            height="48"
          >
            <!-- TRIANGULO EXTERNO -->
            <path
              d="M32 4 L60 56 H4 Z"
              fill="${outerColor}"
              stroke="white"
              stroke-width="2"
            />
  
            <!-- TRIANGULO INTERNO -->
            <path
              d="M32 12 L52 50 H12 Z"
              fill="${innerColor}"
            />
  
            <!-- SIGNO -->
            <rect
              x="30"
              y="20"
              width="4"
              height="20"
              rx="2"
              fill="#111"
            />
  
            <circle
              cx="32"
              cy="46"
              r="3"
              fill="#111"
            />
          </svg>
        </div>
  
        <style>
          @keyframes pulseWarning {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.08);
            }
            100% {
              transform: scale(1);
            }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [26, 48],
      popupAnchor: [0, -42],
    });
  };

  /* NAVEGACIÓN */

  const abrirNavegacion = (lat, lng, label = "") => {
    const destino = `${lat},${lng}`;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}&destination_place_id=${encodeURIComponent(
      label
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[-34.9011, -56.1645]}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={onMapClick} />

        {/* REFUGIOS */}
        {refugiosConDistancia.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={refugioIcon}
            eventHandlers={{
              click: () => setFollowUser(false),
            }}
          >
            <Popup className="custom-popup">
              <div className="w-[240px] overflow-hidden rounded-2xl">
                {/* IMAGE */}
                <div className="relative h-32 overflow-hidden rounded-t-2xl">
                  <img
                    src={r.imagen || Logo}
                    alt={r.nombre}
                    className="w-full h-full object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* CUPOS */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-extrabold text-[#008f72]">
                      {r.cupos_disponibles} cupos
                    </span>
                  </div>

                  {/* TITLE */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">
                      {r.nombre}
                    </h3>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 bg-white">
                  {/* ADDRESS */}
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin
                      size={15}
                      className="text-[#008f72] mt-0.5 shrink-0"
                    />

                    <span className="leading-relaxed">{r.direccion}</span>
                  </div>

                  {/* PHONE */}
                  {r.telefono && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <Phone size={15} className="text-[#008f72]" />

                      <span>{r.telefono}</span>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="mt-4 flex items-center justify-between">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        Number(r.cupos_disponibles) > 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {Number(r.cupos_disponibles) > 0
                        ? "Disponible"
                        : "Sin cupos"}
                    </div>

                    {r.distancia != null && (
                      <span className="text-xs text-gray-400 font-semibold">
                        {r.distancia.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  {/* NAVEGACIÓN */}
                  <button
                    onClick={() => abrirNavegacion(r.lat, r.lng, r.nombre)}
                    className="m-auto border p-2 rounded mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#008f72] transition"
                  >
                    <Navigation size={13} />
                    Cómo llegar
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* REPORTES (Solo una vez y dentro de MapContainer) */}
        {mostrarReportes &&
          reportesAbiertos.map((rep) => (
            <Marker
              key={rep.id}
              position={[rep.lat, rep.lng]}
              icon={getReporteIcon(rep)}
              ref={(el) => (reportRefs.current[rep.id] = el)}
              eventHandlers={{ click: () => setFollowUser(false) }}
            >
              <Popup minWidth={250} maxWidth={300}>
                <div className="flex flex-col gap-3 p-1 font-sans">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚨</span>
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 leading-none">
                          Reporte #{rep.id}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">
                          {rep.creado_en
                            ? new Date(rep.creado_en).toLocaleDateString(
                                "es-UY"
                              )
                            : "Reciente"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                        rep.estado_persona === "critico"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {rep.estado_persona || "Estándar"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {rep.descripcion || "Sin descripción."}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {rep.salud && (
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-red-100">
                        SALUD
                      </span>
                    )}
                    {rep.frio && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100">
                        ❄️ FRÍO
                      </span>
                    )}
                    {rep.lluvia && (
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-100">
                        🌧️ LLUVIA
                      </span>
                    )}
                  </div>

                  {/* NAVEGACIÓN */}
                  <button
                    onClick={() =>
                      abrirNavegacion(rep.lat, rep.lng, `Reporte ${rep.id}`)
                    }
                    className="m-auto p-2 border rounded mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-amber-600 transition"
                  >
                    <Navigation size={13} />
                    Ir al lugar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* UBICACIÓN USUARIO */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Estás aquí</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* BOTÓN CENTRAR GPS */}
      <button
        onClick={() => {
          setFollowUser(true);
          if (userLocation && mapRef.current) {
            mapRef.current.flyTo(userLocation, 16, { animate: true });
          }
        }}
        className={`absolute bottom-6 left-6 z-[1000] w-14 h-14 rounded-2xl border shadow-2xl flex items-center justify-center transition-all ${
          followUser ? "bg-[#008f72] text-white" : "bg-white text-gray-600"
        }`}
      >
        <LocateFixed size={24} />
      </button>
    </div>
  );
};

export default Mapa;
