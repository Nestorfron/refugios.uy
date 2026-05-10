const BASE_URL = import.meta.env.VITE_API_URL;


const buildUrl = (endpoint) => {
  return `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
};

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
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...extraHeaders,
  };

  const options = {
    method,
    headers,
    mode: "cors",
    credentials: "include",
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  let res;

  try {
    res = await fetch(url, options);
  } catch (err) {
    console.error("Error de red:", err);

    throw new Error(
      "No se pudo conectar con el servidor"
    );
  }

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {

    console.error("ERROR BACKEND:");
    console.error("Status:", res.status);
    console.error("Respuesta:", data);
  
    throw new Error(
      data?.msg ||
      data?.error ||
      JSON.stringify(data) ||
      `${method} ${url} → ${res.status}`
    );
  }

  return data;
};

// ============================
// 📡 Métodos públicos
// ============================

export const fetchData = (
  endpoint,
  token
) =>
  request(endpoint, "GET", null, token);

export const postData = async (
  endpoint,
  payload,
  token
) => {

  return await request(
    endpoint,
    "POST",
    payload,
    token
  );
};

export const putData = (
  endpoint,
  payload,
  token
) =>
  request(
    endpoint,
    "PUT",
    payload,
    token
  );

export const deleteData = (
  endpoint,
  token
) =>
  request(
    endpoint,
    "DELETE",
    null,
    token
  );

// ============================
// 🔐 Auth
// ============================

export const loginUser = (
  email,
  password
) =>
  request(
    "/login",
    "POST",
    { email, password }
  );

export const registerUser = (
  username,
  email,
  password,
  rol,
  refugio_id = null
) =>
  request(
    "/users",
    "POST",
    {
      username,
      email,
      password,
      rol,
      refugio_id,
    }
  );