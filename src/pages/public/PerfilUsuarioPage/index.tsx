import React from "react";
import { HeaderSection } from "./HeaderSection";
import { UserProfileTabsSection } from "./UserProfileTabsSection";
import { PurchasesHistorySection } from "./PurchasesHistorySection";
import { FooterSection } from "./FooterSection";

export const PerfilUsuarioPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <HeaderSection />
      <UserProfileTabsSection />
      <PurchasesHistorySection />
      <FooterSection />
    </div>
  );
};

