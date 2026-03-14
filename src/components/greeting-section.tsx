'use client';

type GreetingSectionProps = {
  html: string;
};

function GreetingHtmlContent({ html }: { html: string }) {
  return (
    <>
      <style>{`
        .greeting-html-content p {
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          font-family: var(--font-body);
          color: var(--color-text);
          margin: 0 0 8px 0;
          line-height: 1.7;
        }
        .greeting-html-content p:last-child {
          margin-bottom: 0;
        }
        .greeting-html-content strong {
          color: var(--color-primary);
          font-weight: 700;
        }
      `}</style>
      <div
        className="greeting-html-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}


export function GreetingSection({ html }: GreetingSectionProps) {
  if (!html) {
    return null;
  }

  return (
    <section 
        style={{ 
            marginBottom: 'var(--spacing-section)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)',
        }}
    >
      <GreetingHtmlContent html={html} />
    </section>
  );
}