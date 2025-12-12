import React from 'react';

interface Purchase {
  id: string;
  title: string;
  date: string;
  tickets: string;
  total: string;
  status: 'Completada' | 'Pendiente' | 'Cancelada';
}

export const PurchasesHistorySection = (): JSX.Element => {
  const purchases: Purchase[] = [
    {
      id: '1',
      title: 'Concierto Benéfico de Navidad',
      date: '15 de Noviembre, 2024',
      tickets: '2 entradas',
      total: '48.00€',
      status: 'Completada',
    },
    {
      id: '2',
      title: 'Gala Anual Cudeca 2024',
      date: '03 de Octubre, 2024',
      tickets: '4 entradas',
      total: '120.00€',
      status: 'Completada',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada':
        return 'bg-emerald-100 text-emerald-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-8 py-12">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {/* Section Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Historial de Compras
            </h2>
          </div>

          {/* Purchases Table */}
          {purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Evento
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Entradas
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white text-sm">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="border-b border-slate-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {purchase.title}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-600 dark:text-slate-400 text-sm">
                          {purchase.date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 dark:text-white text-sm">
                          {purchase.tickets}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#00753e] text-sm">{purchase.total}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            purchase.status,
                          )}`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          className="text-[#00bcd4] hover:text-[#0097a7] font-medium text-sm transition-colors"
                          aria-label={`Ver detalles de ${purchase.title}`}
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No tienes compras registradas aún.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
