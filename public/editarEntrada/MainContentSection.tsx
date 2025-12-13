import React, { useState } from "react";

interface TicketEntry {
  id: string;
  name: string;
  basePrice: number;
  donation: number;
  capacity: number;
}

export const MainContentSection = (): JSX.Element => {
  const [existingTickets] = useState<TicketEntry[]>([
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

  const handleAddTicket = () => {
    console.log("Adding ticket:", {
      ticketName,
      capacity,
      basePrice,
      donation,
      purchaseLimit,
    });
    // Limpiar campos
    setTicketName("");
    setCapacity("");
    setBasePrice("");
    setDonation("");
    setPurchaseLimit("");
  };

  const handleEditTicket = (ticketId: string) => {
    console.log("Editing ticket:", ticketId);
  };

  const handleDeleteTicket = (ticketId: string) => {
    console.log("Deleting ticket:", ticketId);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
      <div className="ml-12 w-auto mt-[45px] flex">
        <h1 className="mt-[0.5px] h-12 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#00a651] dark:text-[#00d66a] text-[42px] tracking-[0] leading-[48px] whitespace-nowrap">
          Formulario de creación de eventos
        </h1>
      </div>

      <nav
        className="ml-12 w-auto mt-[51px] flex gap-[57px] border-b-2 border-slate-200 dark:border-slate-700"
        role="navigation"
        aria-label="Pasos de creación de eventos"
      >
        <div className="mt-2 w-auto flex">
          <div className="h-8 [font-family:'Arimo-Regular',Helvetica] font-normal text-slate-600 dark:text-slate-400 text-xl text-center tracking-[0] leading-8 whitespace-nowrap">
            Información General
          </div>
        </div>

        <div className="w-auto h-[52px] flex border-b-2 border-[#00a651] dark:border-[#00d66a]">
          <div className="mt-2 w-auto flex">
            <div
              className="h-8 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#00a651] dark:text-[#00d66a] text-xl text-center tracking-[0] leading-8 whitespace-nowrap"
              aria-current="page"
            >
              Tipos de Entrada
            </div>
          </div>
        </div>
      </nav>

      <main className="flex ml-12 w-auto h-auto relative mt-12 mr-8 mb-12 flex-col items-start pt-[46px] pb-[46px] px-[46px] bg-white dark:bg-slate-800 rounded-[18px] shadow-[0px_2px_4px_#0000001a] dark:shadow-[0px_2px_4px_#000000]">
        <div className="flex flex-col gap-10 relative self-stretch w-full">
          <section
            className="flex flex-col gap-4 relative self-stretch w-full"
            aria-labelledby="existing-tickets-heading"
          >
            <div className="relative self-stretch w-full h-[39px]">
              <h2
                id="existing-tickets-heading"
                className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-[26px] tracking-[0] leading-[39px] whitespace-nowrap"
              >
                Entradas Existentes
              </h2>
            </div>

            {existingTickets.map((ticket) => (
              <article
                key={ticket.id}
                className="flex h-[75px] items-center justify-between px-4 py-0 relative self-stretch w-full bg-gray-50 dark:bg-slate-700 rounded-[10px] border border-slate-200 dark:border-slate-600"
              >
                <div className="relative flex-1 grow h-[27px]">
                  <div className="absolute top-0 left-0 flex flex-col gap-2 lg:flex-row lg:gap-8">
                    <div className="w-[200px] h-[27px] [font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                      {ticket.name}
                    </div>

                    <p className="w-auto h-[27px] [font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px]">
                      {ticket.basePrice + ticket.donation}€ ({ticket.basePrice}€
                      + {ticket.donation}€ Donación)
                    </p>

                    <div className="w-auto h-[27px] [font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0]">
                      Aforo: {ticket.capacity}
                    </div>
                  </div>
                </div>

                <div className="flex w-auto h-[42px] items-start gap-2 relative">
                  <button
                    onClick={() => handleEditTicket(ticket.id)}
                    className="px-4 py-2 rounded-[10px] border border-solid border-[#00a651] dark:border-[#00d66a] text-[#00a651] dark:text-[#00d66a] hover:bg-[#00a651] hover:text-white dark:hover:bg-[#00d66a] dark:hover:text-slate-900 transition-all [font-family:'Arimo-Regular',Helvetica] font-normal text-base text-center tracking-[0] leading-6"
                    type="button"
                    aria-label={`Editar ${ticket.name}`}
                  >
                    ✓ Editar
                  </button>

                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="px-4 py-2 rounded-[10px] border border-solid border-[#fa2b36] dark:border-[#ff6b6b] text-[#fa2b36] dark:text-[#ff6b6b] hover:bg-[#fa2b36] hover:text-white dark:hover:bg-[#ff6b6b] dark:hover:text-white transition-all [font-family:'Arimo-Regular',Helvetica] font-normal text-base text-center tracking-[0] leading-6"
                    type="button"
                    aria-label={`Eliminar ${ticket.name}`}
                  >
                    × Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section
            className="flex flex-col gap-6 pt-[33px] pb-6 px-[33px] relative self-stretch w-full bg-gray-50 dark:bg-slate-700 rounded-[18px] border border-solid border-slate-200 dark:border-slate-600"
            aria-labelledby="edit-ticket-heading"
          >
            <div className="relative self-stretch w-full h-[33px]">
              <h2
                id="edit-ticket-heading"
                className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-[22px] tracking-[0] leading-[33px] whitespace-nowrap"
              >
                Editar entrada
              </h2>
            </div>

            <form
              className="flex flex-col gap-6 relative self-stretch w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTicket();
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 relative self-stretch w-full">
                    <div className="relative self-stretch w-full h-[27px]">
                      <label
                        htmlFor="ticket-name"
                        className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap"
                      >
                        Nombre entrada
                      </label>
                    </div>

                    <input
                      id="ticket-name"
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="e.g. Entrada General"
                      className="flex h-[68px] items-center px-[22px] py-0 relative self-stretch w-full rounded-[18px] overflow-hidden border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 [font-family:'Arimo-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                      aria-required="true"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative self-stretch w-full">
                    <div className="relative self-stretch w-full h-[27px]">
                      <label
                        htmlFor="capacity"
                        className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap"
                      >
                        Aforo / Cantidad Total
                      </label>
                    </div>

                    <input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="200"
                      className="flex h-[68px] items-center px-[22px] py-0 relative self-stretch w-full rounded-[18px] overflow-hidden border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 [font-family:'Arimo-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 relative self-stretch w-full">
                    <div className="relative self-stretch w-full h-[27px]">
                      <label className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                        Precio
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative self-stretch w-full">
                      <input
                        id="base-price"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="Precio Base (€)"
                        className="flex h-[68px] items-center px-[22px] py-0 rounded-[18px] overflow-hidden border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 [font-family:'Arimo-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                        aria-label="Precio Base en euros"
                        aria-required="true"
                      />

                      <input
                        id="donation"
                        type="number"
                        value={donation}
                        onChange={(e) => setDonation(e.target.value)}
                        placeholder="Donación (€)"
                        className="flex h-[68px] items-center px-[22px] py-0 rounded-[18px] overflow-hidden border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 [font-family:'Arimo-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                        aria-label="Donación en euros"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative self-stretch w-full">
                    <div className="relative self-stretch w-full h-[27px]">
                      <label
                        htmlFor="purchase-limit"
                        className="[font-family:'Arimo-Regular',Helvetica] font-normal text-slate-800 dark:text-white text-lg tracking-[0] leading-[27px] whitespace-nowrap"
                      >
                        Límite de compra por usuario
                      </label>
                    </div>

                    <input
                      id="purchase-limit"
                      type="number"
                      value={purchaseLimit}
                      onChange={(e) => setPurchaseLimit(e.target.value)}
                      placeholder="10"
                      className="flex h-[68px] items-center px-[22px] py-0 relative self-stretch w-full rounded-[18px] overflow-hidden border border-solid border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 [font-family:'Arimo-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-[70px] bg-[#00a651] dark:bg-[#00d66a] hover:bg-[#008a43] dark:hover:bg-[#00a651] rounded-[18px] cursor-pointer transition-all [font-family:'Arimo-Regular',Helvetica] font-normal text-white dark:text-slate-900 text-xl text-center tracking-[0] leading-[30px]"
              >
                Añadir entrada
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

