// Institution rules — document requirements per bank/insurer

export interface RequiredDoc {
  id: string;
  label: string;
  mandatory: boolean;
  condition?: string;
}

export interface InstitutionRule {
  name: string;
  color: string;
  claimForm?: string;
  requiredDocs: RequiredDoc[];
  sladays: number;
  simplifiedThreshold: number;
  contact: string;
}

export const INSTITUTION_RULES: Record<string, InstitutionRule> = {
  SBI: {
    name: 'State Bank of India',
    color: '#0A3D91',
    claimForm: 'SBI Form DA1/DA2',
    requiredDocs: [
      { id: 'death_certificate', label: 'Death Certificate (Original + Attested Copy)', mandatory: true },
      { id: 'aadhaar', label: 'Aadhaar Card of Claimant', mandatory: true },
      { id: 'pan', label: 'PAN Card of Claimant', mandatory: true },
      { id: 'bank_passbook', label: "Deceased's Bank Passbook/Statement", mandatory: true },
      { id: 'claimant_photo', label: 'Passport Photo (2 copies)', mandatory: true },
      { id: 'claim_form', label: 'Claim Settlement Form (DA1)', mandatory: true },
      { id: 'succession_cert', label: 'Succession Certificate', mandatory: false, condition: 'Required if no nominee and amount > ₹15L' },
    ],
    sladays: 15,
    simplifiedThreshold: 1500000,
    contact: '1800-425-3800',
  },
  LIC: {
    name: 'Life Insurance Corporation',
    color: '#8B0000',
    requiredDocs: [
      { id: 'death_certificate', label: 'Death Certificate (Registered)', mandatory: true },
      { id: 'policy_document', label: 'Original Policy Bond', mandatory: true },
      { id: 'aadhaar', label: 'Claimant Aadhaar', mandatory: true },
      { id: 'pan', label: 'Claimant PAN', mandatory: true },
      { id: 'claimant_statement', label: "Claimant's Statement (Form 3784)", mandatory: true },
      { id: 'medical_cert', label: 'Medical Certificate of Cause of Death', mandatory: false, condition: 'Required for early claims (< 3 years)' },
      { id: 'original_policy_bond', label: 'Original Policy Bond', mandatory: true },
    ],
    sladays: 30,
    simplifiedThreshold: 1500000,
    contact: '022-6827-6827',
  },
  HDFC: {
    name: 'HDFC Bank',
    color: '#A50034',
    requiredDocs: [
      { id: 'death_certificate', label: 'Death Certificate', mandatory: true },
      { id: 'aadhaar', label: 'Deceased + Claimant Aadhaar', mandatory: true },
      { id: 'pan', label: 'Claimant PAN Card', mandatory: true },
      { id: 'bank_passbook', label: 'Account Statement (last 6 months)', mandatory: true },
      { id: 'kyc_documents', label: 'KYC Documents of Claimant', mandatory: true },
    ],
    sladays: 15,
    simplifiedThreshold: 1500000,
    contact: '1800-202-6161',
  },
  ICICI: {
    name: 'ICICI Bank',
    color: '#F47920',
    requiredDocs: [
      { id: 'death_certificate', label: 'Death Certificate', mandatory: true },
      { id: 'aadhaar', label: 'Aadhaar (Deceased + Claimant)', mandatory: true },
      { id: 'pan', label: 'PAN Card', mandatory: true },
      { id: 'bank_passbook', label: 'Bank Passbook/Cheque', mandatory: true },
      { id: 'kyc_documents', label: 'KYC of Nominee/Claimant', mandatory: true },
      { id: 'claim_form', label: 'Death Claim Form', mandatory: true },
    ],
    sladays: 15,
    simplifiedThreshold: 1500000,
    contact: '1800-200-3344',
  },
};

// Doc type keywords for heuristic matching
export const DOC_KEYWORDS: Record<string, string[]> = {
  death_certificate: ['death', 'certificate', 'mrityu'],
  aadhaar: ['aadhaar', 'aadhar', 'uid', 'आधार'],
  pan: ['pan'],
  bank_passbook: ['passbook', 'statement', 'account', 'bank'],
  claimant_photo: ['photo', 'photograph', 'pic'],
  claim_form: ['claim', 'form', 'da1', 'da2'],
  succession_cert: ['succession', 'probate', 'heir'],
  policy_document: ['policy', 'bond', 'insurance'],
  claimant_statement: ['statement', 'claimant', '3784'],
  medical_cert: ['medical', 'hospital', 'cause'],
  original_policy_bond: ['policy', 'bond', 'original'],
  kyc_documents: ['kyc', 'know'],
};

export function checkUploadedDocs(
  uploadedNames: string[],
  institution: string
): { present: string[]; missing: string[] } {
  const rules = INSTITUTION_RULES[institution];
  if (!rules) return { present: [], missing: [] };

  const present: string[] = [];
  const missing: string[] = [];

  for (const doc of rules.requiredDocs) {
    if (!doc.mandatory) continue;
    const keywords = DOC_KEYWORDS[doc.id] || [doc.id];
    const found = uploadedNames.some((name) =>
      keywords.some((kw) => name.toLowerCase().includes(kw))
    );
    if (found) {
      present.push(doc.id);
    } else {
      missing.push(doc.id);
    }
  }

  return { present, missing };
}
