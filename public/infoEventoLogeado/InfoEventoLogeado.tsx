import React from "react";
import { EventInformationSection } from "./EventInformationSection";
import { MainContentSection } from "./MainContentSection";
import { SiteFooterSection } from "./SiteFooterSection";
import { TicketSelectionSection } from "./TicketSelectionSection";

export const InfoEventoLogeado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <MainContentSection />
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="flex-1">
          <EventInformationSection />
        </div>
        <div className="lg:w-96">
          <TicketSelectionSection />
        </div>
      </div>
      <SiteFooterSection />
    </div>
  );
};

