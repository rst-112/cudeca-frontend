import React, { useState } from "react";

interface TabItem {
  label: string;
  id: string;
  isActive: boolean;
}

export const UserTabsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("suscripcion");

  const tabs: TabItem[] = [
    { label: "Saldo: 36.00€", id: "saldo", isActive: activeTab === "saldo" },
    { label: "Retirar saldo", id: "retirar", isActive: activeTab === "retirar" },
    { label: "Perfil", id: "perfil", isActive: activeTab === "perfil" },
    { label: "Compras", id: "compras", isActive: activeTab === "compras" },
    { label: "Datos fiscales", id: "datos-fiscales", isActive: activeTab === "datos-fiscales" },
    { label: "Suscripción", id: "suscripcion", isActive: activeTab === "suscripcion" },
  ];

  return (
    <nav
      className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
      role="navigation"
      aria-label="User profile navigation"
    >
      <div className="container mx-auto px-8">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors ${
                tab.isActive
                  ? "border-[#00753e] bg-[#00753e] text-white"
                  : "border-transparent bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              aria-current={tab.isActive ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

