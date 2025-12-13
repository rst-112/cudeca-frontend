import React from "react";
import { EventInfoSection } from "./EventInfoSection";
import { FooterSection } from "./FooterSection";
import { MainContentSection } from "./MainContentSection";
import { TicketSelectionSection } from "./TicketSelectionSection";

export const InfoEventoInvitado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <MainContentSection />
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex-1">
          <EventInfoSection />
        </div>
        <div className="lg:w-96">
          <TicketSelectionSection />
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

