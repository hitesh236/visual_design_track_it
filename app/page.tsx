'use client';

import { useState } from 'react';
import { ItineraryShell } from '@/components/itinerary-shell';
import { HeroSection } from '@/components/hero-section';
import { DayCard } from '@/components/day-card';
import ITINERARY from '@/data/ItineraryFull.json';
import { PricingSection } from '@/components/pricing-section';
import { InfoSections } from '@/components/info-sections';
import { Footer } from '@/components/footer';
import { GreetingSection } from '@/components/greeting-section';
import { CompanyHeader } from '@/components/company-header';
import { useCompany } from '@/hooks/use-company';
import { ExecutiveCard } from '@/components/executive-card';
import { useExecutive } from '@/hooks/use-executive';
import { Sidebar } from '@/components/sidebar/sidebar';
import { useSections } from '@/hooks/use-sections';
import PAYMENT_DATA from '@/data/Payment.json';
import { BankDetailsCard } from '@/components/bank-details-card';

const d = ITINERARY.data.data;

// Group components by day_number
function groupByDay(components: any[]) {
  const map: Record<number, any[]> = {};
  for (const c of components) {
    const dn = c.day_number;
    if (!map[dn]) map[dn] = [];
    map[dn].push(c);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([day_number, components]) => ({
      day_number: Number(day_number),
      title:      components[0]?.daywise_title ?? `Day ${day_number}`,
      components,
      isFeatured: false,
    }));
}

const days = groupByDay(d.components);

export default function Page() {
  const { company, updateField, setCompany } = useCompany();
  const { executive, updateExecutiveField, setExecutive } = useExecutive();
  const { sections, toggleVisibility, reorder: reorderSections } = useSections();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getInfoSection = (keyword: string) => {
    const k = keyword.toLowerCase();
    const found = (d.info_sections as any[] ?? []).find((s: any) => {
      const t = (s.title ?? s.section_type ?? '').toLowerCase();
      return t.includes(k);
    });
    if (!found) return null;
    return {
      title:   found.title ?? found.section_type ?? 'Info',
      content: found.content ?? found.body ?? '',
    };
  };

  // Group all visible info sections together to render under a single header
  const visibleSections = sections.filter(s => s.isVisible);
  const firstVisibleInfoId = visibleSections.find(s => s.id.startsWith('info_'))?.id;

  const infoSectionMap: Record<string, string> = {
    'info_inclusions': 'inclus',
    'info_exclusions': 'exclus',
    'info_terms': 'term',
    'info_refund': 'refund', // also maps to 'cancel' internally
    'info_payment': 'payment',
    'info_amendment': 'amend',
    'info_why': 'why',
  };

  const collectedInfoSections = visibleSections
    .filter(s => s.id.startsWith('info_'))
    .map(s => {
      let keyword = infoSectionMap[s.id] || s.id;
      let data = getInfoSection(keyword);
      if (!data && s.id === 'info_refund') data = getInfoSection('cancel');
      if (!data && s.id === 'info_why') data = getInfoSection('choose');
      return data ? { id: s.id, ...data } : null;
    })
    .filter(Boolean) as { id: string, title: string, content: string }[];

  const itineraryContent = (
    <>
      {sections.map(section => {
        if (!section.isVisible) return null;

        switch (section.id) {
          case 'company':
            return <div key="company" id="section-company"><CompanyHeader company={company} /></div>;
          case 'hero':
            return (
              <HeroSection
                key="hero"
                title={d.title}
                featureImage={d.feature_image}
                finalPrice={d.final_price}
                adults={d.travelers?.adults ?? 2}
                children={d.travelers?.children ?? 1}
                minors={d.travelers?.minors ?? 0}
                clientName={d.inquiry?.client_name ?? 'Guest'}
                inquiryId={d.inquiry?.inquiry_id ?? ''}
                components={d.components}
              />
            );
          
          case 'greeting':
            return d.greeting_message ? <GreetingSection key="greeting" html={d.greeting_message} /> : null;

          case 'days':
            return (
              <div key="days" style={{ position: 'relative' }}>
                {days.map((day, i) => (
                  <DayCard
                    key={day.day_number}
                    day={day}
                    isLast={i === days.length - 1}
                    forcedMobile={previewMode === 'mobile'}
                  />
                ))}
              </div>
            );

          case 'pricing':
            return (
              <PricingSection
                key="pricing"
                items={d.pricing_breakdown ?? d.components
                  .filter((c: any) => Number(c.price) > 0)
                  .map((c: any) => ({
                    item_name:  c.name ?? c.component_type,
                    item_type:  c.component_type,
                    day_number: c.day_number,
                    price:      c.price,
                  }))
                }
                totalPrice={d.final_price}
              />
            );

          case 'info_inclusions':
          case 'info_exclusions':
          case 'info_terms':
          case 'info_refund':
          case 'info_payment':
          case 'info_amendment':
          case 'info_why':
            if (section.id === firstVisibleInfoId && collectedInfoSections.length > 0) {
              return <InfoSections key="info_group" sections={collectedInfoSections} />;
            }
            return null;

          case 'bank_details':
            return <BankDetailsCard key="bank_details" details={PAYMENT_DATA.data.items.bankdetail.results as any} />;

          case 'executive':
            return <div key="executive" id="section-executive"><ExecutiveCard executive={executive} /></div>;

          default:
            return null;
        }
      })}
      <Footer />
    </>
  );

  return (
    <>
      <style>{`
        .flex-root {
          display: flex;
          min-height: 100vh;
        }

        /* ── Desktop layout ── */
        .preview-area {
          flex: 1;
          overflow-y: auto;
          transition: margin-right 0.3s ease;
          background: var(--color-bg);
        }
        :root[data-sidebar-open="true"] .preview-area {
          margin-right: 320px;
        }

        /* ── Mobile preview wrapper ── */
        .mobile-preview-bg {
          flex: 1;
          overflow-y: auto;
          background: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 16px 60px;
          transition: margin-right 0.3s ease;
        }
        :root[data-sidebar-open="true"] .mobile-preview-bg {
          margin-right: 320px;
        }
        .mobile-device-frame {
          width: 375px;
          max-width: 100%;
          background: #ffffff;
          border-radius: 40px;
          box-shadow:
            0 0 0 8px #1e293b,
            0 0 0 10px #334155,
            0 30px 60px rgba(0,0,0,0.4);
          overflow: hidden;
          position: relative;
        }
        /* Notch */
        .mobile-device-frame::before {
          content: '';
          display: block;
          width: 120px;
          height: 28px;
          background: #1e293b;
          border-radius: 0 0 18px 18px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .mobile-scroll-area {
          max-height: 780px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        /* Scale-down content inside mobile view */
        .mobile-scroll-area .itinerary-inner-wrapper {
          max-width: 375px !important;
          padding: 0 !important;
        }
        /* Home indicator */
        .mobile-device-frame::after {
          content: '';
          display: block;
          width: 100px;
          height: 4px;
          background: #1e293b;
          border-radius: 4px;
          margin: 12px auto;
        }
        .mobile-label {
          margin-top: 16px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: var(--font-body, sans-serif);
        }
      `}</style>

      <div className="flex-root">
        <Sidebar
          company={company}
          updateField={updateField}
          setCompany={setCompany}
          executive={executive}
          updateExecutiveField={updateExecutiveField}
          setExecutive={setExecutive}
          sections={sections}
          toggleVisibility={toggleVisibility}
          reorderSections={reorderSections}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
        />

        {previewMode === 'desktop' ? (
          // ── Desktop View ──
          <div className="preview-area itinerary-container">
            <ItineraryShell forcedMobile={false}>
              {itineraryContent}
            </ItineraryShell>
          </div>
        ) : (
          // ── Mobile View ──
          <div className="mobile-preview-bg itinerary-container">
            <div className="mobile-device-frame">
              <div className="mobile-scroll-area">
                <ItineraryShell forcedMobile={true}>
                  {itineraryContent}
                </ItineraryShell>
              </div>
            </div>
            <p className="mobile-label">Mobile Preview (375px)</p>
          </div>
        )}
      </div>
    </>
  );
}
