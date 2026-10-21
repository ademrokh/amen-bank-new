'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, FileText, Mail, MailPlus, Send, BookOpen, AlertTriangle, Loader2, MapPin, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

type Language = 'fr' | 'ar' | 'en';

interface AccessInfoDocument {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  category: string;
  file_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  is_published: boolean;
  display_order: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AccessInformationContentProps {
  lang: Language;
}

const categoryMeta: Record<string, { fr: string; en: string; ar: string }> = {
  rapport_financier: { fr: 'Rapports financiers', en: 'Financial reports', ar: 'التقارير المالية' },
  statuts: { fr: 'Statuts', en: 'Constitution / statutes', ar: 'النظام الأساسي' },
  gouvernance: { fr: 'Gouvernance', en: 'Governance', ar: 'الحوكمة' },
  commissaire_comptes: { fr: 'Rapports du commissaire aux comptes', en: 'Auditor reports', ar: 'تقارير مراجع الحسابات' },
  guide: { fr: 'Guides', en: 'Guides', ar: 'الأدلة' },
};

const contactMethods = [
  { key: 'inPerson', icon: BookOpen, labelFr: 'En personne', labelEn: 'In person', labelAr: 'شخصيًا', value: '[À COMPLÉTER PAR LA CONFORMITÉ]' },
  { key: 'mail', icon: Mail, labelFr: 'Courrier recommandé', labelEn: 'Registered mail', labelAr: 'البريد المسجل', value: '[À COMPLÉTER PAR LA CONFORMITÉ]' },
  { key: 'fax', icon: Send, labelFr: 'Fax', labelEn: 'Fax', labelAr: 'الفاكس', value: '[À COMPLÉTER PAR LA CONFORMITÉ]' },
  { key: 'email', icon: MailPlus, labelFr: 'Email', labelEn: 'Email', labelAr: 'البريد الإلكتروني', value: '[À COMPLÉTER PAR LA CONFORMITÉ]' },
];

function getLocalizedTitle(document: AccessInfoDocument, lang: Language): string {
  if (lang === 'fr') return document.title_fr;
  if (lang === 'ar') return document.title_ar;
  return document.title_en;
}

function getLocalizedCategoryName(category: string, lang: Language): string {
  const match = categoryMeta[category];
  if (!match) return category;
  return match[lang];
}

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(dateValue: string | null, lang: Language): string {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-TN' : lang === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'medium',
  }).format(date);
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase configuration is missing.');
  }
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

type DocumentTypeFilter = 'all' | 'indicators' | 'financial' | 'other';

function inferDocumentType(document: AccessInfoDocument): Exclude<DocumentTypeFilter, 'all'> {
  const haystack = `${document.file_path ?? ''} ${document.title_fr ?? ''} ${document.title_en ?? ''} ${document.title_ar ?? ''}`.toLowerCase();
  if (/(indicateur|indic|trimestriel|trim|quarter|quarterly)/.test(haystack)) {
    return 'indicators';
  }
  if (/(etat|financier|finance|consolide|individuel|intermediaire|compte)/.test(haystack)) {
    return 'financial';
  }
  return 'other';
}

function parseDocumentDate(document: AccessInfoDocument) {
  const source = `${document.file_path ?? ''} ${document.published_at ?? ''}`;
  const timestampMatch = source.match(/(\d{8})/);
  const trimMatch = source.match(/(\d)trim(\d{2})/i);

  let year: number | null = null;
  let month: number | null = null;

  if (trimMatch) {
    const trimmedYear = Number(trimMatch[2]);
    year = trimmedYear < 100 ? 2000 + trimmedYear : trimmedYear;
    month = Number(trimMatch[1]) * 3;
  } else if (timestampMatch) {
    const parsedYear = Number(timestampMatch[1].slice(0, 4));
    const parsedMonth = Number(timestampMatch[1].slice(4, 6));
    year = parsedYear;
    month = parsedMonth;
  } else if (document.published_at) {
    const parsedDate = new Date(document.published_at);
    if (!Number.isNaN(parsedDate.getTime())) {
      year = parsedDate.getUTCFullYear();
      month = parsedDate.getUTCMonth() + 1;
    }
  }

  const quarter = month ? Math.ceil(month / 3) : null;
  const semester = month ? (month <= 6 ? 1 : 2) : null;
  const monthKey = year && month ? `${year}-${String(month).padStart(2, '0')}` : null;
  const semesterKey = year && semester ? `${year}-H${semester}` : null;
  const yearKey = year ? `${year}` : null;

  return { year, month, quarter, semester, monthKey, semesterKey, yearKey };
}

export default function AccessInformationContent({ lang }: AccessInformationContentProps) {
  const [documents, setDocuments] = useState<AccessInfoDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<DocumentTypeFilter>('all');
  const [selectedDateValue, setSelectedDateValue] = useState('all');
  const isRTL = lang === 'ar';

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('info_access_documents')
          .select('*')
          .eq('is_published', true)
          .order('category', { ascending: true })
          .order('display_order', { ascending: true });

        if (!isMounted) return;

        if (error) {
          throw error;
        }

        setDocuments((data ?? []) as AccessInfoDocument[]);
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : 'Unable to load the documents.';
        console.error('Failed to load access information documents', error);
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const dateOptions = useMemo(() => {
    const typeDocuments = activeType === 'all'
      ? documents
      : documents.filter((document) => inferDocumentType(document) === activeType);

    if (activeType === 'indicators') {
      const semesters = Array.from(new Set(typeDocuments.map((document) => parseDocumentDate(document).semesterKey).filter(Boolean))) as string[];
      return semesters
        .sort((left, right) => right.localeCompare(left))
        .map((value) => ({ value, label: value.replace('-', ' ') }));
    }

    if (activeType === 'financial') {
      const years = Array.from(new Set(typeDocuments.map((document) => parseDocumentDate(document).yearKey).filter(Boolean))) as string[];
      return years
        .sort((left, right) => Number(right) - Number(left))
        .map((value) => ({ value, label: value }));
    }

    const months = Array.from(new Set(typeDocuments.map((document) => parseDocumentDate(document).monthKey).filter(Boolean))) as string[];
    return months
      .sort((left, right) => right.localeCompare(left))
      .map((value) => ({ value, label: value.replace('-', ' / ') }));
  }, [activeType, documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesType = activeType === 'all' || inferDocumentType(document) === activeType;
      if (!matchesType) {
        return false;
      }

      if (selectedDateValue === 'all') {
        return true;
      }

      const parsedDate = parseDocumentDate(document);
      if (activeType === 'indicators') {
        return parsedDate.semesterKey === selectedDateValue;
      }

      if (activeType === 'financial') {
        return parsedDate.yearKey === selectedDateValue;
      }

      return parsedDate.monthKey === selectedDateValue;
    });
  }, [activeType, documents, selectedDateValue]);

  const groupedFilteredDocuments = useMemo(() => {
    return filteredDocuments.reduce<Record<string, AccessInfoDocument[]>>((accumulator, document) => {
      const type = inferDocumentType(document);
      if (!accumulator[type]) {
        accumulator[type] = [];
      }
      accumulator[type].push(document);
      return accumulator;
    }, {});
  }, [filteredDocuments]);

  const content = {
    fr: {
      title: 'Accès à l\'information',
      intro: 'Le droit d\'accès à l\'information permet à toute personne de consulter ou d\'obtenir des documents publics, dans le cadre de la loi tunisienne et de la transparence attendue des institutions publiques.',
      legal: 'Référence légale : Loi organique n° 2016-22 du 24 mars 2016.',
      officerTitle: 'Chargé d\'accès à l\'information',
      officerName: '[À COMPLÉTER PAR LA CONFORMITÉ]',
      officerRole: '[À COMPLÉTER PAR LA CONFORMITÉ]',
      officerDescription: 'Les demandes peuvent être adressées selon les canaux ci-dessous.',
      requestTitle: 'Procédure de demande',
      requestNote: 'Aucune justification n\'est requise pour déposer une demande d\'accès à l\'information.',
      steps: [
        'Présenter une demande écrite auprès de l\'établissement.',
        'Recevoir un accusé de réception ou un récépissé.',
        'Obtenir une réponse dans le délai prévu par la loi.',
        'Être informé, le cas échéant, des coûts liés à la reproduction.',
        'Recevoir le document demandé ou le motif du refus.',
      ],
      documentsTitle: 'Documents publiés',
      documentsIntro: 'Les documents ci-dessous sont mis à disposition de façon proactive.',
      loadingState: 'Chargement des documents...',
      downloadLabel: 'Ouvrir le document',
      emptyState: 'Aucun document disponible pour le moment.',
      errorState: 'Impossible de charger les documents pour le moment.',
      appealTitle: 'Voies de recours',
      appealText: 'En cas de refus, une réclamation interne peut être adressée à la direction générale, puis un recours externe peut être introduit auprès de l\'INAI.',
      inaiContactTitle: 'Coordonnées de l\'INAI',
      inaiAddress: 'N°8 Rue Ahmed Gharbi - Cité Mahrajène – Tunis Belvédère 1082',
      inaiPhones: ['(+216) 70 241 990', '(+216) 70 241 996', '(+216) 71 781 437'],
      inaiEmail: 'contact@inai.tn',
      categoryLabel: 'Catégorie',
      fileSizeLabel: 'Taille',
      publishedLabel: 'Publié le',
      filterLabel: 'Filtrer par date de publication',
      allDocuments: 'Tous les documents',
      quarterlyIndicators: 'Indicateurs trimestriels',
      financialStatements: 'États financiers',
      otherDocuments: 'Autres documents',
      allPeriods: 'Toutes les périodes',
      allYears: 'Toutes les années',
      allMonths: 'Tous les mois',
      resultsSummaryZero: 'Aucun document affiché',
      resultsSummaryOne: '1 document affiché',
      resultsSummaryMany: '{{count}} documents affichés',
    },
    en: {
      title: 'Access to Information',
      intro: 'The right to access information enables any person to consult or obtain public documents, in line with Tunisian law and the transparency expected of public institutions.',
      legal: 'Legal reference: Organic Law No. 2016-22 of 24 March 2016.',
      officerTitle: 'Access to information officer',
      officerName: '[TO BE COMPLETED BY COMPLIANCE]',
      officerRole: '[TO BE COMPLETED BY COMPLIANCE]',
      officerDescription: 'Requests may be submitted through the channels below.',
      requestTitle: 'Request procedure',
      requestNote: 'No justification is required to submit a request for access to information.',
      steps: [
        'Submit a written request to the institution.',
        'Receive an acknowledgment or receipt.',
        'Receive a response within the legal timeframe.',
        'Be notified of any reproduction costs, if applicable.',
        'Receive the requested document or the reason for refusal.',
      ],
      documentsTitle: 'Published documents',
      documentsIntro: 'The documents below are published proactively.',
      loadingState: 'Loading documents...',
      downloadLabel: 'Open document',
      emptyState: 'No documents are available at the moment.',
      errorState: 'The documents could not be loaded at the moment.',
      appealTitle: 'Appeal process',
      appealText: 'If a request is refused, an internal complaint may be submitted to the General Directorate, followed by an external appeal to INAI.',
      inaiContactTitle: 'INAI Contact Information',
      inaiAddress: 'No. 8 Ahmed Gharbi Street - Mahrajène District – Tunis Belvédère 1082',
      inaiPhones: ['(+216) 70 241 990', '(+216) 70 241 996', '(+216) 71 781 437'],
      inaiEmail: 'contact@inai.tn',
      categoryLabel: 'Category',
      fileSizeLabel: 'Size',
      publishedLabel: 'Published on',
      filterLabel: 'Filter by publication date',
      allDocuments: 'All documents',
      quarterlyIndicators: 'Quarterly indicators',
      financialStatements: 'Financial statements',
      otherDocuments: 'Other documents',
      allPeriods: 'All periods',
      allYears: 'All years',
      allMonths: 'All months',
      resultsSummaryZero: 'No documents shown',
      resultsSummaryOne: '1 document shown',
      resultsSummaryMany: '{{count}} documents shown',
    },
    ar: {
      title: 'الوصول إلى المعلومات',
      intro: 'يمنح الحق في الوصول إلى المعلومات أي شخص القدرة على الاطلاع على الوثائق العامة أو الحصول عليها، بما يتوافق مع القانون التونسي وشفافية المؤسسات العامة.',
      legal: 'المرجع القانوني: القانون العضوي رقم 2016-22 المؤرخ في 24 مارس 2016.',
      officerTitle: 'المسؤول المعني بالوصول إلى المعلومات',
      officerName: '[لإكماله من قبل إدارة الامتثال]',
      officerRole: '[لإكماله من قبل إدارة الامتثال]',
      officerDescription: 'يمكن تقديم الطلبات عبر القنوات أدناه.',
      requestTitle: 'إجراءات الطلب',
      requestNote: 'لا يلزم تقديم أي مبرر لتقديم طلب الوصول إلى المعلومات.',
      steps: [
        'تقديم طلب كتابي إلى المؤسسة.',
        'استلام إشعار أو إيصال.',
        'الحصول على رد خلال المدة القانونية.',
        'الإفادة، عند الاقتضاء، بالتكاليف المتعلقة بالنسخ.',
        'الحصول على الوثيقة المطلوبة أو سبب الرفض.',
      ],
      documentsTitle: 'الوثائق المنشورة',
      documentsIntro: 'يتم نشر الوثائق أدناه بشكل استباقي.',
      loadingState: 'جارٍ تحميل الوثائق...',
      downloadLabel: 'فتح الوثيقة',
      emptyState: 'لا توجد وثائق متاحة حاليًا.',
      errorState: 'تعذر تحميل الوثائق مؤخرًا.',
      appealTitle: 'سبل الطعن',
      appealText: 'في حال الرفض، يمكن تقديم شكوى داخلية إلى المدير العام ثم طعن خارجي لدى المعهد الوطني للوصول إلى المعلومات.',
      inaiContactTitle: 'معلومات الاتصال بالمعهد الوطني',
      inaiAddress: 'الرقم 8، شارع أحمد غرابي - حي المهراجين – تونس البلفيدير 1082',
      inaiPhones: ['(+216) 70 241 990', '(+216) 70 241 996', '(+216) 71 781 437'],
      inaiEmail: 'contact@inai.tn',
      categoryLabel: 'الفئة',
      fileSizeLabel: 'الحجم',
      publishedLabel: 'نُشرت في',
      filterLabel: 'تصفية حسب تاريخ النشر',
      allDocuments: 'كل الوثائق',
      quarterlyIndicators: 'المؤشرات الفصلية',
      financialStatements: 'البيانات المالية',
      otherDocuments: 'وثائق أخرى',
      allPeriods: 'كل الفترات',
      allYears: 'كل السنوات',
      allMonths: 'كل الأشهر',
      resultsSummaryZero: 'لا توجد وثائق معروضة',
      resultsSummaryOne: 'تم عرض مستند واحد',
      resultsSummaryMany: 'تم عرض {{count}} مستند',
    },
  };

  const copy = content[lang];

  const getResultsSummary = () => {
    const count = filteredDocuments.length;
    if (count === 0) return copy.resultsSummaryZero;
    if (count === 1) return copy.resultsSummaryOne;
    return copy.resultsSummaryMany.replace('{{count}}', String(count));
  };

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: '#0f172a', padding: '96px 24px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <span className="page-hero-badge">{copy.legal}</span>
          <h1 className="text-h1" style={{ marginTop: '32px', marginBottom: '24px', color: '#fff' }}>{copy.title}</h1>
          <p style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '768px', color: '#94a3b8' }}>
            {copy.intro}
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ background: '#f8fafc', padding: '80px 24px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
          
          {/* Hidden until later notice */}
          <div style={{ display: 'none' }}>
            <div style={{ display: 'grid', gap: '48px' }}>
              <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h2 className="text-h3 text-ink">{copy.officerTitle}</h2>
                <p style={{ marginTop: '24px', marginBottom: '40px', fontSize: '14px', color: '#64748b' }}>{copy.officerDescription}</p>
                <div style={{ borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '24px' }}>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>{copy.officerName}</p>
                  <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>{copy.officerRole}</p>
                </div>
                <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {contactMethods.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} style={{ display: 'flex', gap: '20px', border: '1px solid #e2e8f0', background: '#fff', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ marginTop: '4px', background: 'rgba(0, 61, 165, 0.1)', padding: '10px', borderRadius: '999px', color: '#003DA5' }}>
                          <Icon style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, color: '#0f172a' }}>
                            {lang === 'fr' ? item.labelFr : lang === 'ar' ? item.labelAr : item.labelEn}
                          </p>
                          <p style={{ marginTop: '4px', fontSize: '14px', color: '#64748b' }}>{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 className="text-h3 text-ink">{copy.documentsTitle}</h2>
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>{copy.documentsIntro}</p>

            <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px', paddingBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
              {[
                { value: 'all', label: copy.allDocuments },
                { value: 'indicators', label: copy.quarterlyIndicators },
                { value: 'financial', label: copy.financialStatements },
                { value: 'other', label: copy.otherDocuments },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setActiveType(option.value as DocumentTypeFilter);
                    setSelectedDateValue('all');
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeType === option.value ? '#003DA5' : '#f1f5f9',
                    color: activeType === option.value ? '#fff' : '#475569',
                    transition: 'background 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>
                {copy.filterLabel}
              </label>
              <select
                value={selectedDateValue}
                onChange={(event) => setSelectedDateValue(event.target.value)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: '#334155',
                  outline: 'none',
                  width: '256px'
                }}
              >
                <option value="all">
                  {activeType === 'indicators' ? copy.allPeriods : activeType === 'financial' ? copy.allYears : copy.allMonths}
                </option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {!isLoading && !errorMessage && (
              <p style={{ marginTop: '24px', fontSize: '14px', fontWeight: 500, color: '#64748b' }}>
                {getResultsSummary()}
              </p>
            )}

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '32px', borderRadius: '16px', color: '#64748b' }} aria-live="polite">
                  <Loader2 style={{ width: '20px', height: '20px', color: '#003DA5', animation: 'spin 1s linear infinite' }} aria-hidden="true" />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{copy.loadingState}</span>
                </div>
              ) : errorMessage ? (
                <div style={{ display: 'flex', gap: '16px', border: '1px solid #fde68a', background: '#fffbeb', padding: '32px', borderRadius: '16px', color: '#92400e' }} role="alert">
                  <AlertTriangle style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '16px' }}>{copy.errorState}</p>
                    <p style={{ marginTop: '8px', fontSize: '14px' }}>{errorMessage}</p>
                  </div>
                </div>
              ) : Object.keys(groupedFilteredDocuments).length === 0 ? (
                <div style={{ border: '1px dashed #e2e8f0', background: '#f8fafc', padding: '48px', borderRadius: '16px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                  {copy.emptyState}
                </div>
              ) : (
                Object.entries(groupedFilteredDocuments).map(([type, items]) => (
                  <div key={type}>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                        {type === 'indicators' ? copy.quarterlyIndicators : type === 'financial' ? copy.financialStatements : copy.otherDocuments}
                      </h3>
                      <span style={{ borderRadius: '999px', background: 'rgba(0, 61, 165, 0.1)', padding: '4px 12px', fontSize: '14px', fontWeight: 500, color: '#003DA5' }}>
                        {items.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {items.map((document) => (
                        <div key={document.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '999px', color: '#003DA5', border: '1px solid #e2e8f0' }}>
                              <FileText style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: '#0f172a' }}>{getLocalizedTitle(document, lang)}</p>
                              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '14px', color: '#64748b' }}>
                                <span>{copy.categoryLabel}: <span style={{ fontWeight: 500, color: '#475569' }}>{getLocalizedCategoryName(document.category, lang)}</span></span>
                                <span>{copy.fileSizeLabel}: <span style={{ fontWeight: 500, color: '#475569' }}>{formatBytes(document.file_size_bytes)}</span></span>
                                <span>{copy.publishedLabel}: <span style={{ fontWeight: 500, color: '#475569' }}>{formatDate(document.published_at, lang)}</span></span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${document.file_path.split('/').map(encodeURIComponent).join('/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '999px', background: '#0f172a', padding: '10px 20px', fontSize: '14px', fontWeight: 500, color: '#fff', textDecoration: 'none', flexShrink: 0 }}
                            aria-label={`${copy.downloadLabel}: ${getLocalizedTitle(document, lang)}`}
                          >
                            <ExternalLink style={{ width: '16px', height: '16px' }} aria-hidden="true" />
                            {copy.downloadLabel}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Voies de recours */}
          <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 className="text-h3 text-ink" style={{ marginBottom: '20px' }}>{copy.appealTitle}</h2>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '768px' }}>{copy.appealText}</p>

            <div style={{ marginTop: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '32px', position: 'sticky', top: '24px' }}>
              <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a' }}>{copy.inaiContactTitle}</h3>
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', minWidth: '40px', background: 'rgba(0, 61, 165, 0.1)', padding: '10px', borderRadius: '999px', color: '#003DA5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                  </div>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Rue Ahmed Gharbi, Tunis')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', color: '#003DA5', textDecoration: 'none' }}
                    aria-label={`Get directions to ${copy.inaiAddress}`}
                  >
                    {copy.inaiAddress}
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', minWidth: '40px', background: 'rgba(0, 61, 165, 0.1)', borderRadius: '999px', color: '#003DA5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {copy.inaiPhones.map((phone, index) => (
                      <a key={index} href={`tel:${phone.replace(/\s/g, '')}`} style={{ fontSize: '14px', color: '#003DA5', textDecoration: 'none' }}>
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', minWidth: '40px', background: 'rgba(0, 61, 165, 0.1)', borderRadius: '999px', color: '#003DA5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                  </div>
                  <a href={`mailto:${copy.inaiEmail}`} style={{ fontSize: '14px', color: '#003DA5', textDecoration: 'none' }}>
                    {copy.inaiEmail}
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}