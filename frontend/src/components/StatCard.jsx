export default function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white px-3 py-3 lg:px-4 lg:py-4 rounded-2xl shadow-md border border-gray-100 flex items-center gap-3 w-[150px] lg:w-[170px] xl:w-[190px]">
      
      <div className="bg-gray-50 p-2 lg:p-3 rounded-xl border border-gray-100">
        {icon}
      </div>

      <div className="truncate">
        <p className="text-lg lg:text-xl xl:text-2xl font-black text-gray-950 leading-none">
          {value}
        </p>
        <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}