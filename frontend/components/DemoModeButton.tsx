'use client';

import { useState } from 'react';
import { useAuditStore } from '@/store/auditStore';
import { useTranslations } from '@/hooks/useTranslations';

interface ToastProps {
  message: string;
  visible: boolean;
}

function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '24px',
      background: 'var(--color-minor)',
      color: 'white',
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '13px',
      fontWeight: 600,
      zIndex: 1000,
      boxShadow: 'var(--shadow-elevated)',
      animation: 'slideInRight 0.3s ease',
    }}>
      {message}
    </div>
  );
}

export default function DemoModeButton() {
  const { activateDemoMode } = useAuditStore();
  const t = useTranslations();
  const [hovered, setHovered] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleClick = () => {
    activateDemoMode();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #FF8F00 0%, #FF5722 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          padding: '14px 22px',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(255, 87, 34, 0.5)',
          transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
        title="Load demo with Rajesh Kumar scenario"
      >
        <span style={{ fontSize: '18px' }}>▶</span>
        {t.demoMode}
      </button>
      <Toast message={`✨ ${t.demoLoaded}`} visible={toastVisible} />
    </>
  );
}
