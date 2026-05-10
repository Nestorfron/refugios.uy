import { useState } from "react";
import {
  X,
  Mail,
  Lock,
  LogIn,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

import { loginUser } from "../services/api";

export default function LoginModal({
  open,
  onClose,
  onLogin,
}) {

  const [loading, setLoading] = useState(false);
  const { setUser, refreshData } = useAppContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(
        form.email,
        form.password
      );

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      onClose();
      refreshData();

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#008f72] p-6 text-white flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Bienvenido
            </h2>

            <p className="text-sm text-white/80">
              Inicia sesión
            </p>
          </div>

          <button onClick={onClose}>
            <X className="cursor-pointer" />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Mail
                size={18}
                className="text-gray-400 mr-2"
              />

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
              <Lock
                size={18}
                className="text-gray-400 mr-2"
              />

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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008f72] hover:bg-[#00715b] transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn size={18} />

            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </div>
  );
}