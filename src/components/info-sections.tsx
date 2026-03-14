'use client';

import { Accordion } from '@/components/accordion';

// ─── Types ────────────────────────────────────────────────────────

type InfoSection = {
  title:   string;
  content: string;  // raw HTML string
};

type InfoSectionsProps = {
  sections: InfoSection[];
};

// ─── HTML content renderer ────────────────────────────────────────
// Renders raw HTML from the API safely.
// Scoped styles ensure lists, headings, and paragraphs
// inside the accordion content match the active theme.

function HtmlContent({ html }: { html: string }) {
  return (
    <div
      className="info-html-content"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        maxWidth: '680px',
      }}
    />
  );
}

// ─── Main section ─────────────────────────────────────────────────

export function InfoSections({ sections }: InfoSectionsProps) {
  if (!sections?.length) return null;

  const accordionItems = sections.map((section, i) => ({
    title:       section.title,
    defaultOpen: i === 0,   // Inclusions open by default
    content: (
      <HtmlContent html={section.content} />
    ),
  }));

  return (
    <section
      style={{
        marginBottom: 'var(--spacing-section)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontFamily:    'var(--font-heading)',
          fontSize:      'clamp(1.2rem, 3vw, 1.6rem)',
          fontWeight:    700,
          color:         'var(--color-text)',
          marginBottom:  'var(--spacing-md)',
          paddingBottom: 'var(--spacing-sm)',
          borderBottom:  '2px solid var(--color-primary)',
          display:       'inline-block',
        }}
      >
        More Information
      </h2>

      <Accordion items={accordionItems} />
    </section>
  );
}