'use client';

import React from 'react';
import { DayData } from '../day-card';
import { ComponentRenderer } from '../component-renderer';

export function TimelineDayLayout({ day, date }: { day: DayData, date?: string }) {
  return (
    <div className="timeline-day-root w-full max-w-[794px] mx-auto py-8">
      <div className="timeline-header flex items-center gap-6 mb-8 px-4">
        <div className="time-col w-32 text-right font-heading font-bold text-primary text-sm uppercase tracking-wider">
          {date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : `Day ${day.day_number}`}
        </div>
        <div className="node-col relative w-4 flex justify-center">
          <div className="timeline-node" />
        </div>
        <div className="content-col flex-1 min-w-0">
          <h2 className="day-heading-override text-lg font-bold uppercase tracking-tight">
             {day.title.replace(/^day\s+\d+[\s:·\-–—]*/i, '').trim()}
          </h2>
        </div>
      </div>

      <div className="timeline-components-wrapper">
        <ComponentRenderer components={day.components} />
      </div>
    </div>
  );
}