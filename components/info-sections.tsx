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

function HtmlContent({ html, className }: { html: string; className?: string }) {
  const fullClassName = `info-html-content ${className || ''}`.trim();
  return (
    <>
      <style>{`
        .info-html-content ul,
        .info-html-content ol {
          padding-left: 1.4rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .info-html-content li {
          font-size: clamp(0.75rem, 1.4vw, 0.875rem);
          line-height: 1.7;
          color: var(--color-text);
          font-family: var(--font-body);
        }
        .info-html-content li::marker {
          color: var(--color-primary);
        }
        .info-html-content p {
          font-size: clamp(0.75rem, 1.4vw, 0.875rem);
          line-height: 1.7;
          color: var(--color-text);
          font-family: var(--font-body);
          margin: 0 0 8px 0;
        }
        .info-html-content strong {
          color: var(--color-text);
          font-weight: 700;
        }
        .info-html-content a {
          color: var(--color-primary);
          text-decoration: underline;
        }
      `}</style>
      <div
        className={fullClassName}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          maxWidth: '680px',
        }}
      />
    </>
  );
}

// ─── Section icon map ─────────────────────────────────────────────

function SectionIcon({ title }: { title: string }) {
  const t = title.toLowerCase();

  if (t.includes('inclus')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  if (t.includes('exclus')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );

  if (t.includes('payment')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );

  if (t.includes('cancel') || t.includes('refund')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
    </svg>
  );

  if (t.includes('term') || t.includes('condition')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );

  if (t.includes('amend')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  if (t.includes('why') || t.includes('choose')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  // Default
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

// ─── Main section ─────────────────────────────────────────────────

export function InfoSections({ sections }: InfoSectionsProps) {
  if (!sections?.length) return null;

  const accordionItems = sections.map((section, i) => {
    // Generate a sluggified class name based on the title
    const slug = section.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const uniqueClass = `info-content-${slug}`;

    return {
      title:       section.title,
      defaultOpen: i === 0,
      content: (
        <HtmlContent html={section.content} className={uniqueClass} />
      ),
    };
  });

  return (
    <section
      style={{
        marginBottom: 'var(--spacing-section)',
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
