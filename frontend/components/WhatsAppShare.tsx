'use client';

import { useState } from 'react';
import { AuditResult } from '@/lib/demoData';
import { generateWhatsAppSummary } from '@/lib/whatsapp';
import { useTranslations } from '@/hooks/useTranslations';

interface Props {
  audit: AuditResult;
}

export default function WhatsAppShare({ audit }: Props) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = generateWhatsAppSummary(audit);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      className="btn-primary"
      style={{
        width: '100%',
        justifyContent: 'center',
        background: '#25D366',
        fontSize: '14px',
      }}
      onClick={handleCopy}
    >
      {copied ? (
        <>✅ {t.copied}</>
      ) : (
        <>{t.copyWhatsApp}</>
      )}
    </button>
  );
}
