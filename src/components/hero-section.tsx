
'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';
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

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[120px] px-6 py-2 flex flex-col justify-center border-r border-gray-100 last:border-0">
      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-xs font-bold whitespace-nowrap">{value}</span>
    </div>
  );
}

export function HeroSection({ title, featureImage, finalPrice, adults, children, minors, clientName, components }: HeroProps) {
  const { theme, activeMoodId } = useTheme();
  const start = deriveStartDate(components);
  const end = deriveEndDate(components);
  const duration = formatDuration(start, end);
  const travelers = formatTravelers(adults, children, minors);

  const statsBarExtras: React.CSSProperties =
    theme.colorMode === 'dark'
      ? { borderTop: '1px solid rgba(255,255,255,0.08)' }
      : activeMoodId === 'spiritual'
        ? { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.5)', borderTop: 'none' }
        : {};

  return (
    <div className="hero-container">
      <div className="hero-image-wrapper">
        <img src={featureImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative p-8 z-10">
          <div className="flex gap-2 mb-3">
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{duration}</span>
             <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{travelers}</span>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">{title}</h1>
          <div className="flex justify-between items-end flex-wrap gap-4">
            <p className="text-white/80 text-sm font-medium">Prepared for <span className="text-white font-bold">{clientName}</span></p>
            <div className="text-right">
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Total Package</div>
              <div 
                className="font-heading font-bold text-2xl px-6 py-2 rounded-full shadow-xl"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
              >
                {formatINR(finalPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="itin-stats-bar" style={statsBarExtras}>
        <StatItem label="Travel Dates" value={`${new Date(start).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})} - ${new Date(end).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}`} />
        <StatItem label="Travelers" value={`${adults + children + minors} Total`} />
        <StatItem label="Duration" value={duration} />
        <StatItem label="Package Type" value="Premium" />
      </div>
    </div>
  );
}
