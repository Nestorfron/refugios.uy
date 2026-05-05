// ===============================
// 🏠 REFUGIOS
// ===============================
export const refugiosMock = [
    {
      id: 1,
      nombre: "Refugio Centro",
      direccion: "Mercedes 1234",
      telefono: "099 123 456",
      lat: -34.9015,
      lng: -56.1645,
      capacidad_total: 50,
      cupos_disponibles: 12,
    },
    {
      id: 2,
      nombre: "Casa Abierta",
      direccion: "Canelones 1450",
      telefono: "098 765 432",
      lat: -34.9030,
      lng: -56.1700,
      capacidad_total: 30,
      cupos_disponibles: 8,
    },
    {
      id: 3,
      nombre: "Hogar Solidario",
      direccion: "Bvar Artigas 1999",
      telefono: "097 246 810",
      lat: -34.8950,
      lng: -56.1800,
      capacidad_total: 40,
      cupos_disponibles: 5,
    },
    {
      id: 4,
      nombre: "Refugio Norte",
      direccion: "Av. Italia 3500",
      telefono: "091 555 222",
      lat: -34.8800,
      lng: -56.1500,
      capacidad_total: 60,
      cupos_disponibles: 20,
    },
  ];
  
  
  // ===============================
  // 🚨 REPORTES (solo admin)
  // ===============================
  export const reportesMock = [
    {
      id: 1,
      lat: -34.9020,
      lng: -56.1650,
      descripcion: "Persona durmiendo en la vereda",
      estado: "pendiente",
      creado_en: "2026-05-04T20:00:00",
    },
    {
      id: 2,
      lat: -34.9040,
      lng: -56.1680,
      descripcion: "Persona desorientada",
      estado: "pendiente",
      creado_en: "2026-05-04T19:30:00",
    },
    {
      id: 3,
      lat: -34.8990,
      lng: -56.1600,
      descripcion: "Posible problema de salud",
      estado: "atendido",
      creado_en: "2026-05-04T18:00:00",
    },
  ];