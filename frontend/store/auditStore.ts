'use client';

import { create } from 'zustand';
import { DEMO_AUDIT_RESULT, AuditResult } from '@/lib/demoData';
import { Language } from '@/lib/translations';

interface AuditStore {
  language: Language;
  setLanguage: (lang: Language) => void;

  institution: string;
  setInstitution: (inst: string) => void;

  nomineeExists: boolean;
  setNomineeExists: (exists: boolean) => void;

  claimAmount: number | null;
  setClaimAmount: (amount: number | null) => void;

  auditResult: AuditResult | null;
  setAuditResult: (result: AuditResult | null) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  loadingStep: string;
  setLoadingStep: (step: string) => void;

  submissionDate: Date | null;
  setSubmissionDate: (date: Date | null) => void;

  isDemoMode: boolean;

  activateDemoMode: () => void;
  reset: () => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  institution: 'SBI',
  setInstitution: (inst) => set({ institution: inst }),

  nomineeExists: false,
  setNomineeExists: (exists) => set({ nomineeExists: exists }),

  claimAmount: null,
  setClaimAmount: (amount) => set({ claimAmount: amount }),

  auditResult: null,
  setAuditResult: (result) => set({ auditResult: result }),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  loadingStep: '',
  setLoadingStep: (step) => set({ loadingStep: step }),

  submissionDate: null,
  setSubmissionDate: (date) => set({ submissionDate: date }),

  isDemoMode: false,

  activateDemoMode: () =>
    set({
      auditResult: DEMO_AUDIT_RESULT,
      institution: 'SBI',
      nomineeExists: false,
      claimAmount: 850000,
      isDemoMode: true,
      isLoading: false,
    }),

  reset: () =>
    set({
      auditResult: null,
      isLoading: false,
      claimAmount: null,
      isDemoMode: false,
      loadingStep: '',
    }),
}));
