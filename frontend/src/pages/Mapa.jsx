import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { refugiosMock, reportesMock } from "../data/mockData";
import L from "leaflet";
import { AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";


// ICONOS
const refugioIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [30, 30],
});

const reporteIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  iconSize: [28, 28],
});


// CLICK HANDLER (para modal)
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng);
    },
  });
  return null;
};

const CenterButton = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: "bottomright" });

    control.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

      const root = createRoot(div);

      root.render(
        <button
          className="absolute bottom-3 right-3 z-[1000] bg-white p-2 rounded-full shadow-md active:scale-90 transition"
          onClick={() => {
            if (userLocation) {
              map.setView(userLocation, 15);
            }
          }}
          style={{
            background: "green",
            color: "white",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            cursor: "pointer",
          }}
        >
          <AlertTriangle size={26} />
        </button>
      );

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, userLocation]);

  return null;
};

const Mapa = ({ mostrarReportes = false, onMapClick }) => {
  const [refugios] = useState(refugiosMock);
  const [reportes] = useState(reportesMock);
  const [userLocation, setUserLocation] = useState(null);

  // GEOLOCALIZACIÓN
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log("No se pudo obtener ubicación");
      }
    );
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={userLocation || [-34.9011, -56.1645]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={onMapClick} />

        {/* REFUGIOS */}
        {refugios.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={refugioIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{r.nombre}</h3>
                <p className="text-xs">{r.direccion}</p>
                <p className="text-xs">
                  Cupos: {r.cupos_disponibles}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* REPORTES */}
        {mostrarReportes &&
          reportes.map((rep) => (
            <Marker
              key={rep.id}
              position={[rep.lat, rep.lng]}
              icon={reporteIcon}
            >
              <Popup>{rep.descripcion}</Popup>
            </Marker>
          ))}

        <CenterButton userLocation={userLocation} />
      </MapContainer>
    </div>
  );
};

export default Mapa;