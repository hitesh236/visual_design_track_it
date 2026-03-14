'use client';

type GreetingSectionProps = {
  html: string;
};

export function GreetingSection({ html }: GreetingSectionProps) {
  if (!html) {
    return null;
  }

  return (
    <section 
        className="greeting-section-root"
        style={{ 
            marginBottom: 'var(--spacing-section)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)',
            width: '100%',
            boxSizing: 'border-box',
        }}
    >
      <div
        className="greeting-html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}