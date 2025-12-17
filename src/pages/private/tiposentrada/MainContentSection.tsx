import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TicketEntry {
  id: string;
  name: string;
  basePrice: number;
  donation: number;
  capacity: number;
}

export const MainContentSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [existingTickets, setExistingTickets] = useState<TicketEntry[]>([
    {
      id: "1",
      name: "Entrada Adulto",
      basePrice: 15,
      donation: 5,
      capacity: 200,
    },
  ]);

  const [ticketName, setTicketName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [donation, setDonation] = useState("");
  const [purchaseLimit, setPurchaseLimit] = useState("");

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketName && capacity && basePrice) {
      const newTicket: TicketEntry = {
        id: Date.now().toString(),
        name: ticketName,
        basePrice: parseFloat(basePrice),
        donation: parseFloat(donation) || 0,
        capacity: parseInt(capacity),
      };
      setExistingTickets([...existingTickets, newTicket]);
      setTicketName("");
      setCapacity("");
      setBasePrice("");
      setDonation("");
      setPurchaseLimit("");
    }
  };

  const handleDeleteTicket = (id: string) => {
    setExistingTickets(existingTickets.filter((ticket) => ticket.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <header className="px-8 pt-12 pb-6">
        <h1 className="text-4xl font-normal text-[#00a651] dark:text-[#00d66a] [font-family:'Arimo-Regular',Helvetica]">
          Formulario de creación de eventos
        </h1>
      </header>

      {/* Tabs */}
      <nav className="px-8 border-b border-slate-200 dark:border-slate-700 flex gap-12">
        <button
          onClick={() => navigate('/creacion-eventos')}
          className="py-4 px-2 font-normal text-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          Información General
        </button>
        <button className="py-4 px-2 font-normal text-xl text-[#00a651] dark:text-[#00d66a] border-b-2 border-[#00a651] dark:border-[#00d66a]">
          Tipos de Entrada
        </button>
      </nav>

      {/* Form Container */}
      <main className="flex-1 m-8 p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Existing Tickets */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-slate-900 dark:text-white mb-6 [font-family:'Arimo-Regular',Helvetica]">
            Entradas Existentes
          </h2>

          <div className="space-y-4">
            {existingTickets.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">
                No hay entradas creadas aún
              </p>
            ) : (
              existingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                      {ticket.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      €{ticket.basePrice + ticket.donation} (€{ticket.basePrice} +
                      €{ticket.donation} Donación) • Aforo: {ticket.capacity}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate('/editar-entrada')}
                      className="px-4 py-2 border-2 border-[#00a651] dark:border-[#00d66a] text-[#00a651] dark:text-[#00d66a] rounded-lg hover:bg-[#00a651] hover:bg-opacity-10 dark:hover:bg-[#00d66a] dark:hover:bg-opacity-10 transition-colors font-bold text-sm [font-family:'Arimo-Regular',Helvetica]"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors font-bold text-sm [font-family:'Arimo-Regular',Helvetica]"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Ticket */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-12">
          <h2 className="text-2xl font-normal text-slate-900 dark:text-white mb-8 [font-family:'Arimo-Regular',Helvetica]">
            Añadir nueva entrada
          </h2>

          <form onSubmit={handleAddTicket} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                    Nombre entrada
                  </label>
                  <input
                    type="text"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    placeholder="e.g. Entrada General"
                    className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                    Aforo / Cantidad Total
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="200"
                    className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                    Precio
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="Precio Base (€)"
                      className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                    />
                    <input
                      type="number"
                      value={donation}
                      onChange={(e) => setDonation(e.target.value)}
                      placeholder="Donación (€)"
                      className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]">
                    Límite de compra por usuario
                  </label>
                  <input
                    type="number"
                    value={purchaseLimit}
                    onChange={(e) => setPurchaseLimit(e.target.value)}
                    placeholder="10"
                    className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-[#00a651] dark:bg-[#00a651] text-white font-bold text-lg hover:bg-[#008a43] dark:hover:bg-[#008a43] transition-colors shadow-lg"
            >
              Añadir entrada
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

