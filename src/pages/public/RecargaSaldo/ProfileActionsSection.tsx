import { useState } from "react";

interface ActionButton {
  id: string;
  label: string;
}

const actionButtons: ActionButton[] = [
  { id: "recargar-saldo", label: "Recargar saldo" },
  { id: "perfil", label: "Perfil" },
  { id: "compras", label: "Compras" },
  { id: "datos-fiscales", label: "Datos fiscales" },
  { id: "suscripcion", label: "Suscripción" },
];

export const ProfileActionsSection = () => {
  const [activeAction, setActiveAction] = useState<string>("recargar-saldo");
  const saldo = 36.0;

  return (
    <section className="w-full flex justify-center px-4 mt-8">
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-800">
        {/* Saldo */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-sm font-normal text-slate-700 dark:text-slate-300 font-['Arimo']">
            Saldo:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-['Arimo']">
            {saldo.toFixed(2)}€
          </span>
        </div>

        {/* Botones de acción (incluye Recargar saldo) */}
        {actionButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveAction(button.id)}
            className={`px-6 py-2 text-sm font-normal rounded-lg transition-colors font-['Arimo'] ${
              activeAction === button.id
                ? "bg-[#00753e] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
};

