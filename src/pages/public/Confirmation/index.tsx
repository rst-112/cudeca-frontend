import { ConfirmationCard } from './ConfirmationCard';

export const ConfirmationPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-(--spacing(20)))] bg-gray-50 dark:bg-slate-900 items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
        <ConfirmationCard />
      </div>
    </div>
  );
};

export default ConfirmationPage;
