'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { Clipboard, AlertTriangle } from 'lucide-react';

interface Props {
  submissionDate: Date | null;
  onDateChange: (date: Date | null) => void;
  totalDays?: number;
}

function getDayStatus(day: number, total: number) {
  if (day >= total) return 'breached';
  if (day >= total - 4) return 'followup';
  return 'ontrack';
}

export default function SLACountdown({ submissionDate, onDateChange, totalDays = 15 }: Props) {
  const t = useTranslations();
  const [today] = useState(() => new Date());

  const daysElapsed = submissionDate
    ? Math.floor((today.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const pct = Math.min(100, (daysElapsed / totalDays) * 100);
  const status = submissionDate ? getDayStatus(daysElapsed, totalDays) : 'ontrack';

  const statusColor = {
    ontrack: 'var(--color-ok)',
    followup: 'var(--color-minor)',
    breached: 'var(--color-critical)',
  }[status];

  const statusMsg = {
    ontrack: t.onTrack,
    followup: t.followUp,
    breached: t.slaBreached,
  }[status];

  const progressColor = {
    ontrack: 'var(--color-ok)',
    followup: 'var(--color-minor)',
    breached: 'var(--color-critical)',
  }[status];

  const legalText = `Under RBI Circular RBI/2025-26/95 (October 28, 2025), your institution is legally obligated to settle this death claim within 15 working days of receiving complete documentation. As of today, ${daysElapsed} day(s) have elapsed. Failure to settle by Day 15 will result in the institution being liable to pay interest on the claim amount as per RBI directions.`;

  const copyLegal = () => {
    navigator.clipboard.writeText(legalText);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
          {t.submissionDate}
        </label>
        <input
          type="date"
          className="input"
          value={submissionDate ? submissionDate.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            if (e.target.value) {
              onDateChange(new Date(e.target.value));
            } else {
              onDateChange(null);
            }
          }}
          max={today.toISOString().split('T')[0]}
        />
      </div>

      {submissionDate && (
        <>
          {/* Day Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                color: statusColor,
                lineHeight: 1,
              }}>
                Day {Math.min(daysElapsed, totalDays)} <span style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>of {totalDays}</span>
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: statusColor,
                marginTop: '4px',
                animation: status === 'breached' ? 'pulse-ring 1s infinite' : 'none',
              }}>
                {statusMsg}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                {daysRemaining}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Days Left
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-track" style={{ marginBottom: '16px' }}>
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ background: progressColor }}
            />
          </div>

          {/* Copy Legal Text */}
          <button
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={copyLegal}
          >
            <Clipboard size={16} strokeWidth={1.5} /> Cite this to the bank branch manager
          </button>

          {status === 'breached' && (
            <div className="banner-critical" style={{ marginTop: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} strokeWidth={1.5} /> Bank must settle immediately or begin paying interest per RBI/2025-26/95 Section 7(b)
            </div>
          )}
        </>
      )}

      {!submissionDate && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
        }}>
          Enter the date you submitted complete documents to start tracking
        </div>
      )}
    </div>
  );
}
