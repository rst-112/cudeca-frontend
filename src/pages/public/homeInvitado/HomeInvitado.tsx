import React from "react";
import { EventHighlightsSection } from "./EventHighlightsSection";
import { FeaturedEventSection } from "./FeaturedEventSection";
import { Header } from "../../../components/layout/Header";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import Footer from "../../../components/layout/Footer";

export const HomeInvitado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <Header isLoggedIn={false} />
      <FeaturedEventSection />
      <UpcomingEventsSection />
      <EventHighlightsSection />
      <Footer />
    </div>
  );
};
