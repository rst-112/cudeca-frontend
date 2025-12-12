import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface FiscalData {
  id: number;
  title: string;
  name: string;
  nif: string;
  address: string;
}

export const FiscalDataSection = (): JSX.Element => {
  const fiscalDataItems: FiscalData[] = [
    {
      id: 1,
      title: 'NIF Guardado 1',
      name: 'Mi empresa S.L',
      nif: 'B12345678',
      address: 'Calle ficticia 123',
    },
    {
      id: 2,
      title: 'NIF Guardado 2',
      name: '(Mi nombre personal)',
      nif: '123456784',
      address: 'Av. de la Donación 42',
    },
  ];

  return (
    <main className="flex-1 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-8 py-12">
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {/* Section Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Direcciones fiscales
            </h2>
          </div>

          {/* Fiscal Data Grid */}
          {fiscalDataItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {fiscalDataItems.map((item) => (
                <div key={item.id} className="border-2 border-[#00753e] rounded-lg p-6 space-y-4">
                  {/* Card Header */}
                  <div className="pb-4 border-b border-[#00753e]">
                    <h3 className="text-base font-bold text-[#00753e]">{item.title}</h3>
                  </div>

                  {/* Card Data */}
                  <dl className="space-y-3">
                    <div className="flex gap-4">
                      <dt className="font-semibold text-slate-900 dark:text-white min-w-fit">
                        Nombre:
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 underline">{item.name}</dd>
                    </div>

                    <div className="flex gap-4">
                      <dt className="font-semibold text-slate-900 dark:text-white min-w-fit">
                        NIF:
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 underline">{item.nif}</dd>
                    </div>

                    <div className="flex gap-4">
                      <dt className="font-semibold text-slate-900 dark:text-white min-w-fit">
                        Dirección:
                      </dt>
                      <dd className="text-slate-600 dark:text-slate-400 underline">
                        {item.address}
                      </dd>
                    </div>
                  </dl>

                  {/* Card Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-[#00bcd4] text-white rounded-full hover:bg-[#0097a7] transition-colors text-sm font-medium"
                      aria-label={`Editar ${item.title}`}
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm font-medium"
                      aria-label={`Eliminar ${item.title}`}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                No tienes direcciones fiscales registradas.
              </p>
            </div>
          )}

          {/* Add Button */}
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#00753e] text-white rounded-lg hover:bg-[#005a2e] transition-colors font-semibold"
            aria-label="Añadir información fiscal"
          >
            <Plus size={20} />
            Añadir información fiscal
          </button>
        </div>
      </div>
    </main>
  );
};
