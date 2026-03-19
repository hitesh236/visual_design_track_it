'use client';

import React from 'react';

type BankDetail = {
  id: string;
  bank_name: string;
  payee_name: string;
  account_number: string;
  branch_address: string;
  ifsc_code: string;
  account_type: string;
  swift_code: string;
  qr_codes: string[];
};

type BankDetailsCardProps = {
  details: BankDetail[];
};

export function BankDetailsCard({ details }: BankDetailsCardProps) {
  if (!details || details.length === 0) return null;

  return (
    <>
      <style>{`
        /* 📱 1. MOBILE FIRST (Default Vertical Layout) */
        .bank-details-section {
          margin: var(--spacing-section) 0;
          font-family: var(--font-body);
        }

        .bank-details-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .bank-details-title {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-primary);
          margin: 0;
        }

        .bank-details-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }

        .bank-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: 20px;
          box-shadow: var(--shadow-card);
          transition: transform 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .bank-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary);
        }

        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: var(--color-primary);
        }

        .bank-content-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bank-card-header {
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }

        .bank-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
          font-family: var(--font-heading);
        }

        .account-type {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-primary);
          font-weight: 700;
          margin-bottom: 4px;
          display: block;
        }

        .qr-container {
          align-self: center;
          width: 100%;
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .qr-code-large {
          width: 160px;
          height: 160px;
          border-radius: 12px;
          /* border: 1px solid var(--color-border); */ /* Removed as per instruction, but not explicitly stated to remove. Keeping it for now. */
          padding: 8px;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .scan-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bank-info-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .info-value {
          font-size: 1rem;
          color: var(--color-text);
          font-weight: 700;
          word-break: break-all;
        }

        .bank-address {
           font-size: 0.8rem;
           color: var(--color-text-muted);
           line-height: 1.5;
           padding-top: 12px;
           border-top: 1px dashed var(--color-border);
           margin-top: auto;
        }

        /* 🧬 2. TABLET/DESKTOP ENHANCEMENTS */
        @media (min-width: 768px), print {
          .itinerary-shell:not([data-forced-mobile="true"]) .bank-details-grid {
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 24px;
          }

          .itinerary-shell:not([data-forced-mobile="true"]) .bank-card {
            flex-direction: row;
            padding: 24px;
          }

          .itinerary-shell:not([data-forced-mobile="true"]) .qr-container {
            width: auto;
            border-top: none;
            padding-top: 0;
            border-left: 1px solid var(--color-border);
            padding-left: 20px;
            align-self: stretch;
            justify-content: center;
          }

          .itinerary-shell:not([data-forced-mobile="true"]) .qr-code-large {
            width: 120px;
            height: 120px;
          }
        }
        /* 🧹 3. Clean up forced-mobile override logic */
        .itinerary-shell[data-forced-mobile="true"] .bank-details-grid {
          grid-template-columns: 1fr !important;
        }
        .itinerary-shell[data-forced-mobile="true"] .bank-card {
           flex-direction: column;
           align-items: flex-start;
        }
        .itinerary-shell[data-forced-mobile="true"] .qr-container {
          align-self: center;
          width: 100%;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }
        .itinerary-shell[data-forced-mobile="true"] .qr-code-large {
          width: 160px;
          height: 160px;
        }
      `}</style>

      <div className="bank-details-section" id="section-bank-details">
        <div className="bank-details-header">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-primary)'}}>
             <rect x="2" y="5" width="20" height="14" rx="2" />
             <line x1="2" y1="10" x2="22" y2="10" />
             <path d="M7 15h.01M11 15h.01" />
           </svg>
           <h2 className="bank-details-title">Payment Information</h2>
        </div>

        <div className="bank-details-grid">
          {details.map((bank) => (
            <div key={bank.id} className="bank-card">
              <div className="bank-content-main">
                <div className="bank-card-header">
                  <span className="account-type">{bank.account_type || 'Bank Account'}</span>
                  <h3 className="bank-name">{bank.bank_name}</h3>
                </div>

                <div className="bank-info-rows">
                  <div className="info-row">
                    <span className="info-label">Payee Name</span>
                    <span className="info-value">{bank.payee_name}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Account Number</span>
                    <span className="info-value">{bank.account_number}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">IFSC Code</span>
                    <span className="info-value">{bank.ifsc_code}</span>
                  </div>

                  {bank.swift_code && (
                    <div className="info-row">
                      <span className="info-label">Swift Code</span>
                      <span className="info-value">{bank.swift_code}</span>
                    </div>
                  )}
                </div>

                {bank.branch_address && (
                  <div className="bank-address">
                    {bank.branch_address}
                  </div>
                )}
              </div>

              {bank.qr_codes && bank.qr_codes[0] && (
                <div className="qr-container">
                  <div className="scan-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    </svg>
                    Scan to Pay
                  </div>
                  <img src={bank.qr_codes[0]} alt="QR Code" className="qr-code-large" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
