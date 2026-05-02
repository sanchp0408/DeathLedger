import type { Metadata } from 'next';
import AuditPageClient from './AuditPageClient';

export const metadata: Metadata = {
  title: 'Document Audit — DeathLedger',
  description: 'Upload your death claim documents and run an AI audit to detect name mismatches, check for missing documents, and generate a claim packet.',
};

export default function AuditPage() {
  return <AuditPageClient />;
}
