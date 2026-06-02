'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function StackedDayLayout({ day, date, isLast }: { day: DayData, date?: string, isLast: boolean }) {
  return (
    <div className="stacked-day-wrapper mb-12 relative">
      <header className="flex items-center gap-4 mb-6">
        <div className="day-pill flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold shadow-md">
          {day.day_number}
        </div>
        <div className="min-w-0">
          <h2 className="day-heading-override text-xl font-bold leading-tight truncate">
            {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
          </h2>
          {date && <div className="text-sm text-gray-500 font-medium">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>}
        </div>
      </header>

      <div className="day-content grid grid-cols-1 gap-6">
        <ComponentRenderer components={day.components} />
      </div>
    </div>
  );
}