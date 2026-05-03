'use client';

import { useState, useCallback, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useDropzone } from 'react-dropzone';
import { useAuditStore } from '@/store/auditStore';
import { useTranslations } from '@/hooks/useTranslations';
import { INSTITUTION_RULES } from '@/lib/institutionRules';
import { DEMO_AUDIT_RESULT } from '@/lib/demoData';
import ContradictionTable from './ContradictionTable';
import MissingDocAlert from './MissingDocAlert';
import NomineeRoute from './NomineeRoute';
import SLACountdown from './SLACountdown';
import AffidavitModal from './AffidavitModal';
import WhatsAppShare from './WhatsAppShare';
import { motion } from 'framer-motion';
import { maskPrivacyData } from '@/lib/formatters';
import { FileText, ShieldAlert, CheckCircle, Search, Download, Share2, FileWarning, Clock, UserCheck, Phone, Scale, AlertTriangle, FolderUp, Image as ImageIcon, Landmark, User, IndianRupee } from 'lucide-react';
import TextToSpeech from './TextToSpeech';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  id: string;
  docType: string;
  docLabel: string;
}

const INSTITUTION_COLORS: Record<string, string> = {
  SBI: '#0A3D91',
  LIC: '#8B0000',
  HDFC: '#A50034',
  ICICI: '#F47920',
};

const LOADING_STEPS = [
  'Reading documents...',
  'Comparing names...',
  'Generating report...',
];

export default function AuditorSplitScreen() {
  const t = useTranslations();
  const store = useAuditStore();
  const {
    institution, setInstitution,
    nomineeExists, setNomineeExists,
    claimAmount, setClaimAmount,
    auditResult, setAuditResult,
    isLoading, setLoading,
    setLoadingStep, loadingStep,
    submissionDate, setSubmissionDate,
  } = store;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showAffidavit, setShowAffidavit] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState<string>('death_certificate');

  // Split-pane resize state
  const [leftWidth, setLeftWidth] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault(); // prevent text selection
  };

  const onDrag = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    let newWidth = e.clientX;
    if (newWidth < 350) newWidth = 350; // min-width for left panel
    if (newWidth > window.innerWidth - 450) newWidth = window.innerWidth - 450; // max-width
    setLeftWidth(newWidth);
  }, [isDragging]);

  const stopDragging = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDragging);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onDrag, stopDragging]);

  useEffect(() => {
    const docs = INSTITUTION_RULES[institution]?.requiredDocs || [];
    if (docs.length > 0) {
      setSelectedDocType(docs[0].id);
    }
  }, [institution]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const docs = INSTITUTION_RULES[institution]?.requiredDocs || [];
    const docInfo = docs.find(d => d.id === selectedDocType) || { label: selectedDocType === 'other' ? 'Other Document' : selectedDocType };
    
    const newFiles = acceptedFiles.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      id: Math.random().toString(36).slice(2),
      docType: selectedDocType,
      docLabel: docInfo.label
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, [institution, selectedDocType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const runAudit = async () => {
    if (uploadedFiles.length === 0) {
      // Load demo if no files
      store.activateDemoMode();
      return;
    }

    setLoading(true);

    // Simulate loading steps
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(LOADING_STEPS[i]);
      await new Promise((r) => setTimeout(r, 900));
    }

    try {
      const formData = new FormData();
      uploadedFiles.forEach((f) => formData.append('documents', f.file, `${f.docType}____${f.name}`));
      formData.append('institution', institution);
      formData.append('demo_mode', 'false');

      // Try FastAPI first, fallback to Flask
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      let res;
      try {
        res = await fetch(`${apiUrl}/process-docs`, {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        res = await fetch(`http://localhost:5000/api/process`, {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        const data = await res.json();
        // Map backend response to our AuditResult shape
        setAuditResult({
          claimant: { name: 'Claimant', city: 'India', age: 0 },
          deceased: { name: data.comparisons?.[0]?.name1 || 'Deceased', dateOfDeath: '' },
          institution,
          claimAmount: claimAmount || 0,
          nomineeExists,
          extractedNames: Object.fromEntries(
            (data.extracted || []).map((e: { filename: string; names: string[] }) => [e.filename, e.names[0] || 'Unknown'])
          ),
          comparisons: (data.comparisons || []).map((c: { doc1: string; doc2: string; name1: string; name2: string; score: number; status: string }) => ({
            docA: c.doc1,
            docB: c.doc2,
            nameA: c.name1,
            nameB: c.name2,
            score: c.score,
            severity: c.status as 'OK' | 'MINOR' | 'CRITICAL',
          })),
          summary: {
            overallStatus: data.overall as 'OK' | 'MINOR' | 'CRITICAL',
            criticalCount: data.comparisons?.filter((c: { status: string }) => c.status === 'CRITICAL').length || 0,
            minorCount: data.comparisons?.filter((c: { status: string }) => c.status === 'MINOR').length || 0,
            okCount: data.comparisons?.filter((c: { status: string }) => c.status === 'OK').length || 0,
          },
          missingDocuments: data.missing_docs || [],
          regulatory: {
            simplifiedProcedure: claimAmount !== null && claimAmount < 1500000,
            nomineeProtection: nomineeExists,
            sladays: 15,
            circular: 'RBI/2025-26/95',
          },
        });
      } else {
        // Fallback to demo
        setAuditResult(DEMO_AUDIT_RESULT);
      }
    } catch {
      // Backend not available — use demo data
      setAuditResult(DEMO_AUDIT_RESULT);
    }

    setLoading(false);
    setLoadingStep('');
  };

  const downloadPacket = async () => {
    if (!auditResult) return;
    
    setLoading(true);
    setLoadingStep('Generating packet...');

    let downloaded = false;

    // 1. Try the FastAPI backend first, then fallback to Flask
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
      
      const payload = {
        institution: auditResult.institution,
        comparisons: auditResult.comparisons.map((c) => ({
          doc1: c.docA,
          doc2: c.docB,
          name1: c.nameA,
          name2: c.nameB,
          score: c.score,
          severity: c.severity,
          status: c.severity,
        })),
        missing_docs: auditResult.missingDocuments,
        claim_letter: "Please process this claim under the relevant RBI guidelines.",
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      let res;
      
      try {
        res = await fetch(`${apiUrl}/download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (err) {
        // Fallback to Flask backend GET
        res = await fetch(`http://localhost:5000/api/download`, {
          method: 'GET',
          signal: controller.signal,
        });
      }
      
      clearTimeout(timeout);

      if (res && res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DeathLedger_Claim_${auditResult.institution}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        downloaded = true;
      }
    } catch {
      // Backend not running – fall through to client-side fallback
    }

    // 2. Client-side fallback: generate a PDF summary the browser can download
    if (!downloaded) {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("DEATHLEDGER - CLAIM AUDIT REPORT", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      const lines: string[] = [
        `Institution: ${auditResult.institution}`,
        `Overall Status: ${auditResult.summary.overallStatus}`,
        `Critical Issues: ${auditResult.summary.criticalCount}`,
        `Minor Issues: ${auditResult.summary.minorCount}`,
        `Perfect Matches: ${auditResult.summary.okCount}`,
        '',
        '--- DOCUMENT COMPARISONS ---',
        ...auditResult.comparisons.map(
          (c) => `• ${c.docA} vs ${c.docB}  |  "${c.nameA}" <-> "${c.nameB}"  |  ${c.score}%  [${c.severity}]`
        ),
        '',
        '--- MISSING DOCUMENTS ---',
        ...(auditResult.missingDocuments.length > 0
          ? auditResult.missingDocuments.map((d) => `• ${d}`)
          : ['• None']),
        '',
        '--- REGULATORY ---',
        `Circular: ${auditResult.regulatory?.circular ?? 'RBI/2025-26/95'}`,
        `SLA Days: ${auditResult.regulatory?.sladays ?? 15}`,
      ];

      const splitText = doc.splitTextToSize(lines.join('\n'), pageWidth - (margin * 2));
      doc.text(splitText, margin, 35);
      
      doc.save(`DeathLedger_Claim_${auditResult.institution}.pdf`);
    }

    setLoading(false);
    setLoadingStep('');
  };

  const simplifiedProcedure = claimAmount !== null && claimAmount < 1500000;
  const hasCritical = auditResult && auditResult.summary.criticalCount > 0;

  const getSummaryText = () => {
    if (!auditResult) return '';
    const name = auditResult.claimant.name;
    const institution = auditResult.institution;
    const status = auditResult.summary.overallStatus;
    const critical = auditResult.summary.criticalCount;
    const minor = auditResult.summary.minorCount;
    const ok = auditResult.summary.okCount;
    const missingCount = auditResult.missingDocuments.length;
    
    if (store.language === 'hi') {
      let text = `${institution} में ${name} के लिए ऑडिट सारांश। समग्र स्थिति ${status} है। `;
      text += `${ok} सही मिलान, ${minor} छोटी समस्याएं, और ${critical} गंभीर असंगतियां हैं। `;
      
      if (missingCount > 0) {
        text += `${missingCount} दस्तावेज़ गायब हैं। `;
      }
      
      if (critical > 0) {
        text += "गंभीर असंगतियों को हल करने के लिए एक हलफनामे की आवश्यकता है।";
      } else {
        text += "किसी हलफनामे की आवश्यकता नहीं है। आप अपना दावा प्रस्तुत करने के लिए तैयार हैं।";
      }
      return text;
    } else {
      let text = `Audit summary for ${name} at ${institution}. The overall status is ${status}. `;
      text += `There are ${ok} perfect matches, ${minor} minor issues, and ${critical} critical mismatches. `;
      
      if (missingCount > 0) {
        text += `There are ${missingCount} missing documents. `;
      }
      
      if (critical > 0) {
        text += "An affidavit is required to resolve the critical mismatches.";
      } else {
        text += "No affidavit is needed. You are ready to submit your claim.";
      }
      return text;
    }
  };

  return (
    <>
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 68px)',
        overflow: 'hidden',
      }}>
        {/* ===== LEFT PANE ===== */}
        <div
          className="split-left"
          style={{
            width: leftWidth !== undefined ? `${leftWidth}px` : undefined,
            flex: leftWidth !== undefined ? `0 0 ${leftWidth}px` : 1,
            minWidth: '350px',
            overflowY: 'auto',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--section-gap, 32px)',
            background: 'var(--color-primary-light)',
          }}
        >
          {/* Institution Selector */}
          <div>
            <label className="label-caps" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ background: 'rgba(10, 61, 145, 0.05)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <Landmark size={14} color="var(--color-primary)" />
              </span>
              {t.selectInstitution}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '12px' }}>
              {Object.entries(INSTITUTION_RULES).map(([key, rule]) => (
                <button
                  key={key}
                  onClick={() => setInstitution(key)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    borderBottom: institution === key ? `3px solid ${INSTITUTION_COLORS[key]}` : '3px solid transparent',
                    background: institution === key ? `linear-gradient(to bottom, white, ${INSTITUTION_COLORS[key]}15)` : 'white',
                    color: institution === key ? INSTITUTION_COLORS[key] : 'var(--color-text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
            {institution && (
              <div className="badge-tint" style={{ marginTop: '12px', fontSize: '11px', gap: '6px' }}>
                {INSTITUTION_RULES[institution].name} • SLA: {INSTITUTION_RULES[institution].sladays} days • <Phone size={12} /> {INSTITUTION_RULES[institution].contact}
              </div>
            )}
          </div>

          {/* Nominee Toggle */}
          <div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: nomineeExists ? '16px' : '0' }}>
                <label style={{ fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'rgba(10, 61, 145, 0.05)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                    <User size={16} color="var(--color-primary)" />
                  </span>
                  {t.nomineeExists}
                </label>
                <button
                  className={`toggle-track ${nomineeExists ? 'active' : ''}`}
                  onClick={() => setNomineeExists(!nomineeExists)}
                  role="switch"
                  aria-checked={nomineeExists}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>

              {nomineeExists && (
                <div className="banner-info" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong><Scale size={14} /> Section 45ZA:</strong> {t.nomineeBannerText}
                </div>
              )}
            </div>
          </div>

          {/* Claim Amount */}
          <div>
            <div className="card" style={{ padding: '20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <label className="label-caps" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(10, 61, 145, 0.05)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                  <IndianRupee size={14} color="var(--color-primary)" />
                </span>
                {t.claimAmount}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                }}>₹</span>
                <input
                  type="number"
                  className="input"
                  style={{ paddingLeft: '28px', width: '100%', background: 'white' }}
                  placeholder="e.g. 850000"
                  value={claimAmount ?? ''}
                  onChange={(e) => setClaimAmount(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              {simplifiedProcedure && (
                <div className="banner-success" style={{ marginTop: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> {t.simplifiedProcedure}
                </div>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div>
            <label className="label-caps" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ background: 'rgba(10, 61, 145, 0.05)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <FileText size={14} color="var(--color-primary)" />
              </span>
              {t.uploadLabel}
            </label>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
                Select Document Type:
              </label>
              <select 
                className="input" 
                value={selectedDocType} 
                onChange={(e) => setSelectedDocType(e.target.value)}
                style={{ width: '100%', padding: '10px', appearance: 'auto' }}
              >
                {(INSTITUTION_RULES[institution]?.requiredDocs || []).map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.label}</option>
                ))}
                <option value="other">Other Supporting Document</option>
              </select>
            </div>
            <div
              {...getRootProps()}
              className={`drop-zone ${isDragActive ? 'active' : ''}`}
              style={{ 
                padding: 'clamp(24px, 4vw, 36px) 24px',
                marginBottom: uploadedFiles.length > 0 ? '16px' : '0',
                background: isDragActive ? 'var(--color-primary-light)' : 'white'
              }}
            >
              <input {...getInputProps()} />
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><FolderUp size={36} className="text-primary" /></div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                {isDragActive ? 'Drop files here...' : t.dropDocuments}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {t.acceptedFormats} • Death Certificate, Aadhaar, PAN, Passbook, etc.
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {uploadedFiles.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                      {f.name.endsWith('.pdf') ? <FileText size={18} /> : <ImageIcon size={18} />}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.docLabel}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {f.name} • {(f.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(f.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px 24px',
              fontSize: '15px',
            }}
            onClick={runAudit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                {loadingStep || t.analyzing}
              </>
            ) : (
              t.runAIAudit
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* ===== RESIZE GUTTER ===== */}
        <div
          onMouseDown={startDragging}
          style={{
            width: '6px',
            cursor: 'col-resize',
            background: isDragging ? 'var(--color-primary)' : 'transparent',
            borderRight: '1px solid var(--color-border)',
            flexShrink: 0,
            transition: 'background 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            if (!isDragging) e.currentTarget.style.background = 'rgba(10, 61, 145, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isDragging) e.currentTarget.style.background = 'transparent';
          }}
        />

        {/* ===== RIGHT PANE ===== */}
        <div
          className="split-right"
          style={{
            flex: 1,
            minWidth: '450px',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            background: 'var(--color-surface)',
          }}
        >
          {!auditResult && !isLoading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              gap: '16px',
            }}>
              <div style={{ fontSize: '48px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                <Search size={48} strokeWidth={1} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Audit results will appear here
                </h3>
                <p style={{ fontSize: '14px', maxWidth: '320px' }}>
                  Upload your documents and click &quot;Run AI Audit&quot;, or press the Demo Mode button to see a sample report.
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: '20px',
            }}>
              <div style={{
                width: '56px', height: '56px',
                border: '4px solid var(--color-primary-light)',
                borderTop: '4px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  {loadingStep}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Powered by DeathLedger AI
                </div>
              </div>
            </div>
          )}

          {auditResult && !isLoading && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Section A: Summary Header */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className={`card ${auditResult.summary.overallStatus === 'CRITICAL' ? 'animate-pulse-ring' : ''}`} style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div className="label-caps">{t.auditSummary}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', margin: 0 }}>
                        {auditResult.claimant.name} — {auditResult.institution}
                      </h3>
                      <TextToSpeech text={getSummaryText()} lang={store.language} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    background: auditResult.summary.overallStatus === 'CRITICAL' ? 'var(--color-critical-bg)' : auditResult.summary.overallStatus === 'MINOR' ? 'var(--color-minor-bg)' : 'var(--color-ok-bg)',
                    color: auditResult.summary.overallStatus === 'CRITICAL' ? 'var(--color-critical)' : auditResult.summary.overallStatus === 'MINOR' ? 'var(--color-minor)' : 'var(--color-ok)',
                    border: `1px solid ${auditResult.summary.overallStatus === 'CRITICAL' ? 'var(--color-critical)' : auditResult.summary.overallStatus === 'MINOR' ? 'var(--color-minor)' : 'var(--color-ok)'}`,
                  }}>
                    {auditResult.summary.overallStatus}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { label: t.okMatches, count: auditResult.summary.okCount, color: 'var(--color-ok)', bg: 'var(--color-ok-bg)' },
                    { label: t.minorIssues, count: auditResult.summary.minorCount, color: 'var(--color-minor)', bg: 'var(--color-minor-bg)' },
                    { label: t.criticalMismatches, count: auditResult.summary.criticalCount, color: 'var(--color-critical)', bg: 'var(--color-critical-bg)' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: stat.bg,
                        border: `1px solid ${stat.color}30`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-display)' }}>
                        {stat.count}
                      </div>
                      <div style={{ fontSize: '11px', color: stat.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Regulatory Flags */}
              {(auditResult.regulatory.simplifiedProcedure || auditResult.regulatory.nomineeProtection) && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {auditResult.regulatory.simplifiedProcedure && (
                    <div className="banner-success" style={{ flex: 1, minWidth: '200px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong><CheckCircle size={14} /> Simplified Procedure:</strong> Claim &lt; ₹15L — cite RBI/2025-26/95 Annex I-B for reduced paperwork.
                    </div>
                  )}
                  {auditResult.regulatory.nomineeProtection && (
                    <div className="banner-info" style={{ flex: 1, minWidth: '200px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={14} /> <strong>Nominee Protection:</strong> Sec 45ZA applies — no Succession Certificate required.
                    </div>
                  )}
                </div>
              )}

              {/* Section AI: Extracted Fields */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} /> AI Extracted Evidence
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(auditResult.extractedNames).map(([doc, name]) => (
                    <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{doc}</span>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{maskPrivacyData(doc.toLowerCase().includes('aadhaar') ? 'aadhaar' : doc.toLowerCase().includes('pan') ? 'pan' : 'none' as any, name)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Section B: Contradiction Table */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '20px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '17px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Search size={18} /> {t.nameContradictions}
                </h4>
                <ContradictionTable comparisons={auditResult.comparisons} />
              </motion.div>

              {/* Section C: Missing Documents */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileWarning size={18} /> {t.requiredDocuments}
                </h4>
                <MissingDocAlert
                  institution={auditResult.institution}
                  uploadedDocIds={
                    uploadedFiles.length > 0
                      ? uploadedFiles.map((f) => f.docType)
                      : (INSTITUTION_RULES[auditResult.institution]?.requiredDocs || [])
                          .map((d) => d.id)
                          .filter((id) => !auditResult.missingDocuments.includes(id))
                  }
                />
                {auditResult.missingDocuments.length > 0 && (
                  <div className="banner-critical" style={{ marginTop: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> <strong>Also flagged:</strong> {auditResult.missingDocuments.join(', ')}
                  </div>
                )}
              </motion.div>

              {/* Section D: Nominee Route Intelligence */}
              {auditResult.nomineeExists && (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '20px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} /> Nominee Protection
                  </h4>
                  <NomineeRoute nomineeExists={auditResult.nomineeExists} />
                </motion.div>
              )}

              {/* Section E: SLA Countdown */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} /> {t.settlementDeadline}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  {t.slaSubtitle}
                </p>
                <SLACountdown
                  submissionDate={submissionDate}
                  onDateChange={setSubmissionDate}
                  totalDays={INSTITUTION_RULES[auditResult.institution]?.sladays || 15}
                />
              </motion.div>

              {/* Section F: Actions */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Download Packet */}
                <div className="card" style={{ padding: '16px' }}>
                  <div className="label-caps" style={{ marginBottom: '6px' }}>Claim Packet</div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    {t.packetLabel}
                  </p>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={downloadPacket}
                  >
                    <Download size={14} /> {t.downloadPacket}
                  </button>
                </div>

                {/* Affidavit */}
                {hasCritical ? (
                  <div className="card" style={{ padding: '16px', border: '1.5px solid var(--color-critical)' }}>
                    <div className="label-caps" style={{ marginBottom: '6px', color: 'var(--color-critical)' }}>
                      Critical Action Required
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      {auditResult.summary.criticalCount} name mismatch{auditResult.summary.criticalCount > 1 ? 'es' : ''} need an affidavit for resolution.
                    </p>
                    <button
                      className="btn-destructive"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
                      onClick={() => setShowAffidavit(true)}
                    >
                      {t.generateAffidavit}
                    </button>
                  </div>
                ) : (
                  <div className="card" style={{ padding: '16px', border: '1.5px solid var(--color-ok)' }}>
                    <div className="label-caps" style={{ marginBottom: '6px', color: 'var(--color-ok)' }}>
                      No Affidavit Needed
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      All name comparisons passed. You are ready to submit your claim!
                    </p>
                  </div>
                )}
              </motion.div>

              {/* WhatsApp Share */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="card" style={{ padding: '16px' }}>
                <div className="label-caps" style={{ marginBottom: '6px' }}>Share Summary</div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  Copy a formatted summary to share via WhatsApp with family members or advisors.
                </p>
                <WhatsAppShare audit={auditResult} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Affidavit Modal */}
      {showAffidavit && auditResult && (
        <AffidavitModal audit={auditResult} onClose={() => setShowAffidavit(false)} />
      )}
    </>
  );
}
