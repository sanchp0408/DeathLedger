'use client';

import { useAuditStore } from '@/store/auditStore';

export default function HindiToggle() {
  const { language, setLanguage } = useAuditStore();
  const isHindi = language === 'hi';

  return (
    <button
      onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
      className="lang-toggle"
      title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--color-primary-light)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '9999px',
        padding: '4px',
        gap: '2px',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s',
          background: !isHindi ? 'var(--color-primary)' : 'transparent',
          color: !isHindi ? 'white' : 'var(--color-text-secondary)',
        }}
      >
        EN
      </span>
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s',
          background: isHindi ? 'var(--color-primary)' : 'transparent',
          color: isHindi ? 'white' : 'var(--color-text-secondary)',
        }}
      >
        हिं
      </span>
    </button>
  );
}
