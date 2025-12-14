import React from 'react';
import { ConfirmationSection } from './ConfirmationSection';
import { FooterSection } from './FooterSection';
import { Navbar } from '../../../components/ui/Navbar';

export const CompraInvitado = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <ConfirmationSection />
      <FooterSection />
    </div>
  );
};
