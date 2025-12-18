import React from 'react';
import { EventCarousel } from '../../../components/EventCarousel';

export const FeaturedEventSection = (): JSX.Element => {
  return (
    <section className="w-full bg-white dark:bg-slate-800 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <EventCarousel />
      </div>
    </section>
  );
};
