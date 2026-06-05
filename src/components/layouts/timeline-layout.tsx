
'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function TimelineDayLayout({ day, date }: { day: DayData, date?: string }) {
  return (
    <div className="timeline-day-root w-full mx-auto pb-12">
      <div className="flex items-center gap-6 mb-8 px-4">
        <div className="w-32 text-right font-heading font-bold text-primary text-sm uppercase tracking-wider">
          {date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : `Day ${day.day_number}`}
        </div>
        <div className="relative w-4 flex justify-center">
          <div 
            className="w-4 h-4 rounded-full border-2 bg-white z-10" 
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="day-heading-override text-lg uppercase tracking-tight">
             {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
          </h2>
        </div>
      </div>

      <div className="timeline-content">
        <ComponentRenderer components={day.components} dayDate={date} dayNumber={day.day_number} />
      </div>
    </div>
  );
}
