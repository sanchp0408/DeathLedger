import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeathLedger — AI Auditor for Indian Death Claim Settlements',
  description:
    'Automatically detect name mismatches, generate RBI-compliant claim letters, and settle death claims without a lawyer. Built for Indian families navigating bank and insurance claims.',
  keywords: 'death claim, bank claim settlement, RBI 2025-26/95, name mismatch, succession certificate, India, SBI, LIC, HDFC, ICICI',
  authors: [{ name: 'DeathLedger' }],
  openGraph: {
    title: 'DeathLedger — Your Legal Shield When It Matters Most',
    description: 'AI-powered death claim settlement assistant for Indian families',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
