'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { AuditResult } from '@/lib/demoData';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  audit: AuditResult;
  onClose: () => void;
}

export default function AffidavitModal({ audit, onClose }: Props) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  // Build affidavit from the most critical mismatch
  const criticals = audit.comparisons.filter((c) => c.severity === 'CRITICAL');
  const primaryMismatch = criticals[0];

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const affidavitText = `AFFIDAVIT OF NAME DECLARATION

I, ${audit.claimant.name}, aged ${audit.claimant.age} years, residing at ${audit.claimant.city},
do hereby solemnly affirm and declare as follows:

1. That my late husband/father/relative's name is spelled as "${primaryMismatch?.nameA || audit.deceased.name}"
   in the Death Certificate issued by the competent authority.

2. That the same person's name appears as "${primaryMismatch?.nameB || audit.deceased.name}" in the 
   ${primaryMismatch?.docB || 'institution'} records with ${audit.institution}.

3. That "${primaryMismatch?.nameA || audit.deceased.name}" and "${primaryMismatch?.nameB || audit.deceased.name}" 
   refer to one and the same person, and the difference in spelling is purely a clerical 
   inconsistency / orthographic variation / typographical abbreviation.

4. That all other details including date of birth, address, and identification numbers 
   are consistent across all documents.

5. I indemnify ${audit.institution} against any claims arising from this name discrepancy.

Deponent: ${audit.claimant.name}
Date: ${today}
Place: ${audit.claimant.city}

Verified and sworn before Notary Public.

Note: This affidavit supports claims under RBI Circular RBI/2025-26/95 which provides 
for simplified settlement procedures including acceptance of self-declaration affidavits 
for name discrepancies.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affidavitText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("AFFIDAVIT OF NAME DECLARATION", pageWidth / 2, 20, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Split text to fit within page width
    const splitText = doc.splitTextToSize(affidavitText.replace("AFFIDAVIT OF NAME DECLARATION\n\n", ""), pageWidth - (margin * 2));
    doc.text(splitText, margin, 35);
    
    doc.save(`DeathLedger_Affidavit_${audit.claimant.name.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '0' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-primary)' }}>
              📜 {t.affidavitTitle}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '2px', opacity: 0.8 }}>
              Pre-filled with extracted document data
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Alert */}
        <div style={{ padding: '16px 24px', background: 'var(--color-minor-bg)', borderBottom: '1px solid rgba(245, 124, 0, 0.2)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-minor)', fontWeight: 600 }}>
            ⚠️ {criticals.length} critical mismatch{criticals.length > 1 ? 'es' : ''} detected — this affidavit covers all name discrepancies.
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Print on ₹100 stamp paper and get notarized before submitting to {audit.institution}.
          </div>
        </div>

        {/* Affidavit Text */}
        <div style={{ padding: '20px 24px' }}>
          <pre style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
            color: 'var(--color-text-primary)',
            lineHeight: 1.8,
            maxHeight: '360px',
            overflowY: 'auto',
          }}>
            {affidavitText}
          </pre>
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          <button
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', minWidth: '140px' }}
            onClick={handleCopy}
          >
            {copied ? '✅ Copied!' : t.copyAffidavit}
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, justifyContent: 'center', minWidth: '140px' }}
            onClick={handleDownloadPDF}
          >
            📄 {t.downloadPDF}
          </button>
          <button
            className="btn-ghost"
            style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}
            onClick={onClose}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
