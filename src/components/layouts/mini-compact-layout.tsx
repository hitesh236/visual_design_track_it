
'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function MiniCompactDayLayout({ day, date }: { day: DayData, date?: string }) {
  return (
    <div className="mb-10">
      <header className="flex items-center gap-3 mb-5 px-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}
        >
          {day.day_number}
        </div>
        <div>
          <h2 className="day-heading-override text-base leading-none">
            {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
          </h2>
          {date && <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>}
        </div>
      </header>
      <div className="flex flex-col gap-5">
        <ComponentRenderer components={day.components} />
      </div>
    </div>
  );
}
