import { Navbar } from '../../../components/ui/Navbar';
import { ProfileActionsSection } from './ProfileActionsSection';
import { SubscriptionSection } from './SubscriptionSection';
import { FooterSection } from './FooterSection';

export const Suscripcion = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-slate-900">
        <ProfileActionsSection />
        <SubscriptionSection />
      </main>
      <FooterSection />
    </div>
  );
};
