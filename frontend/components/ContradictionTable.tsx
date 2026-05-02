'use client';

import React, { useState } from 'react';
import { useAuditStore } from '@/store/auditStore';
import { Comparison } from '@/lib/demoData';
import ConfidencePill from './ConfidencePill';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  comparisons: Comparison[];
}

export default function ContradictionTable({ comparisons }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const t = useTranslations();

  const criticalCount = comparisons.filter((c) => c.severity === 'CRITICAL').length;
  const hasCritical = criticalCount > 0;

  return (
    <div>
      {/* Severity Badge */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: hasCritical ? 'var(--color-critical-bg)' : 'var(--color-ok-bg)',
            color: hasCritical ? 'var(--color-critical)' : 'var(--color-ok)',
            border: `2px solid ${hasCritical ? 'var(--color-critical)' : 'var(--color-ok)'}`,
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.04em',
            animation: hasCritical ? 'pulse-ring 2s infinite' : 'none',
          }}
        >
          {hasCritical
            ? `${criticalCount} CRITICAL MISMATCH${criticalCount > 1 ? 'ES' : ''} FOUND`
            : t.auditPassed}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <table className="contradiction-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 14px', background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>DOCUMENT PAIR</th>
              <th style={{ padding: '10px 14px', background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>NAME A</th>
              <th style={{ padding: '10px 14px', background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>NAME B</th>
              <th style={{ padding: '10px 14px', background: 'var(--color-bg)', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>RESULT</th>
              <th style={{ padding: '10px 14px', background: 'var(--color-bg)', width: '36px', borderBottom: '1px solid var(--color-border)' }}></th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c, i) => (
              <React.Fragment key={i}>
                <tr
                  style={{
                    background:
                      c.severity === 'CRITICAL'
                        ? 'rgba(165, 0, 52, 0.025)'
                        : c.severity === 'MINOR'
                        ? 'rgba(245, 124, 0, 0.025)'
                        : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <td style={{ padding: '12px 14px', borderBottom: expanded === i ? 'none' : '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {c.docA}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                      → {c.docB}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', borderBottom: expanded === i ? 'none' : '1px solid var(--color-border)' }}>
                    {c.nameA}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', borderBottom: expanded === i ? 'none' : '1px solid var(--color-border)' }}>
                    {c.nameB}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', borderBottom: expanded === i ? 'none' : '1px solid var(--color-border)' }}>
                    <ConfidencePill score={c.score} severity={c.severity} />
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: expanded === i ? 'none' : '1px solid var(--color-border)' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--color-border)',
                      fontSize: '10px',
                      transition: 'transform 0.2s',
                      transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--color-text-muted)',
                    }}>▼</span>
                  </td>
                </tr>
                {expanded === i && (
                  <tr key={`detail-${i}`}>
                    <td colSpan={5} style={{ padding: '0', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{
                        background: 'var(--color-bg)',
                        padding: '16px 14px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                      }}>
                        <div style={{ borderRadius: '8px', background: 'white', padding: '12px', border: '1px solid var(--color-border)' }}>
                          <div className="label-caps" style={{ marginBottom: '6px' }}>From {c.docA}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            &quot;{c.nameA}&quot;
                          </div>
                        </div>
                        <div style={{ borderRadius: '8px', background: 'white', padding: '12px', border: '1px solid var(--color-border)' }}>
                          <div className="label-caps" style={{ marginBottom: '6px' }}>From {c.docB}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            &quot;{c.nameB}&quot;
                          </div>
                        </div>
                        {c.severity === 'CRITICAL' && (
                          <div style={{ gridColumn: '1/-1' }}>
                            <div className="banner-critical" style={{ fontSize: '12px' }}>
                              <strong>Remedy:</strong> Generate a One-Name Affidavit declaring that &quot;{c.nameA}&quot; and &quot;{c.nameB}&quot; refer to the same person. Submit at the institution branch.
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
