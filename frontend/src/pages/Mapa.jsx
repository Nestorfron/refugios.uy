import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../context/AppContext";
import pinIcon from "../assets/pin.svg";

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
  const { refugios, reportes } = useAppContext();
  const mapRef = useRef(null);
  const reportRefs = useRef({}); // Usamos plural para mayor claridad

  const [userLocation, setUserLocation] = useState(null);
  const [followUser, setFollowUser] = useState(true);

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
    const color =
      rep.estado_persona === "critico"
        ? "#ef4444"
        : rep.salud
        ? "#f97316"
        : "#f59e0b";
    return new L.DivIcon({
      className: "",
      html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
    });
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
        {refugios.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={refugioIcon}
            eventHandlers={{ click: () => setFollowUser(false) }}
          >
            <Popup>
              <h3 className="font-bold">{r.nombre}</h3>
              <p className="text-xs">{r.direccion}</p>
              <p className="text-xs font-semibold">Cupos: {r.cupos_disponibles}</p>
            </Popup>
          </Marker>
        ))}

        {/* REPORTES (Solo una vez y dentro de MapContainer) */}
        {mostrarReportes &&
          reportes.map((rep) => (
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
                          {rep.creado_en ? new Date(rep.creado_en).toLocaleDateString("es-UY") : "Reciente"}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                      rep.estado_persona === "critico" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {rep.estado_persona || "Estándar"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rep.descripcion || "Sin descripción."}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {rep.salud && <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-red-100">SALUD</span>}
                    {rep.frio && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100">❄️ FRÍO</span>}
                    {rep.lluvia && <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-100">🌧️ LLUVIA</span>}
                  </div>
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