import React from "react";
import { NavigationHeaderSection } from "./NavigationHeaderSection";
import { FeaturedEventSection } from "./FeaturedEventSection";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { EventHighlightsSection } from "./EventHighlightsSection";
import { FooterSection } from "../homeEventoLogeado/FooterSection";

export const HomeInvitado = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeaderSection />
      <main className="flex-grow">
        <FeaturedEventSection />
        <UpcomingEventsSection />
        <EventHighlightsSection />
      </main>
      <FooterSection />
    </div>
  );
};