import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useAppContext } from "../context/AppContext";

// ICONOS
const refugioIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [30, 30],
});

const reporteIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  iconSize: [28, 28],
});

// CLICK HANDLER
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng);
    },
  });

  return null;
};

// RECENTER USER
const RecenterMap = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 15);
    }
  }, [userLocation, map]);

  return null;
};

// FOCUS REFUGIO
const FocusRefugio = ({ refugio }) => {
  const map = useMap();

  useEffect(() => {
    if (refugio) {
      map.setView([refugio.lat, refugio.lng], 17, {
        animate: true,
      });
    }
  }, [refugio, map]);

  return null;
};

// BOTÓN CENTRAR
const BotonCentrar = ({
  userLocation,
  mapRef,
  setUserLocation,
}) => {
  const handleClick = () => {
    // SI YA TENEMOS UBICACIÓN
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15, {
        animate: true,
      });

      return;
    }

    // SI NO TENEMOS UBICACIÓN
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setUserLocation(coords);

        if (mapRef.current) {
          mapRef.current.setView(coords, 15, {
            animate: true,
          });
        }
      },
      (err) => {
        console.log("No se pudo obtener ubicación", err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      className="
        absolute bottom-6 left-6 z-[1000]
        w-14 h-14
        rounded-2xl
        bg-white
        border border-gray-200
        shadow-2xl
        flex items-center justify-center
        hover:scale-105
        hover:bg-gray-50
        active:scale-95
        transition-all
      "
      title="Centrar ubicación"
    >
      <LocateFixed
        size={24}
        className="text-[#008f72] z-100"
      />
    </button>
  );
};

const Mapa = ({
  mostrarReportes = false,
  onMapClick,
  selectedRefugio,
}) => {
  const { refugios, reportes } = useAppContext();

  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);

  // GEOLOCALIZACIÓN INICIAL
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      (err) => {
        console.log("No se pudo obtener ubicación", err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[-34.9011, -56.1645]}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* RECENTRAR AUTOMÁTICO */}
        <RecenterMap userLocation={userLocation} />

        {/* FOCUS REFUGIO */}
        <FocusRefugio refugio={selectedRefugio} />

        {/* CLICK MAPA */}
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
      </MapContainer>

      {/* BOTÓN CENTRAR */}
      <BotonCentrar
        userLocation={userLocation}
        mapRef={mapRef}
        setUserLocation={setUserLocation}
      />
    </div>
  );
};

export default Mapa;