import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { refugiosMock, reportesMock } from "../data/mockData";
import L from "leaflet";
import { AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";

// ICONOS
const refugioIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [30, 30],
});

const reporteIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  iconSize: [28, 28],
});

// CLICK HANDLER (map click manual)
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng);
    },
  });
  return null;
};

// BOTÓN CENTRAR + GUARDAR UBICACIÓN
const BotonCentrar = ({ userLocation, mapRef, setUserLocation, onMapClick }) => {
  const handleClick = () => {
    // Si ya tenemos ubicación → usarla
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);

      // opcional: usarla como punto de reporte
      onMapClick?.({
        lat: userLocation[0],
        lng: userLocation[1],
      });

      return;
    }

    // Si NO tenemos ubicación → pedirla
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];

        setUserLocation(coords);

        if (mapRef.current) {
          mapRef.current.setView(coords, 15);
        }

        // opcional: mandar ubicación para reporte
        onMapClick?.({
          lat: coords[0],
          lng: coords[1],
        });
      },
      () => {
        console.log("No se pudo obtener ubicación");
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      className="absolute left-3 bottom-10 z-[1000]
                 bg-green-600 hover:bg-green-700 text-white
                 p-3 rounded-full shadow-lg transition active:scale-90"
    >
      <AlertTriangle size={26} />
    </button>
  );
};

const Mapa = ({ mostrarReportes = false, onMapClick }) => {
  const [refugios] = useState(refugiosMock);
  const [reportes] = useState(reportesMock);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);

  // GEOLOCALIZACIÓN INICIAL (opcional)
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
        ref={mapRef}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={onMapClick} />

        {/* REFUGIOS */}
        {refugios.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={refugioIcon}>
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
      </MapContainer>

      {/* BOTÓN INTELIGENTE */}
      <BotonCentrar
        userLocation={userLocation}
        mapRef={mapRef}
        setUserLocation={setUserLocation}
        onMapClick={onMapClick}
      />
    </div>
  );
};

export default Mapa;