import React from "react";
import { EventCardsSection } from "./EventCardsSection";
import { FeaturedEventSection } from "./FeaturedEventSection";
import { FooterSection } from "./FooterSection";
import { HeroBannerSection } from "./HeroBannerSection";
import { NavigationHeaderSection } from "./NavigationHeaderSection";

export const HomeEventoLogeado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <NavigationHeaderSection />
      <HeroBannerSection />
      <FeaturedEventSection />
      <EventCardsSection />
      <FooterSection />
    </div>
  );
};

