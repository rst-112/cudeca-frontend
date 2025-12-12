import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";
import { ProfileActionsSection } from "./ProfileActionsSection";
import { PurchasesHistorySection } from "./PurchasesHistorySection";

export const PerfilCompras = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <HeaderSection />
      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <PurchasesHistorySection />
      </main>
      <FooterSection />
    </div>
  );
};

