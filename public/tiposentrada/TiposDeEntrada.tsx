import React from "react";
import { MainContentSection } from "./MainContentSection";
import { NavigationSidebarSection } from "./NavigationSidebarSection";

export const TiposDeEntrada = (): JSX.Element => {
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <NavigationSidebarSection />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <MainContentSection />
      </div>
    </div>
  );
};

