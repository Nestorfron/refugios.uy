const BASE_URL = import.meta.env.VITE_API_URL;

// 🔗 Construye URL limpia
const buildUrl = (endpoint) => {
  return `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
};

// 🔥 Core request (una sola función para todo)
const request = async (
  endpoint,
  method = "GET",
  payload = null,
  token = null,
  extraHeaders = {}
) => {
  const url = buildUrl(endpoint);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders,
  };

  const options = {
    method,
    headers,
    mode: "cors",
    credentials: "include", // importante si usás cookies/JWT
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    console.error("Error de red:", err);
    throw new Error("No se pudo conectar con el servidor");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // puede no haber JSON (ej: DELETE vacío)
  }

  if (!res.ok) {
    throw new Error(
      data?.error || `${method} ${url} → ${res.status}`
    );
  }

  return data;
};


// ============================
// 📡 Métodos públicos
// ============================

export const fetchData = (endpoint, token) =>
  request(endpoint, "GET", null, token);

export const postData = (endpoint, payload, token) =>
  request(endpoint, "POST", payload, token);

export const putData = (endpoint, payload, token) =>
  request(endpoint, "PUT", payload, token);

export const deleteData = (endpoint, token) =>
  request(endpoint, "DELETE", null, token);


// ============================
// 🔐 Auth
// ============================

export const loginUser = (email, password) =>
  request("/login", "POST", { email, password });
