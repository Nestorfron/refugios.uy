import React, { createContext, useState, useEffect, useContext } from "react";

import { fetchData } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [refugios, setRefugios] = useState([]);

  const [reportes, setReportes] = useState([]);

  const [loading, setLoading] = useState(true);

  // TOTAL CUPOS
  const totalCupos = refugios.reduce((acc, refugio) => {
    return acc + Number(refugio.cupos || 0);
  }, 0);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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
    
        setReportes(await fetchData("/reportes", localStorage.getItem("token")));
       
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    const token = localStorage.getItem("token");

    const refugiosData = await fetchData("/refugios");

    setRefugios(refugiosData);

    setReportes(await fetchData("/reportes", token));
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
