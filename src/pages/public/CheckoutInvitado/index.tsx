import React from "react";
import { CheckoutFormSection } from "./CheckoutFormSection";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";

export const CheckoutInvitado = () => {
  return (
    <div className="flex flex-col min-h-screen items-start bg-white dark:bg-slate-950">
      <div className="relative w-full bg-gray-50 dark:bg-slate-900 overflow-hidden">
        <HeaderSection />
        <CheckoutFormSection />
        <FooterSection />
      </div>
    </div>
  );
};

