import React from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  status: {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  funding: {
    current: string;
    goal: string;
    percentage: number;
  };
  actionIcon: string;
}

export const EventManagementSection = (): JSX.Element => {
  const events: Event[] = [
    {
      id: 1,
      title: "Gala Benéfica Anual 2024",
      date: "15 de Diciembre, 2024 - 19:00h",
      image: "/image-with-fallback.png",
      status: {
        label: "PUBLICADO",
        bgColor: "bg-green-100",
        textColor: "text-[#016630]",
        borderColor: "border-[#b9f8cf]",
      },
      funding: {
        current: "8500€",
        goal: "10.000€",
        percentage: 85,
      },
      actionIcon: "",
    },
    {
      id: 2,
      title: "Jornada de Puertas Abiertas",
      date: "22 de Enero, 2025 - 10:00h",
      image: "/image-with-fallback-1.png",
      status: {
        label: "BORRADOR",
        bgColor: "bg-gray-100",
        textColor: "text-[#1e2939]",
        borderColor: "border",
      },
      funding: {
        current: "2300€",
        goal: "5000€",
        percentage: 46,
      },
      actionIcon: "",
    },
    {
      id: 3,
      title: "Maratón Solidaria Málaga",
      date: "05 de Marzo, 2024 - 08:00h",
      image: "/image-with-fallback-2.png",
      status: {
        label: "CANCELADO",
        bgColor: "bg-[#ffe2e2]",
        textColor: "text-[#9f0712]",
        borderColor: "border-[#ffc9c9]",
      },
      funding: {
        current: "4200€",
        goal: "15.000€",
        percentage: 28,
      },
      actionIcon: "",
    },
    {
      id: 4,
      title: "Concierto de Navidad",
      date: "20 de Diciembre, 2023 - 20:30h",
      image: "/image-with-fallback-3.png",
      status: {
        label: "FINALIZADO",
        bgColor: "bg-[#101828]",
        textColor: "text-white",
        borderColor: "border-[#101828]",
      },
      funding: {
        current: "12.500€",
        goal: "12.000€",
        percentage: 100,
      },
      actionIcon: "",
    },
  ];

  return (
    <section className="mt-1.5 w-[1570px] h-[1080px] flex">
      <div className="mt-[123px] w-[1272.58px] h-[834.85px] ml-[149px] flex flex-col gap-[29.8px]">
        <header className="ml-[31.8px] w-[1209px] mt-[29.8px] flex gap-[901.7px]">
          <h1 className="mt-[10.7px] w-[138.8px] h-[22.37px] flex">
            <span className="mt-[-0.7px] w-[140px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#101828] text-base tracking-[0] leading-6 whitespace-nowrap">
              Gestión de Eventos
            </span>
          </h1>

          <button
            className="w-[168.53px] h-[44.71px] flex gap-[8.3px] bg-[#00a651] rounded-[10px] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] hover:bg-[#008a43] transition-colors cursor-pointer"
            aria-label="Crear Evento"
          >
            <div className="flex mt-[13.0px] w-[19.88px] h-[18.64px] relative ml-[23.8px] flex-col items-start">
              <div className="relative self-stretch w-full h-[19.88px] mb-[-1.24px]">
                <div className="relative w-[58.33%] h-[58.33%] top-[20.83%] left-[20.83%]">
                  <svg
                    className="absolute w-full h-0 top-[42.86%] left-[-7.14%]"
                    width="20"
                    height="2"
                    viewBox="0 0 20 2"
                    fill="none"
                  >
                    <line y1="1" x2="20" y2="1" stroke="white" strokeWidth="2" />
                  </svg>

                  <svg
                    className="absolute w-0 h-full top-[-7.14%] left-[42.86%]"
                    width="2"
                    height="20"
                    viewBox="0 0 2 20"
                    fill="none"
                  >
                    <line x1="1" x2="1" y2="20" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            <span className="mt-[10.7px] w-[93.71px] h-[22.37px] flex">
              <span className="mt-[-0.7px] w-[95px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                Crear Evento
              </span>
            </span>
          </button>
        </header>

        <div className="ml-[31.8px] w-[1209px] h-[700.67px] flex flex-col gap-[14.9px] overflow-y-auto">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex w-[1209px] h-[163.97px] relative flex-col items-start pt-[22.34px] pb-0 px-[23.83px] bg-white rounded-[10px] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] hover:shadow-md transition-shadow"
            >
              <div className="relative self-stretch w-full h-[119.27px]">
                <div className="flex flex-col w-[127px] h-[119px] items-start absolute top-0 left-0 bg-gray-100 rounded-lg">
                  <div
                    className="relative self-stretch w-full h-[119.27px] rounded-lg bg-cover bg-[50%_50%]"
                    style={{ backgroundImage: `url(${event.image})` }}
                    role="img"
                    aria-label={`Imagen de ${event.title}`}
                  />
                </div>

                <div className="absolute top-[34px] left-[151px] w-[471px] h-[51px] flex flex-col gap-[3.7px]">
                  <h2 className="h-[25.16px] mt-[-0.5px] flex">
                    <span className="mt-[-0.7px] h-[27px] [font-family:'Arimo-Regular',Helvetica] font-normal text-[#101828] text-lg tracking-[0] leading-[27px] whitespace-nowrap">
                      {event.title}
                    </span>
                  </h2>

                  <time className="h-[22.37px] flex">
                    <span className="mt-[-0.7px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#6a7282] text-base tracking-[0] leading-6 whitespace-nowrap">
                      {event.date}
                    </span>
                  </time>
                </div>

                <div
                  className={`absolute top-[43px] left-[${
                    event.status.label === "CANCELADO"
                      ? "639"
                      : event.status.label === "FINALIZADO"
                        ? "642"
                        : "646"
                  }px] ${
                    event.status.label === "CANCELADO"
                      ? "w-[129px]"
                      : event.status.label === "FINALIZADO"
                        ? "w-[125px]"
                        : "w-[122px]"
                  } h-[34px] ${event.status.bgColor} rounded-[41943000px]`}
                >
                  <div
                    className={`absolute top-0 left-0 ${
                      event.status.label === "CANCELADO"
                        ? "w-[129px]"
                        : event.status.label === "FINALIZADO"
                          ? "w-[125px]"
                          : "w-[122px]"
                    } h-[34px] rounded-[41943000px] border-[1.25px] border-solid ${event.status.borderColor}`}
                  />

                  <div
                    className={`flex flex-col ${
                      event.status.label === "CANCELADO"
                        ? "w-[129px]"
                        : event.status.label === "FINALIZADO"
                          ? "w-[125px]"
                          : "w-[122px]"
                    } h-[34px] items-start pl-[17.15px] ${
                      event.status.label === "CANCELADO"
                        ? "pr-[12.37px]"
                        : event.status.label === "FINALIZADO"
                          ? "pr-[14.58px]"
                          : event.status.label === "BORRADOR"
                            ? "pr-[12.54px]"
                            : "pr-[13.07px]"
                    } pt-[5.81px] pb-0 absolute top-0 left-0`}
                  >
                    <span className="relative self-stretch w-full h-[22.37px]">
                      <span
                        className={`absolute -top-px left-0 [font-family:'Arimo-Regular',Helvetica] font-normal ${event.status.textColor} text-base tracking-[0] leading-6 whitespace-nowrap`}
                      >
                        {event.status.label}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="absolute top-[41px] left-[792px] w-[223px] h-[37px] flex flex-col gap-[7.8px]">
                  <div className="h-[22.37px] mt-[-0.5px] flex">
                    <span className="mt-[-0.7px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#101828] text-base tracking-[0] leading-6 whitespace-nowrap">
                      {event.funding.current} / {event.funding.goal}
                    </span>
                  </div>

                  <div
                    className={`flex w-[222.67px] h-[7.43px] relative flex-col items-start bg-gray-200 rounded-[41943000px] ${
                      event.funding.percentage === 100 ? "overflow-hidden" : ""
                    }`}
                  >
                    <div
                      className={`${
                        event.funding.percentage === 100
                          ? "relative flex-1 w-[222.67px] grow"
                          : "flex flex-col h-[7.43px] items-start pl-0 py-0 relative self-stretch w-full rounded-[41943000px] overflow-hidden"
                      } bg-[#00a651] rounded-[41943000px]`}
                      style={
                        event.funding.percentage !== 100
                          ? {
                              width: `${event.funding.percentage}%`,
                            }
                          : undefined
                      }
                    >
                      {event.funding.percentage !== 100 && (
                        <div className="relative self-stretch w-full h-[7.43px] bg-[#00a651] rounded-[41943000px]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

