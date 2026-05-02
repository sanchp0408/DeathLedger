'use client';

import { INSTITUTION_RULES } from '@/lib/institutionRules';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  institution: string;
  uploadedDocIds: string[];
}

export default function MissingDocAlert({ institution, uploadedDocIds }: Props) {
  const t = useTranslations();
  const rules = INSTITUTION_RULES[institution];
  if (!rules) return null;

  const mandatoryDocs = rules.requiredDocs.filter((d) => d.mandatory);
  const criticalMissing = mandatoryDocs.filter((d) => !uploadedDocIds.includes(d.id));

  return (
    <div>
      {criticalMissing.length > 0 && (
        <div className="banner-critical" style={{ marginBottom: '12px', fontWeight: 600, fontSize: '13px' }}>
          ⚠️ {criticalMissing.length} required document{criticalMissing.length > 1 ? 's' : ''} missing — claim WILL be rejected without these.
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rules.requiredDocs.map((doc) => {
          const present = uploadedDocIds.includes(doc.id);
          const isMandatory = doc.mandatory;

          return (
            <li
              key={doc.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>
                {present ? '✅' : isMandatory ? '❌' : '⚪'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: present ? 'var(--color-text-primary)' : isMandatory ? 'var(--color-critical)' : 'var(--color-text-secondary)',
                }}>
                  {doc.label}
                  {!doc.mandatory && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      color: 'var(--color-text-muted)',
                      fontWeight: 400,
                    }}>Optional</span>
                  )}
                </div>
                {!present && isMandatory && (
                  <div style={{ fontSize: '11px', color: 'var(--color-critical)', marginTop: '2px', fontWeight: 600 }}>
                    MISSING — Claim WILL be rejected
                  </div>
                )}
                {doc.condition && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {doc.condition}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
