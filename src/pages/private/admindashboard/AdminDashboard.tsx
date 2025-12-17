import React from "react";
import { EventManagementSection } from "./EventManagementSection";
import { NavigationSidebarSection } from "./NavigationSidebarSection";

export const AdminDashboard = (): JSX.Element => {
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <NavigationSidebarSection />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <EventManagementSection />
      </div>
    </div>
  );
};

