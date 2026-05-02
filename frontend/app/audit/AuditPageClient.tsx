'use client';

import Link from 'next/link';
import AuditorSplitScreen from '@/components/AuditorSplitScreen';
import HindiToggle from '@/components/HindiToggle';
import DemoModeButton from '@/components/DemoModeButton';
import { useTranslations } from '@/hooks/useTranslations';

export default function AuditPageClient() {
  const t = useTranslations();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Top Bar */}
      <header style={{
        height: '68px',
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}>
              DeathLedger
            </span>
          </Link>
          <div style={{
            width: '1px',
            height: '20px',
            background: 'var(--color-border)',
          }} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}>
            {t.documentAudit}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            border: '1px solid rgba(10,61,145,0.2)',
          }}>
            ⚖️ RBI/2025-26/95
          </div>
          <HindiToggle />
        </div>
      </header>

      {/* Split Screen */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <AuditorSplitScreen />
      </div>

      {/* Floating Demo Button */}
      <DemoModeButton />
    </div>
  );
}
