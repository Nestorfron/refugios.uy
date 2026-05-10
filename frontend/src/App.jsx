import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

// 📄 Pages
import Home from "./pages/Home";
import Mapa from "./pages/Mapa";


function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateSW, setUpdateSW] = useState(() => () => {});

  useEffect(() => {
    const updateServiceWorker = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
      onOfflineReady() {
        console.log("App lista para funcionar offline 🚀");
      },
    });

    setUpdateSW(() => updateServiceWorker);
  }, []);

  const handleUpdate = () => {
    updateSW();
    setUpdateAvailable(false);
    window.location.reload();
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 🏠 Home */}
          <Route path="/" element={<Home />} />

          {/* 🗺️ Mapa */}
          <Route path="/mapa" element={<Mapa />} />
        </Routes>
      </BrowserRouter>

      {/* 🔄 Update banner (mejorado con Tailwind) */}
      {updateAvailable && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-center z-50 flex items-center justify-center gap-4">
          <span>🔄 Nueva versión disponible</span>
          <button
            onClick={handleUpdate}
            className="bg-white text-gray-900 px-3 py-1 rounded font-medium"
          >
            Actualizar
          </button>
        </div>
      )}
    </>
  );
}

export default App;