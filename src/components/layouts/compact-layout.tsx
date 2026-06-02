'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function CompactDayLayout({ day }: { day: DayData }) {
  return (
    <div className="compact-day-card itin-card p-4 mb-4">
      <header className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
          Day {day.day_number}
        </span>
        <h3 className="font-heading font-bold text-primary text-sm truncate">
          {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
        </h3>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ComponentRenderer components={day.components} />
      </div>
    </div>
  );
}