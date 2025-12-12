interface Purchase {
  id: string;
  title: string;
  date: string;
  tickets: string;
  total: string;
  status: string;
}

export const PurchasesHistorySection = () => {
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

  return (
    <section className="w-full max-w-[1136px] mx-auto px-4 mt-8 mb-16">
      <article className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Header */}
        <header className="px-8 py-6 border-b-2 border-[#00753e]">
          <h2 className="text-base font-bold text-[#00753e] dark:text-[#00a651] font-['Arimo']">
            Historial de Compras
          </h2>
        </header>

        {/* Purchases List */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="px-8 py-4 flex items-center gap-20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {/* Purchase Info */}
              <div className="flex-1 min-w-[280px]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-['Arimo']">
                  {purchase.title}
                </h3>
                <time className="text-xs text-slate-500 dark:text-slate-400 font-['Arimo']">
                  {purchase.date}
                </time>
              </div>

              {/* Tickets */}
              <div className="w-[100px]">
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 font-['Arimo']">
                  ENTRADAS
                </span>
                <span className="text-sm text-slate-900 dark:text-white font-['Arimo']">
                  {purchase.tickets}
                </span>
              </div>

              {/* Total */}
              <div className="w-[100px]">
                <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 font-['Arimo']">
                  TOTAL
                </span>
                <span className="text-sm font-bold text-[#00753e] dark:text-[#00a651] font-['Arimo']">
                  {purchase.total}
                </span>
              </div>

              {/* Status */}
              <div className="w-[100px]">
                <span className="inline-flex items-center justify-center px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs rounded-full font-['Arimo']">
                  {purchase.status}
                </span>
              </div>

              {/* Action Button */}
              <div className="w-[100px]">
                <button
                  type="button"
                  className="px-4 py-1 bg-[#00bcd4] hover:bg-[#00acc1] text-white text-xs rounded-full transition-colors font-['Arimo']"
                  aria-label={`Ver detalles de ${purchase.title}`}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};
