import React, { createContext, useState, useEffect, useContext } from "react";

import { fetchData } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [refugios, setRefugios] = useState([]);

  const [reportes, setReportes] = useState([]);

  const [reportesCerrados, setReportesCerrados] = useState([]);

  const [reportesAbiertos, setReportesAbiertos] = useState([]);

  const [loading, setLoading] = useState(true);

  // TOTAL CUPOS
  const totalCupos = refugios.reduce((acc, refugio) => {
    return acc + Number(refugio.cupos || 0);
  }, 0);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setReportes([]);
    setReportesCerrados([]);
    setReportesAbiertos([]);

    setUser(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const loadData = async () => {
      try {
    
        const refugiosData = await fetchData("/refugios");
    
        setRefugios(refugiosData);

        const reportesData = await fetchData("/reportes", localStorage.getItem("token"));

        setReportes(reportesData);

        const reportesAbiertos = reportesData.filter((r) => r.estado === "pendiente");

        setReportesAbiertos(reportesAbiertos);

        const reportesCerrados = reportesData.filter((r) => r.estado === "cerrado");

        setReportesCerrados(reportesCerrados);
       
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
  try {
    const token = localStorage.getItem("token");

    const refugiosData = await fetchData("/refugios");
    setRefugios(refugiosData);

    if (token) {
      const reportesData = await fetchData("/reportes", token);
      setReportes(reportesData);

      const reportesAbiertos = reportesData.filter((r) => r.estado === "pendiente");

      setReportesAbiertos(reportesAbiertos);

      const reportesCerrados = reportesData.filter((r) => r.estado === "cerrado");

      setReportesCerrados(reportesCerrados);

    } else {

      setReportes([]);

    }

  } catch (error) {

    console.error(error);
    
  }
};

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,

        refugios,
        setRefugios,

        reportes,
        setReportes,

        reportesCerrados,
        setReportesCerrados,

        reportesAbiertos,
        setReportesAbiertos,

        refreshData,

        loading,

        totalCupos,

        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
