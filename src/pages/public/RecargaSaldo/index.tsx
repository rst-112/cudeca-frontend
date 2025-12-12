import React from "react";
import { ConfirmationSection } from "./ConfirmationSection";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";

export const PantallaDeRecargar = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <HeaderSection />
      <ConfirmationSection />
      <FooterSection />
    </div>
  );
};

