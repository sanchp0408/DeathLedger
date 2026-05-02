'use client';

import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  nomineeExists: boolean;
}

export default function NomineeRoute({ nomineeExists }: Props) {
  const t = useTranslations();

  if (!nomineeExists) return null;

  const copyLegalText = async () => {
    const text = `Under Section 45ZA of the Banking Regulation Act, 1949:
1. The bank is legally obligated to pay the nominee the balance in the account.
2. The bank CANNOT demand a Succession Certificate or any court order.
3. The bank CANNOT demand an Indemnity Bond from the nominee.
4. The nominee is entitled to receive payment without legal proceedings.

Reference: Section 45ZA & 45ZC, Banking Regulation Act, 1949.
Also see: RBI Master Circular on Customer Service in Banks, 2015.
Circular: RBI/2025-26/95 (October 28, 2025) — Simplified Procedure for deceased depositor accounts.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #E6EEF8, #EFF8F0)',
      border: '1.5px solid var(--color-primary)',
      borderRadius: 'var(--radius)',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>🛡️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-primary)' }}>
            {t.legalProtectionActive}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {t.nomineeRightsText}
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '12px' }}>
        {[t.cannotDemandSuccession, t.cannotDemandIndemnity, t.mustProcessPayment].map((right, i) => (
          <li
            key={i}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-primary-dark)',
              padding: '5px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: 'var(--color-ok)', fontSize: '14px' }}>✓</span>
            {right}
          </li>
        ))}
      </ul>

      <button
        className="btn-ghost"
        style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
        onClick={copyLegalText}
      >
        📋 Copy Legal Text (show to branch manager)
      </button>
    </div>
  );
}
