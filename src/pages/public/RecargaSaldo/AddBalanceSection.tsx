import React, { useState } from "react";

export const AddBalanceSection = (): JSX.Element => {
  const [amount, setAmount] = useState<string>("0.00");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(
    null,
  );

  const quickAmounts = [
    { value: 10, label: "10€" },
    { value: 25, label: "25€" },
    { value: 50, label: "50€" },
    { value: 100, label: "100€" },
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
    <section className="absolute top-[156px] left-0 w-[1920px] h-[1358px] flex bg-gray-50">
      <div className="mt-8 w-[1136px] h-[545px] ml-[392px] relative bg-white rounded-2xl">
        <div className="absolute top-0 left-0 w-[1136px] h-[545px] bg-[#ffffff00] rounded-2xl border-[0.8px] border-solid border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]" />

        <header className="flex flex-col w-[1070px] h-[42px] items-start pl-[437.12px] pr-[435.52px] pt-0 pb-[1.6px] absolute top-[33px] left-[33px] border-b-[1.6px] [border-bottom-style:solid] border-[#00753e]">
          <div className="relative self-stretch w-full h-6">
            <h1 className="absolute top-px left-0 [font-family:'Arimo-Bold',Helvetica] font-bold text-[#00753e] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
              Añadir Saldo al Monedero
            </h1>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="absolute top-[107px] left-[33px] w-[1070px] h-[390px] bg-white rounded-xl"
        >
          <div className="absolute top-0 left-0 w-[1070px] h-[390px] flex flex-col gap-4">
            <div className="ml-[26px] w-[1018px] h-[250px] mt-[26px] flex flex-col gap-4">
              <div className="h-20 flex flex-col gap-2">
                <div className="flex h-6 flex-col items-start pl-0 pr-[883.75px] py-0 w-[1018px] relative">
                  <div className="relative self-stretch w-full h-6">
                    <label
                      htmlFor="amount-input"
                      className="absolute top-px left-0 [font-family:'Arimo-Bold',Helvetica] font-bold text-[#101828] text-base tracking-[0] leading-6 whitespace-nowrap"
                    >
                      Cantidad a añadir
                    </label>
                  </div>
                </div>

                <div className="h-12 bg-white rounded-lg w-[1018px] relative">
                  <div className="absolute top-0 left-0 w-[1018px] h-12 rounded-lg border-[0.8px] border-solid border-[#d1d5dc]" />

                  <div className="flex flex-col w-[1018px] h-12 items-start pl-4 pr-[957.51px] pt-3 pb-0 absolute top-0 left-0">
                    <div className="relative self-stretch w-full h-6">
                      <input
                        type="text"
                        id="amount-input"
                        value={`${amount} €`}
                        onChange={handleAmountChange}
                        className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#4a5565] text-base tracking-[0] leading-6 whitespace-nowrap bg-transparent border-none outline-none w-full"
                        aria-label="Cantidad a añadir"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[74px] gap-2 flex flex-col">
                <div className="w-[1018px] h-6 relative items-start pl-0 pr-[870.39px] py-0 flex flex-col">
                  <div className="relative self-stretch w-full h-6">
                    <p className="absolute top-px left-0 [font-family:'Arimo-Bold',Helvetica] font-bold text-[#101828] text-base tracking-[0] leading-6 whitespace-nowrap">
                      Cantidades rápidas
                    </p>
                  </div>
                </div>

                <div
                  className="w-[1018px] flex gap-3"
                  role="group"
                  aria-label="Cantidades rápidas"
                >
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount.value}
                      type="button"
                      onClick={() => handleQuickAmountClick(quickAmount.value)}
                      className="w-[100px] h-[42px] relative bg-white rounded-[20px]"
                      aria-label={`Añadir ${quickAmount.label}`}
                    >
                      <div className="absolute top-0 left-0 w-[100px] h-[42px] rounded-[20px] border-[0.8px] border-solid border-[#00753e]" />

                      <div
                        className={`flex flex-col w-[100px] h-[42px] items-start pt-[9px] pb-0 ${quickAmount.value === 100 ? "px-[32.2px]" : "px-[36.65px]"} absolute top-0 left-0`}
                      >
                        <div className="relative self-stretch w-full h-6">
                          <span className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#00753e] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                            {quickAmount.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-20 flex flex-col gap-2">
                <div className="flex h-6 flex-col items-start pl-0 pr-[895.34px] py-0 w-[1018px] relative">
                  <div className="relative self-stretch w-full h-6">
                    <label
                      htmlFor="payment-method"
                      className="absolute top-px left-0 [font-family:'Arimo-Bold',Helvetica] font-bold text-[#101828] text-base tracking-[0] leading-6 whitespace-nowrap"
                    >
                      Método de pago
                    </label>
                  </div>
                </div>

                <div className="h-12 bg-white rounded-lg w-[1018px] relative">
                  <div className="absolute top-0 left-0 w-[1018px] h-12 rounded-lg border-[0.8px] border-solid border-[#d1d5dc]" />

                  <div className="flex flex-col w-[1018px] h-12 items-start pl-4 pr-[822.33px] pt-3 pb-0 absolute top-0 left-0">
                    <div className="relative self-stretch w-full h-6">
                      <input
                        type="text"
                        id="payment-method"
                        value="Tarjeta de crédito / débito"
                        readOnly
                        className="absolute top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#4a5565] text-base tracking-[0] leading-6 whitespace-nowrap bg-transparent border-none outline-none w-full"
                        aria-label="Método de pago"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex ml-[26px] w-[1018px] h-12 relative flex-col items-start pl-[464.53px] pr-[464.52px] pt-3 pb-0 bg-[#00753e] rounded-[14px] shadow-[0px_4px_6px_-1px_#0000001a]"
              aria-label="Añadir saldo"
            >
              <div className="relative self-stretch w-full h-6">
                <span className="absolute top-px -left-px [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                  Añadir saldo
                </span>
              </div>
            </button>
          </div>

          <div className="absolute top-0 left-0 w-[1070px] h-[390px] rounded-xl border-[1.6px] border-solid border-[#00753e]" />
        </form>
      </div>
    </section>
  );
};

