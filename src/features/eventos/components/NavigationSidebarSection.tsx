import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
import { Calendar, TrendingUp, Settings, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subItems: string[];
}

export const NavigationSidebarSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems: NavItem[] = [
    {
      id: "eventos",
      icon: Calendar,
      title: "Eventos",
      subItems: ["Gestión de eventos"],
    },
    {
      id: "ventas",
      icon: TrendingUp,
      title: "Ventas",
      subItems: ["Ver Compras", "Reembolsos Manuales", "Más +"],
    },
    {
      id: "configuracion",
      icon: Settings,
      title: "Configuración",
      subItems: ["Gestión de usuarios", "Exportar Datos"],
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente");
      navigate("/auth");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav
      className="w-[350px] h-[1080px] relative bg-white"
      aria-label="Navegación principal"
    >
      <div className="absolute top-0 left-0 w-[350px] h-[1080px] border-r [border-right-style:solid] border" />

      <div className="absolute top-0 left-0 w-[350px] h-[1080px] flex flex-col">
        <header className="h-[140px] flex flex-col gap-2.5 border-b [border-bottom-style:solid] border">
          <div className="ml-8 w-[235.05px] mt-[29.8px] flex">
            <h1 className="w-[236px] h-10 [font-family:'Arimo-Regular',Helvetica] font-normal text-black text-[28px] tracking-[0] leading-10 whitespace-nowrap">
              Fundación Cudeca
            </h1>
          </div>

          <div className="ml-8 w-[117.07px] flex">
            <p className="mt-[0.5px] w-[118px] h-7 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#6a7282] text-lg tracking-[0] leading-7 whitespace-nowrap">
              Cudeca Admin
            </p>
          </div>
        </header>

        <div className="flex ml-8 w-[280px] h-[420px] relative mt-9 flex-col items-start gap-8">
          {navigationItems.map((item) => (
            <section
              key={item.id}
              className="relative self-stretch w-full"
              style={{
                height:
                  item.id === "eventos"
                    ? "76px"
                    : item.id === "ventas"
                      ? "156px"
                      : "116px",
              }}
            >
              <div className="absolute top-0 left-0 w-[280px] h-8 flex gap-2.5">
                {React.createElement(item.icon, {
                  size: 22,
                  className: "mt-1 w-[22px] h-[22px] relative text-[#00a651]",
                })}

                <h2 className="mt-[-2.2px] flex">
                  <span
                    className={`h-8 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#00a651] text-xl tracking-[0] leading-8 whitespace-nowrap ${item.id === "eventos" ? "w-[73px]" : item.id === "ventas" ? "w-[62px]" : "w-[124px]"}`}
                  >
                    {item.title}
                  </span>
                </h2>
              </div>

              <ul
                className="absolute top-12 left-8 w-60 flex flex-col gap-3"
                style={{ height: item.id === "ventas" ? "108px" : "68px" }}
              >
                {item.subItems.map((subItem, index) => (
                  <li
                    key={index}
                    className={`flex ${index === 0 ? "mt-[-0.2px]" : ""}`}
                  >
                    <a
                      href="#"
                      className={`mt-[0.5px] h-7 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#6a7282] text-lg tracking-[0] leading-7 whitespace-nowrap hover:text-[#00a651] focus:text-[#00a651] focus:outline-none focus:underline ${subItem === "Gestión de eventos" ? "w-[156px]" : subItem === "Ver Compras" ? "w-[106px]" : subItem === "Reembolsos Manuales" ? "w-[184px]" : subItem === "Más +" ? "w-[50px]" : subItem === "Gestión de usuarios" ? "w-[161px]" : "w-[121px]"}`}
                    >
                      {subItem}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="w-[350px] h-[140px] mt-[344px] flex border-t [border-top-style:solid] border">
          <button
            onClick={handleLogout}
            className="all-[unset] box-border mt-[35px] w-[286px] h-[70px] ml-8 flex gap-[13.5px] rounded-[18px] border border-solid border-[#00a651] cursor-pointer hover:bg-[#00a651] hover:bg-opacity-5 focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:ring-offset-2 active:bg-[#00a651] active:bg-opacity-10 transition-colors"
            type="button"
            aria-label="Cerrar sesión"
          >
            <LogOut
              size={22}
              className="mt-6 w-[22px] h-[22px] relative ml-[103px] text-[#00a651]"
              aria-hidden="true"
            />

            <div className="mt-4 w-[40.02px] flex">
              <span className="w-[41px] h-8 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#00a651] text-xl text-center tracking-[0] leading-8 whitespace-nowrap">
                Salir
              </span>
            </div>
          </button>
        </footer>
      </div>
    </nav>
  );
};

