import RefugioCard from "./RefugioCard";

export default function Sidebar({ refugios }) {
  return (
    <div className="flex flex-col h-full overflow">
      <div className="p-7 pb-5 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Refugios cercanos
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Mostrando lugares a menos de 5km.
        </p>
      </div>

      <div className="p-4 bg-white overflow-y-auto flex-1 space-y-4.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-hide">
        {refugios.map((r) => (
          <RefugioCard key={r.id} r={r} />
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button className="w-full py-3.5 border-2 border-[#008f72]/20 text-[#008f72] rounded-2xl font-bold text-[15px] hover:bg-[#008f72]/5 hover:border-[#008f72]/30 transition-all active:scale-[0.99]">
          Ver todos los refugios
        </button>
      </div>
    </div>
  );
}