import React, { useState } from "react";

interface TicketOption {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  donation?: number;
  available: boolean;
  badge?: string;
}

interface DonationButton {
  amount: number;
  label: string;
}

export const TicketSelectionSection = (): JSX.Element => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(
    "general"
  );
  const [additionalDonation, setAdditionalDonation] = useState<number>(5);

  const ticketOptions: TicketOption[] = [
    {
      id: "vip",
      name: "Entrada VIP",
      price: 50,
      available: false,
      badge: "Agotado",
    },
    {
      id: "general",
      name: "Entrada General",
      price: 20,
      basePrice: 15,
      donation: 5,
      available: true,
    },
  ];

  const donationButtons: DonationButton[] = [
    { amount: 5, label: "+5€" },
    { amount: 10, label: "+10€" },
  ];

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setAdditionalDonation(Math.max(0, value));
  };

  const handleDonationButtonClick = (amount: number) => {
    setAdditionalDonation((prev) => prev + amount);
  };

  const calculateTotal = () => {
    const selectedTicketData = ticketOptions.find(
      (t) => t.id === selectedTicket
    );
    const ticketPrice = selectedTicketData?.price || 0;
    return ticketPrice + additionalDonation;
  };

  return (
    <section
      className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-fit sticky top-24"
      aria-label="Selección de entradas"
    >
      {/* Event Image Placeholder */}
      <div
        className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center text-4xl"
        role="img"
        aria-label="Imagen del evento"
      >
        🎭
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-base font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
          Selecciona tu entrada
        </legend>

        {ticketOptions.map((ticket) => (
          <div
            key={ticket.id}
            className={`flex flex-col gap-3 p-4 rounded-lg border-2 transition-all ${
              !ticket.available
                ? "opacity-60 border-slate-200 dark:border-slate-700"
                : selectedTicket === ticket.id
                  ? "border-[#00753e] dark:border-[#00a651] bg-green-50 dark:bg-slate-700"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-base font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                  {ticket.name}
                </label>
                {!ticket.available && ticket.badge && (
                  <span className="inline-flex px-3 py-1 bg-gray-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full w-fit">
                    {ticket.badge}
                  </span>
                )}
                {ticket.available && ticket.basePrice && ticket.donation && (
                  <p className="text-xs text-[#00753e] dark:text-[#00a651] font-semibold">
                    {ticket.basePrice}€ Base + {ticket.donation}€ Donación
                  </p>
                )}
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {ticket.price}€
              </span>
            </div>

            {ticket.available && (
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedTicket === ticket.id
                    ? "bg-[#00753e] dark:bg-[#00a651] text-white font-bold"
                    : "border-2 border-[#00753e] dark:border-[#00a651] text-[#00753e] dark:text-[#00a651] hover:bg-[#00753e] dark:hover:bg-[#00a651] hover:text-white dark:hover:text-slate-900"
                }`}
                onClick={() => setSelectedTicket(ticket.id)}
                aria-pressed={selectedTicket === ticket.id}
                type="button"
              >
                {selectedTicket === ticket.id ? "Seleccionado ✓" : "Seleccionar"}
              </button>
            )}
          </div>
        ))}
      </fieldset>

      {/* Donation Section */}
      <div className="flex flex-col gap-4 p-4 bg-green-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">💚</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
            Ayuda un poco más
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
          Añadir donación adicional
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={additionalDonation}
              onChange={handleDonationChange}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#00753e] dark:focus:border-[#00a651]"
              aria-label="Cantidad de donación adicional"
              min="0"
            />
            <span className="text-base font-semibold text-slate-600 dark:text-slate-400">
              €
            </span>
          </div>

          <div className="flex gap-2">
            {donationButtons.map((btn, index) => (
              <button
                key={index}
                className="flex-1 py-2 bg-white dark:bg-slate-800 border-2 border-[#00753e] dark:border-[#00a651] text-[#00753e] dark:text-[#00a651] hover:bg-[#00753e] hover:text-white dark:hover:bg-[#00a651] dark:hover:text-slate-900 font-semibold rounded-lg transition-all text-sm [font-family:'Arimo-Regular',Helvetica]"
                onClick={() => handleDonationButtonClick(btn.amount)}
                type="button"
                aria-label={`Añadir ${btn.label} a la donación`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Total and Checkout */}
      <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            Total
          </span>
          <output className="text-3xl font-bold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
            {calculateTotal()}€
          </output>
        </div>

        <button
          className="w-full py-4 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006633] dark:hover:bg-[#008a43] text-white font-bold rounded-lg transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          aria-label="Comprar entradas"
          disabled={!selectedTicket}
        >
          Comprar Entradas
        </button>
      </div>
    </section>
  );
};

