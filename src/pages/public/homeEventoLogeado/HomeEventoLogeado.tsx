import React from "react";
import { EventCardsSection } from "./EventCardsSection";
import { FeaturedEventSection } from "./FeaturedEventSection";
import { Header } from "../../../components/layout/Header";
import { HeroBannerSection } from "./HeroBannerSection";
import Footer from "../../../components/layout/Footer";

export const HomeEventoLogeado = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-900">
      <Header isLoggedIn={true} />
      <HeroBannerSection />
      <FeaturedEventSection />
      <EventCardsSection />
      <Footer />
    </div>
  );
};
