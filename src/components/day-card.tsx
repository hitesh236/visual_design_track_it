'use client';

import { useTheme } from '@/context/theme-context';
import { StackedDayLayout } from './layouts/stacked-layout';
import { TimelineDayLayout } from './layouts/timeline-layout';
import { CompactDayLayout } from './layouts/compact-layout';
import { MiniCompactDayLayout } from './layouts/mini-compact-layout';

export type DayData = {
  day_number: number;
  title:      string;
  components: any[];
  date?:      string;
  isFeatured?: boolean;
};

export function DayCard({ day, isLast = false }: { day: DayData; isLast?: boolean }) {
  const { layout } = useTheme();
  const date = day.components[0]?.metadata?.day_date ?? day.date;

  switch (layout) {
    case 'timeline':
      return <TimelineDayLayout day={day} date={date} />;
    case 'compact':
      return <CompactDayLayout day={day} />;
    case 'mini-compact':
      return <MiniCompactDayLayout day={day} date={date} />;
    default:
      return <StackedDayLayout day={day} date={date} isLast={isLast} />;
  }
}