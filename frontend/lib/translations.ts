// Translation strings for English/Hindi

export type Language = 'en' | 'hi';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    howItWorks: 'How It Works',
    demo: 'Demo',
    startAudit: 'Start Audit →',

    // Landing
    heroTitle: 'Settle Death Claims Without a Lawyer',
    heroSubtitle: 'Automatically detect name mismatches, generate claim letters citing RBI 2025-26/95, and walk into any bank fully prepared.',
    startFreeAudit: 'Start Free Audit',
    watchDemo: 'Watch Demo',

    // Audit Page
    documentAudit: 'Document Audit',
    runAIAudit: 'Run AI Audit →',
    analyzing: 'Analyzing...',
    readingDocs: 'Reading documents...',
    comparingNames: 'Comparing names...',
    generatingReport: 'Generating report...',

    // Upload
    dropDocuments: 'Drop your documents here or click to upload',
    acceptedFormats: 'PDF, JPG, PNG accepted',
    uploadLabel: 'Upload Documents',

    // Institution
    selectInstitution: 'Select Institution',

    // Nominee
    nomineeExists: 'Does a nominee exist in bank records?',
    nomineeProtectionActive: 'Legal Protection Active',
    nomineeBannerText: 'Per Section 45ZA of the Banking Regulation Act, 1949: The bank CANNOT legally demand a Succession Certificate or Indemnity Bond. You are legally protected.',

    // Claim Amount
    claimAmount: 'Estimated Claim Amount (₹)',
    simplifiedProcedure: 'Simplified Procedure applies under RBI/2025-26/95 — fewer documents required.',

    // Results
    auditSummary: 'Audit Summary',
    okMatches: 'OK Matches',
    minorIssues: 'Minor Issues',
    criticalMismatches: 'Critical Mismatches',

    // Contradiction Table
    nameContradictions: 'Name Contradiction Engine',
    documentPair: 'Document Pair',
    documentA: 'Document A',
    documentB: 'Document B',
    score: 'Score',
    status: 'Status',

    // Status Labels
    ok: 'OK',
    minor: 'MINOR',
    critical: 'CRITICAL',

    // Missing Docs
    requiredDocuments: 'Required vs Uploaded Documents',
    missingDocument: 'Missing Document',
    present: 'Present',
    missing: 'MISSING — Claim WILL be rejected',

    // Nominee Section
    legalProtectionActive: '🛡️ LEGAL PROTECTION ACTIVE',
    nomineeRightsText: 'You have a registered nominee. Under Section 45ZA of the Banking Regulation Act, 1949:',
    cannotDemandSuccession: '→ The bank CANNOT demand a Succession Certificate',
    cannotDemandIndemnity: '→ The bank CANNOT demand an Indemnity Bond',
    mustProcessPayment: '→ The bank MUST process payment directly to nominee',

    // SLA
    settlementDeadline: 'Bank Settlement Deadline',
    slaSubtitle: 'RBI/2025-26/95 mandates 15-day settlement after complete documentation',
    submissionDate: 'Date of complete document submission',
    dayOf: 'Day {{current}} of {{total}}',
    onTrack: 'On track',
    followUp: 'Follow up with branch manager',
    slaBreached: 'SLA BREACHED — Bank must pay interest per RBI directions',

    // Actions
    downloadPacket: 'Download Complete Packet →',
    packetLabel: 'Includes: Checklist + Contradiction Report + Covering Letter citing RBI/2025-26/95',
    generateAffidavit: 'Generate Pre-Filled Affidavit →',
    copyWhatsApp: '📱 Copy for WhatsApp',
    copied: 'Copied!',

    // Affidavit
    affidavitTitle: 'One-Name Affidavit',
    copyAffidavit: 'Copy Affidavit Text',
    downloadPDF: 'Download as PDF',
    close: 'Close',

    // Demo
    demoMode: 'Demo Mode',
    demoLoaded: 'Demo loaded — Rajesh Kumar scenario',

    // Critical/OK messages
    criticalFound: '{{n}} CRITICAL MISMATCH{{plural}} FOUND',
    auditPassed: 'AUDIT PASSED ✅',

    // Footer
    footerTagline: 'Built for Bharat. Zero legal fees. Zero data sold.',
  },
  hi: {
    // Navigation
    home: 'होम',
    howItWorks: 'कैसे काम करता है',
    demo: 'डेमो',
    startAudit: 'ऑडिट शुरू करें →',

    // Landing
    heroTitle: 'वकील के बिना मृत्यु दावे निपटाएं',
    heroSubtitle: 'नाम की असंगतियां अपने आप पकड़ें, RBI 2025-26/95 का हवाला देते हुए दावा पत्र बनाएं, और किसी भी बैंक में पूरी तैयारी के साथ जाएं।',
    startFreeAudit: 'मुफ्त ऑडिट शुरू करें',
    watchDemo: 'डेमो देखें',

    // Audit Page
    documentAudit: 'दस्तावेज़ ऑडिट',
    runAIAudit: 'AI ऑडिट चलाएं →',
    analyzing: 'विश्लेषण हो रहा है...',
    readingDocs: 'दस्तावेज़ पढ़े जा रहे हैं...',
    comparingNames: 'नाम की तुलना हो रही है...',
    generatingReport: 'रिपोर्ट बन रही है...',

    // Upload
    dropDocuments: 'अपने दस्तावेज़ यहां छोड़ें या अपलोड करने के लिए क्लिक करें',
    acceptedFormats: 'PDF, JPG, PNG स्वीकृत',
    uploadLabel: 'दस्तावेज़ अपलोड करें',

    // Institution
    selectInstitution: 'संस्था चुनें',

    // Nominee
    nomineeExists: 'क्या बैंक रिकॉर्ड में नामांकित व्यक्ति है?',
    nomineeProtectionActive: 'कानूनी सुरक्षा सक्रिय',
    nomineeBannerText: 'बैंकिंग विनियमन अधिनियम 1949 की धारा 45ZA के अनुसार: बैंक उत्तराधिकार प्रमाणपत्र या क्षतिपूर्ति बांड की मांग कानूनी रूप से नहीं कर सकता।',

    // Claim Amount
    claimAmount: 'अनुमानित दावा राशि (₹)',
    simplifiedProcedure: 'RBI/2025-26/95 के तहत सरलीकृत प्रक्रिया लागू — कम दस्तावेज़ आवश्यक।',

    // Results
    auditSummary: 'ऑडिट सारांश',
    okMatches: 'ठीक मिलान',
    minorIssues: 'छोटी समस्याएं',
    criticalMismatches: 'गंभीर असंगति',

    // Contradiction Table
    nameContradictions: 'नाम विरोधाभास इंजन',
    documentPair: 'दस्तावेज़ जोड़ी',
    documentA: 'दस्तावेज़ A',
    documentB: 'दस्तावेज़ B',
    score: 'स्कोर',
    status: 'स्थिति',

    // Status Labels
    ok: 'ठीक',
    minor: 'छोटा',
    critical: 'गंभीर',

    // Missing Docs
    requiredDocuments: 'आवश्यक बनाम अपलोड किए गए दस्तावेज़',
    missingDocument: 'दस्तावेज़ गायब है',
    present: 'उपस्थित',
    missing: 'गायब — दावा अस्वीकार होगा',

    // Nominee Section
    legalProtectionActive: '🛡️ कानूनी सुरक्षा सक्रिय',
    nomineeRightsText: 'आपके पास पंजीकृत नामांकित व्यक्ति है। बैंकिंग विनियमन अधिनियम, 1949 की धारा 45ZA के अनुसार:',
    cannotDemandSuccession: '→ बैंक उत्तराधिकार प्रमाणपत्र की मांग नहीं कर सकता',
    cannotDemandIndemnity: '→ बैंक क्षतिपूर्ति बांड की मांग नहीं कर सकता',
    mustProcessPayment: '→ बैंक को नामांकित व्यक्ति को सीधे भुगतान करना होगा',

    // SLA
    settlementDeadline: 'बैंक निपटान की समयसीमा',
    slaSubtitle: 'RBI/2025-26/95: पूर्ण दस्तावेज़ीकरण के बाद 15 दिन में निपटान अनिवार्य',
    submissionDate: 'पूर्ण दस्तावेज़ जमा करने की तिथि',
    dayOf: 'दिन {{current}} / {{total}}',
    onTrack: 'समय पर',
    followUp: 'शाखा प्रबंधक से फॉलो करें',
    slaBreached: 'SLA उल्लंघन — बैंक को RBI निर्देशों के अनुसार ब्याज देना होगा',

    // Actions
    downloadPacket: 'पूर्ण पैकेट डाउनलोड करें →',
    packetLabel: 'शामिल: चेकलिस्ट + विरोधाभास रिपोर्ट + RBI/2025-26/95 का हवाला देते पत्र',
    generateAffidavit: 'पूर्व-भरा हलफनामा बनाएं →',
    copyWhatsApp: '📱 WhatsApp के लिए कॉपी करें',
    copied: 'कॉपी हो गया!',

    // Affidavit
    affidavitTitle: 'एक-नाम हलफनामा',
    copyAffidavit: 'हलफनामा टेक्स्ट कॉपी करें',
    downloadPDF: 'PDF डाउनलोड करें',
    close: 'बंद करें',

    // Demo
    demoMode: 'डेमो मोड',
    demoLoaded: 'डेमो लोड — राजेश कुमार परिदृश्य',

    // Critical/OK messages
    criticalFound: '{{n}} गंभीर असंगति{{plural}} पाई गई',
    auditPassed: 'ऑडिट पास ✅',

    // Footer
    footerTagline: 'भारत के लिए बनाया। शून्य कानूनी शुल्क। शून्य डेटा बिक्री।',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export type Translations = typeof translations.en;

export function getTranslations(lang: Language): Translations {
  return translations[lang] as Translations;
}

export function t(lang: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  const str = translations[lang][key] as string;
  if (!vars) return str;
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{{${k}}}`, String(v)), str);
}
