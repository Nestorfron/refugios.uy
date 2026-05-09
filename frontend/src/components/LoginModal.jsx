import { useState } from "react";
import { X, Mail, Lock, LogIn } from "lucide-react";

export default function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // LOGIN MOCK
    if (email === "admin@refugiosuy.com" && password === "123456") {
      onLogin?.({
        nombre: "Administrador",
        email,
      });

      onClose();
      return;
    }

    alert("Credenciales incorrectas");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="bg-[#008f72] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-sm text-white/80">
              Inicia sesión para administrar refugios
            </p>
          </div>

          <button onClick={onClose}>
            <X className="cursor-pointer" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Mail size={18} className="text-gray-400 mr-2" />

              <input
                type="email"
                placeholder="admin@refugiosuy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <div className="mt-2 flex items-center border rounded-2xl px-4 py-3">
              <Lock size={18} className="text-gray-400 mr-2" />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#008f72] hover:bg-[#00715b] transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Iniciar sesión
          </button>

        </form>
      </div>
    </div>
  );
}