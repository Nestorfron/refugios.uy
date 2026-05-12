import React, { createContext, useState, useEffect, useContext } from "react";

import { fetchData } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [refugios, setRefugios] = useState([]);

  const [userRefugio, setUserRefugio] = useState(null);

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
    setUserRefugio(null)

    setUser(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    const token = localStorage.getItem("token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const loadData = async () => {
      try {

        const refugiosData = await fetchData("/refugios");

        setRefugios(refugiosData);

        if (token) {

          const id = (JSON.parse(savedUser).id)

          const userRefugioData = await fetchData("/refugios/usuario/" + id, localStorage.getItem("token"));

          if (!userRefugioData) {

            setUserRefugio(null);

          } else {

            setUserRefugio(userRefugioData);

          }

          const reportesData = await fetchData("/reportes", localStorage.getItem("token"));

          setReportes(reportesData);

          const reportesAbiertos = reportesData.filter((r) => r.estado === "pendiente");

          setReportesAbiertos(reportesAbiertos);

          const reportesCerrados = reportesData.filter((r) => r.estado === "cerrado");

          setReportesCerrados(reportesCerrados);

        } else {

          setReportes([]);

          setUserRefugio(null)

        }

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

      const savedUser = localStorage.getItem("user");

      const refugiosData = await fetchData("/refugios");

      setRefugios(refugiosData);

      if (token) {

        const id = (JSON.parse(savedUser).id)

        const userRefugioData = await fetchData("/refugios/usuario/" + id, localStorage.getItem("token"));

        if (!userRefugioData) {

            setUserRefugio(null);

          } else {

            setUserRefugio(userRefugioData);

          }

        const reportesData = await fetchData("/reportes", token);

        setReportes(reportesData);

        const reportesAbiertos = reportesData.filter((r) => r.estado === "pendiente");

        setReportesAbiertos(reportesAbiertos);

        const reportesCerrados = reportesData.filter((r) => r.estado === "cerrado");

        setReportesCerrados(reportesCerrados);

      } else {

        setReportes([]);

        setUserRefugio(null);

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

        userRefugio,

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
