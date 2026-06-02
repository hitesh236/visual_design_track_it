'use client';

import React from 'react';
import { formatINR, deriveStartDate, deriveEndDate, formatDuration, formatTravelers } from '@/lib/itinerary-utils';

type HeroProps = {
  title: string;
  featureImage: string;
  finalPrice: string | number;
  adults: number;
  children: number;
  minors: number;
  clientName: string;
  components: any[];
};

export function HeroSection({ title, featureImage, finalPrice, adults, children, minors, clientName, components }: HeroProps) {
  const start = deriveStartDate(components);
  const end = deriveEndDate(components);
  const duration = formatDuration(start, end);
  const travelers = formatTravelers(adults, children, minors);

  return (
    <div className="hero-root mb-[var(--spacing-section)]">
      <div className="relative w-full h-[clamp(320px,40vw,560px)] rounded-[var(--radius-card)] overflow-hidden flex flex-col justify-end">
        <img src={featureImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative p-[var(--spacing-lg)] z-10">
          <div className="flex gap-2 mb-3">
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{duration}</span>
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{travelers}</span>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">{title}</h1>
          <div className="flex justify-between items-end flex-wrap gap-4">
            <p className="text-white/80 text-sm font-medium">Prepared for <span className="text-white font-bold">{clientName}</span></p>
            <div className="text-right">
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Total Package</div>
              <div className="bg-primary text-white font-heading font-bold text-2xl px-6 py-2 rounded-full shadow-xl">
                {formatINR(finalPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-0 rounded-b-[var(--radius-card)] py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Dates</span>
          <span className="text-xs font-bold">{new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}</span>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Travelers</span>
          <span className="text-xs font-bold">{adults+children+minors} Total</span>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase">Duration</span>
          <span className="text-xs font-bold">{duration}</span>
        </div>
      </div>
    </div>
  );
}