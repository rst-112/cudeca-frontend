import React, { useState } from 'react';

export const ConfirmationSection = (): JSX.Element => {
  const [amount, setAmount] = useState<string>('0.00');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

  const quickAmounts = [
    { value: 10, label: '10€' },
    { value: 25, label: '25€' },
    { value: 50, label: '50€' },
    { value: 100, label: '100€' },
  ];

  const handleQuickAmountClick = (value: number) => {
    setAmount(value.toFixed(2));
    setSelectedQuickAmount(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setSelectedQuickAmount(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {/* Form Header */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Añadir Saldo al Monedero
            </h2>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label
                htmlFor="amount-input"
                className="block text-sm font-semibold text-slate-900 dark:text-white"
              >
                Cantidad a añadir
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount-input"
                  value={`${amount} €`}
                  onChange={handleAmountChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00753e] focus:border-transparent"
                  aria-label="Cantidad a añadir"
                />
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Cantidades rápidas
              </p>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount.value}
                    type="button"
                    onClick={() => handleQuickAmountClick(quickAmount.value)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors text-sm font-medium ${
                      selectedQuickAmount === quickAmount.value
                        ? 'border-[#00753e] bg-[#00753e] text-white'
                        : 'border-[#00753e] text-[#00753e] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    aria-label={`Añadir ${quickAmount.label}`}
                    aria-pressed={selectedQuickAmount === quickAmount.value}
                  >
                    {quickAmount.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label
                htmlFor="payment-method"
                className="block text-sm font-semibold text-slate-900 dark:text-white"
              >
                Método de pago
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="payment-method"
                  value="Tarjeta de crédito / débito"
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 cursor-not-allowed opacity-75"
                  aria-label="Método de pago"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#00753e] text-white rounded-lg font-semibold hover:bg-[#005a2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00753e] focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              aria-label="Añadir saldo"
            >
              Continuar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
