'use client';

import { motion } from 'framer-motion';
import { Search, Scale, FileText, Globe, Landmark, Clock } from 'lucide-react';
import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

const features: Feature[] = [
  {
    icon: <Search />,
    title: 'Smart Name Matching',
    desc: 'Detects "Rajesh Kumar" vs "R. Kumar" automatically using 4-algorithm fuzzy matching',
    color: 'var(--color-primary)',
    bg: 'var(--color-primary-light)',
  },
  {
    icon: <Scale />,
    title: 'RBI 2026 Compliant',
    desc: 'Cites exact circular RBI/2025-26/95 in every letter — updated for current regulations',
    color: '#1550B0',
    bg: '#EEF2FF',
  },
  {
    icon: <FileText />,
    title: 'One-Click Packet',
    desc: 'Download a court-ready PDF with checklist, contradiction report & covering letter in under 5 minutes',
    color: 'var(--color-ok)',
    bg: 'var(--color-ok-bg)',
  },
  {
    icon: <Globe />,
    title: 'Hindi Interface',
    desc: "Full UI switch for Tier 2 & 3 families — because access to justice shouldn't need English",
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: <Landmark />,
    title: 'Institution-Specific',
    desc: "Separate checklists for SBI, LIC, HDFC, and ICICI — tailored to each institution's requirements",
    color: 'var(--color-minor)',
    bg: 'var(--color-minor-bg)',
  },
  {
    icon: <Clock />,
    title: '15-Day SLA Tracker',
    desc: 'Know exactly when the bank is legally obligated to pay — and cite the law when they delay',
    color: 'var(--color-accent)',
    bg: 'var(--color-accent-light)',
  },
];

export default function FeaturesGrid() {
  return (
    <motion.div 
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      {features.map((feat) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          key={feat.title}
          className="card"
          style={{
            padding: '24px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-elevated)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)';
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: feat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: feat.color,
            }}
          >
            {React.isValidElement(feat.icon) 
              ? React.cloneElement(feat.icon as React.ReactElement<any>, { size: 24, strokeWidth: 1.5 }) 
              : feat.icon}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              marginBottom: '8px',
              color: 'var(--color-text-primary)',
            }}
          >
            {feat.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
            {feat.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
