import React from "react";
import { EventHighlightsSection } from "./EventHighlightsSection";
import { FeaturedEventSection } from "./FeaturedEventSection";

export const HomeInvitado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <FeaturedEventSection />
      <EventHighlightsSection />
    </div>
  );
};
