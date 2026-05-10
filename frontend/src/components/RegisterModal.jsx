import { useEffect, useState } from "react";
import { X, User, Mail, Lock, Shield, UserPlus, Home } from "lucide-react";
import {  useAppContext } from "../context/AppContext";

import { registerUser, fetchData } from "../services/api";

export default function RegisterModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const { refreshData } = useAppContext();

  const [refugios, setRefugios] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    rol: "OPERADOR",
    refugio_id: "",
  });

  // CARGAR REFUGIOS
  useEffect(() => {
    if (!open) return;

    const loadRefugios = async () => {
      try {
        const data = await fetchData("/refugios");

        setRefugios(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadRefugios();
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        rol: form.rol,
      };

      // SOLO OPERADOR NECESITA REFUGIO
      if (form.rol === "OPERADOR" && form.refugio_id) {
        payload.refugio_id = parseInt(form.refugio_id);
      }

      await registerUser(
        payload.username,
        payload.email,
        payload.password,
        payload.rol,
        payload.refugio_id
      );

      alert("Usuario creado correctamente");

      setForm({
        username: "",
        email: "",
        password: "",
        rol: "OPERADOR",
        refugio_id: "",
      });

      refreshData();

      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#008f72] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Registrar usuario</h2>

            <p className="text-sm text-white/80">Crear nueva cuenta</p>
          </div>

          <button onClick={onClose}>
            <X className="cursor-pointer" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* USERNAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">Usuario</label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <User size={18} className="text-gray-400 mr-2" />

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="usuario"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Correo</label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Mail size={18} className="text-gray-400 mr-2" />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@email.com"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Lock size={18} className="text-gray-400 mr-2" />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {/* ROL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Rol</label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Shield size={18} className="text-gray-400 mr-2" />

              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              >
                <option value="OPERADOR">OPERADOR</option>

                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          {/* REFUGIO SOLO PARA OPERADOR */}
          {form.rol === "OPERADOR" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Refugio asignado
              </label>

              <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
                <Home size={18} className="text-gray-400 mr-2" />

                <select
                  name="refugio_id"
                  value={form.refugio_id}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                >
                  <option value="">Seleccionar refugio</option>

                  {refugios.map((refugio) => (
                    <option key={refugio.id} value={refugio.id}>
                      {refugio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008f72] hover:bg-[#00715b] transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus size={18} />

            {loading ? "Registrando..." : "Registrar usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}
