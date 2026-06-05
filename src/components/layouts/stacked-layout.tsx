
'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function StackedDayLayout({ day, date }: { day: DayData; date?: string; isLast: boolean }) {
  return (
    <div className="stacked-day-wrapper mb-12 last:mb-0">
      <header className="flex items-center gap-4 mb-6">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
        >
          {day.day_number}
        </div>
        <div className="min-w-0">
          <h2 className="day-heading-override text-xl leading-tight truncate">
            {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
          </h2>
          {date && <div className="text-sm text-gray-500 font-medium">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <ComponentRenderer components={day.components} />
      </div>
    </div>
  );
}
