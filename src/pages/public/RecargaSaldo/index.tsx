import { ConfirmationSection } from './ConfirmationSection';
import { FooterSection } from './FooterSection';
import { HeaderSection } from './HeaderSection';
import { ProfileActionsSection } from './ProfileActionsSection';

export const PantallaDeRecargar = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <HeaderSection />
      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <ConfirmationSection />
      </main>
      <FooterSection />
    </div>
  );
};
