import React from "react";
import { HeaderSection } from "./HeaderSection";
import { UserTabsSection } from "./UserTabsSection";
import { FiscalDataSection } from "./FiscalDataSection";
import { FooterSection } from "./FooterSection";

export const DatosFiscales = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <HeaderSection />
      <UserTabsSection />
      <FiscalDataSection />
      <FooterSection />
    </div>
  );
};

