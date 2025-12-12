// Pantalla de Perfil de Usuario
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";
import { ProfileActionsSection } from "./ProfileActionsSection";
import { ProfileInformationSection } from "./ProfileInformationSection";

export const PantallaDePerfil = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <HeaderSection />
      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <ProfileInformationSection />
      </main>
      <FooterSection />
    </div>
  );
};

