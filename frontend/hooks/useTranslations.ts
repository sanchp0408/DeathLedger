'use client';

import { useAuditStore } from '@/store/auditStore';
import { getTranslations, Translations } from '@/lib/translations';

export function useTranslations(): Translations {
  const language = useAuditStore((s) => s.language);
  return getTranslations(language);
}
