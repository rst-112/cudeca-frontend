import React from "react";
import { HeaderSection } from "./HeaderSection";
import { UserTabsSection } from "./UserTabsSection";
import { SubscriptionSection } from "./SubscriptionSection";
import { FooterSection } from "./FooterSection";

export const Suscripcion = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <HeaderSection />
      <UserTabsSection />
      <SubscriptionSection />
      <FooterSection />
    </div>
  );
};

