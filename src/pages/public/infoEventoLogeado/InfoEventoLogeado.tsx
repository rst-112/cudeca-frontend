import React from "react";
import { EventInformationSection } from "./EventInformationSection";
import { MainContentSection } from "./MainContentSection";
import { TicketSelectionSection } from "./TicketSelectionSection";
import Footer from "../../../components/layout/Footer";

export const InfoEventoLogeado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <MainContentSection isLoggedIn={true} />
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto px-4 py-8 mt-0">
        <div className="flex-1">
          <EventInformationSection />
        </div>
        <div className="lg:w-96">
          <TicketSelectionSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};
