import {
  MapPin,
  Phone,
  Users,
  Pencil,
  Check,
  Mail,
  Home,
} from "lucide-react";

import refugioIcon from "../assets/favicon.svg";

export default function UserRefugioCard({
  r,
  editingField,
  setEditingField,
  formData,
  setFormData,
}) {
  const disponible = Number(r.cupos || 0) > 0;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const RowField = ({
    icon,
    label,
    field,
    value,
    type = "text",
  }) => {
    const isEditing = editingField === field;

    return (
      <div className="flex items-start gap-2 py-2 border-b border-gray-100">
        
        <div className="mt-0.5 text-[#008f72]">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          
          <p className="text-[10px] uppercase font-bold tracking-wide text-gray-400">
            {label}
          </p>

          {isEditing ? (
            <input
              autoFocus
              type={type}
              value={formData[field] || ""}
              onChange={(e) =>
                handleChange(field, e.target.value)
              }
              className="w-full text-sm bg-transparent border-none outline-none text-gray-800 p-0 mt-0.5"
            />
          ) : (
            <p className="text-sm text-gray-800 break-words">
              {formData[field] || value || "Sin datos"}
            </p>
          )}
        </div>

        <button
          onClick={() =>
            setEditingField(isEditing ? null : field)
          }
          className="text-gray-400 hover:text-[#008f72] transition shrink-0"
        >
          {isEditing ? (
            <Check size={15} />
          ) : (
            <Pencil size={14} />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* HEADER */}
      <div className="relative h-28">
        
        <img
          src={r.imagen || refugioIcon}
          alt={r.nombre}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-3 left-3 right-3">
          
          <div className="flex items-center justify-between gap-2">
            
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-widest text-emerald-200 uppercase">
                Mi refugio
              </p>

              <h2 className="text-white font-bold text-sm truncate">
                {r.nombre}
              </h2>
            </div>

            <div
              className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                disponible
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {r.cupos} cupos
            </div>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="px-3 py-2">
        
        <RowField
          icon={<Home size={14} />}
          label="Nombre"
          field="nombre"
          value={r.nombre}
        />

        <RowField
          icon={<MapPin size={14} />}
          label="Dirección"
          field="direccion"
          value={r.direccion}
        />

        <RowField
          icon={<Phone size={14} />}
          label="Teléfono"
          field="telefono"
          value={r.telefono}
          type="tel"
        />

        <RowField
          icon={<Mail size={14} />}
          label="Email"
          field="email"
          value={r.email}
          type="email"
        />

        <RowField
          icon={<Users size={14} />}
          label="Cupos"
          field="cupos"
          value={r.cupos}
          type="number"
        />
      </div>
    </div>
  );
}