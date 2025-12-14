import React from "react";
import { EventManagementSection } from "./components/EventManagementSection";
import { NavigationSidebarSection } from "./components/NavigationSidebarSection";

export const ListaEventos = (): JSX.Element => {
  return (
    <div className="flex flex-col h-[1080px] items-start gap-2.5 relative bg-neutral-100">
      <div className="relative w-full h-[1080px]">
        <div className="w-full flex bg-neutral-100 h-full">
          <NavigationSidebarSection />
          <EventManagementSection />
        </div>
      </div>
    </div>
  );
};

