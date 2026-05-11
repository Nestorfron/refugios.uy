import { Loader2, Heart } from "lucide-react";
import Logo from "../assets/favicon.svg";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f8fafc] flex items-center justify-center overflow-hidden">
      {/* BACKGROUND BLUR */}
      <div className="absolute w-[500px] h-[500px] bg-[#008f72]/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* LOGO */}
        <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100 overflow-hidden">
          <img
            src={Logo}
            alt="RefugiosUY"
            className="w-20 h-20 object-contain animate-[pulse_2s_ease-in-out_infinite]"
          />
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
          RefugiosUY
        </h1>

        <p className="mt-2 text-sm text-gray-500 text-center max-w-xs">
          Cargando refugios, reportes y datos en tiempo real...
        </p>

        {/* LOADER */}
        <div className="mt-8 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100">
          <Loader2
            size={22}
            className="animate-spin text-[#008f72]"
          />

          <span className="text-sm font-semibold text-gray-700">
            Inicializando sistema
          </span>
        </div>

        {/* EXTRA INFO */}
        <div className="mt-10 flex items-center gap-2 text-xs text-gray-400">
          <Heart size={14} className="text-red-400" />

          <span>Red de apoyo y solidaridad</span>
        </div>
      </div>
    </div>
  );
}