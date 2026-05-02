'use client';

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type Severity = 'OK' | 'MINOR' | 'CRITICAL';

interface Props {
  score: number;
  severity: Severity;
  showIcon?: boolean;
}

const SEVERITY_CONFIG = {
  OK: {
    bg: 'var(--color-ok-bg)',
    color: 'var(--color-ok)',
    border: 'rgba(31, 170, 89, 0.25)',
    Icon: CheckCircle,
    label: 'OK',
  },
  MINOR: {
    bg: 'var(--color-minor-bg)',
    color: 'var(--color-minor)',
    border: 'rgba(245, 124, 0, 0.25)',
    Icon: AlertTriangle,
    label: 'MINOR',
  },
  CRITICAL: {
    bg: 'var(--color-critical-bg)',
    color: 'var(--color-critical)',
    border: 'rgba(165, 0, 52, 0.25)',
    Icon: XCircle,
    label: 'CRITICAL',
  },
};

export default function ConfidencePill({ score, severity, showIcon = true }: Props) {
  const cfg = SEVERITY_CONFIG[severity];
  const Icon = cfg.Icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '9999px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 700,
        fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        {Math.round(score)}%
      </span>
      {showIcon && <Icon size={12} strokeWidth={2.5} />}
      <span>{cfg.label}</span>
    </span>
  );
}
