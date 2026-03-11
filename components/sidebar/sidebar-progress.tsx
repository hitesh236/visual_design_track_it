'use client';

import type { CompanyData } from '@/hooks/use-company';
import type { ExecutiveData } from '@/hooks/use-executive';
import type { Section } from '@/hooks/use-sections';

type SidebarProgressProps = {
  company:      CompanyData;
  executive:    ExecutiveData;
  activeMoodId: string;
  primaryColor: string; // custom color
  sections:     Section[];
};

export function SidebarProgress({
  company,
  executive,
  activeMoodId,
  primaryColor,
  sections,
}: SidebarProgressProps) {
  // Logic: 
  // company name: 15%
  // company logo: 10%
  // exec name: 10%
  // exec photo: 10%
  // exec whatsapp: 10%
  // mood customized (not default): 5% -> Actually, we'll check if it's not the first one or if user manually changed.
  // brand color customized: 5%
  // all sections visible: 5%
  // base data (itinerary contents): 30%

  let percentage = 0;
  let nextTip = 'Add more details to perfect your itinerary.';

  if (company.name.trim()) percentage += 15;
  else nextTip = 'Add your agency name in the Identity section.';

  if (company.logoUrl) percentage += 10;
  else if (percentage >= 15) nextTip = 'Add your agency logo to build customer trust.';

  if (executive.name.trim()) percentage += 10;
  else if (percentage >= 25) nextTip = 'Introduce yourself as the sales executive.';

  if (executive.photoUrl) percentage += 10;
  else if (percentage >= 35) nextTip = 'Add a profile photo for a personal touch.';

  if (executive.whatsapp.trim()) percentage += 10;
  else if (percentage >= 45) nextTip = 'Add your WhatsApp number for quick customer reach.';

  // Mood/Color/Sections (simplified)
  if (activeMoodId !== 'nature') percentage += 5;
  if (primaryColor) percentage += 5;
  if (sections.every(s => s.isVisible)) percentage += 5;
  
  // Base data is hardcoded for now as 30% because the itinerary exists.
  percentage += 30;

  return (
    <div
      style={{
        padding:         '16px 12px 12px 12px',
        borderBottom:    '1px solid var(--color-border)',
        display:         'flex',
        flexDirection:   'column',
        gap:             '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize:   '11px',
            fontWeight: 700,
            color:      'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Setup Progress
        </span>
        <span
          style={{
            fontSize:   '12px',
            fontWeight: 700,
            color:      'var(--color-text)',
          }}
        >
          {percentage}%
        </span>
      </div>

      <div
        style={{
          width:           '100%',
          height:          '4px',
          backgroundColor: 'var(--color-border)',
          borderRadius:    '99px',
          overflow:        'hidden',
        }}
      >
        <div
          style={{
            width:      `${percentage}%`,
            height:     '100%',
            backgroundColor: 'var(--color-primary)',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      <p
        style={{
          fontSize:   '11px',
          color:      'var(--color-text-muted)',
          margin:     '4px 0 0 0',
          lineHeight: 1.4,
          fontStyle:  'italic',
        }}
      >
        💡 {nextTip}
      </p>
    </div>
  );
}
