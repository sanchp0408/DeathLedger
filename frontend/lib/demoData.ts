// Demo data — Rajesh Kumar scenario for instant demo without API keys

export interface Comparison {
  docA: string;
  docB: string;
  nameA: string;
  nameB: string;
  score: number;
  severity: 'OK' | 'MINOR' | 'CRITICAL';
}

export interface AuditSummary {
  overallStatus: 'OK' | 'MINOR' | 'CRITICAL';
  criticalCount: number;
  minorCount: number;
  okCount: number;
}

export interface Regulatory {
  simplifiedProcedure: boolean;
  nomineeProtection: boolean;
  sladays: number;
  circular: string;
}

export interface AuditResult {
  claimant: {
    name: string;
    city: string;
    age: number;
  };
  deceased: {
    name: string;
    dateOfDeath: string;
  };
  institution: string;
  claimAmount: number;
  nomineeExists: boolean;
  extractedNames: Record<string, string>;
  comparisons: Comparison[];
  summary: AuditSummary;
  missingDocuments: string[];
  regulatory: Regulatory;
}

export const DEMO_AUDIT_RESULT: AuditResult = {
  claimant: {
    name: 'Sunita Devi',
    city: 'Varanasi',
    age: 58,
  },
  deceased: {
    name: 'Rajesh Kumar',
    dateOfDeath: '2022-03-15',
  },
  institution: 'SBI',
  claimAmount: 850000,
  nomineeExists: false,
  extractedNames: {
    'Death Certificate': 'Rajesh Kumar',
    'Aadhaar Card': 'Rajesh Kumar',
    'Bank Passbook': 'R. Kumar',
    'PAN Card': 'Rajesh Kumar Sharma',
  },
  comparisons: [
    {
      docA: 'Death Certificate',
      docB: 'Bank Passbook',
      nameA: 'Rajesh Kumar',
      nameB: 'R. Kumar',
      score: 62.0,
      severity: 'CRITICAL',
    },
    {
      docA: 'Death Certificate',
      docB: 'PAN Card',
      nameA: 'Rajesh Kumar',
      nameB: 'Rajesh Kumar Sharma',
      score: 78.3,
      severity: 'CRITICAL',
    },
    {
      docA: 'Bank Passbook',
      docB: 'PAN Card',
      nameA: 'R. Kumar',
      nameB: 'Rajesh Kumar Sharma',
      score: 51.2,
      severity: 'CRITICAL',
    },
    {
      docA: 'Death Certificate',
      docB: 'Aadhaar Card',
      nameA: 'Rajesh Kumar',
      nameB: 'Rajesh Kumar',
      score: 100.0,
      severity: 'OK',
    },
  ],
  summary: {
    overallStatus: 'CRITICAL',
    criticalCount: 3,
    minorCount: 0,
    okCount: 1,
  },
  missingDocuments: ['Bank Passbook (original)', 'Succession Certificate'],
  regulatory: {
    simplifiedProcedure: true,
    nomineeProtection: false,
    sladays: 15,
    circular: 'RBI/2025-26/95',
  },
};
