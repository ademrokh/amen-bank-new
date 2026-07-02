'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, FileText, Mail, MailPlus, Send, BookOpen, AlertTriangle, Loader2 } from 'lucide-react';
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
      resultsSummary: '{{count}} document(s) affiché(s)',
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
      resultsSummary: '{{count}} document(s) shown',
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
      resultsSummary: 'تم عرض {{count}} مستند',
    },
  };

  const copy = content[lang];

  return (
    <section className="section-lg" style={{ background: '#0f172a' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container max-w-6xl">
        <div className="section-header max-w-3xl text-left">
          <span className="section-badge section-badge-light">{copy.legal}</span>
          <h1 className="text-h1 mt-3 mb-4 text-white">{copy.title}</h1>
          <p className="text-lg leading-relaxed" style={{ color: '#94a3b8' }}>{copy.intro}</p>
        </div>

        <div className="mt-12 space-y-24">
          {/* Hidden until later notice */}
          <div style={{ display: 'none' }}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="card p-10">
                <h2 className="text-h3 text-ink">{copy.officerTitle}</h2>
                <p className="mt-5 mb-8 text-small leading-relaxed" style={{ color: '#64748b' }}>{copy.officerDescription}</p>
                <div className="rounded-2xl border border-border bg-slate-50 p-6">
                  <p className="font-semibold" style={{ color: '#0f172a' }}>{copy.officerName}</p>
                  <p className="mt-1 text-small" style={{ color: '#64748b' }}>{copy.officerRole}</p>
                </div>
                <div className="mt-8 space-y-4">
                  {contactMethods.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                        <div className="mt-0.5 rounded-full bg-primary-subtle p-2 text-primary">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#0f172a' }}>
                            {lang === 'fr' ? item.labelFr : lang === 'ar' ? item.labelAr : item.labelEn}
                          </p>
                          <p className="text-sm" style={{ color: '#64748b' }}>{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card p-10">
                <h2 className="text-h3 text-ink">{copy.requestTitle}</h2>
                <ol className="mt-6 space-y-4 text-small leading-relaxed">
                  {copy.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span style={{ color: '#64748b' }}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 rounded-2xl border border-dashed border-border bg-slate-50 p-5 text-sm" style={{ color: '#64748b' }}>
                  {copy.requestNote}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="card p-10 lg:p-12">
            <h2 className="text-h3 text-ink">{copy.documentsTitle}</h2>
            <p className="mt-4 text-small leading-relaxed" style={{ color: '#64748b' }}>{copy.documentsIntro}</p>

            <div className="mt-8 flex flex-wrap gap-3 pb-8 border-b border-border">
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
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    activeType === option.value
                      ? 'bg-ink text-white shadow-sm'
                      : 'border-2 border-ink bg-white text-ink hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium" style={{ color: '#0f172a' }}>{copy.filterLabel}</label>
              <select
                value={selectedDateValue}
                onChange={(event) => setSelectedDateValue(event.target.value)}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm"
              >
                <option value="all">
                  {activeType === 'indicators' ? copy.allPeriods : activeType === 'financial' ? copy.allYears : copy.allMonths}
                </option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <p className="mt-6 text-sm" style={{ color: '#64748b' }}>{copy.resultsSummary.replace('{{count}}', String(filteredDocuments.length))}</p>

            <div className="mt-12 space-y-8">
              {isLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-slate-50 p-5" style={{ color: '#64748b' }} aria-live="polite">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>{copy.documentsIntro}</span>
                </div>
              ) : errorMessage ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800" role="alert">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{copy.errorState}</p>
                    <p className="mt-1 text-sm">{errorMessage}</p>
                  </div>
                </div>
              ) : Object.keys(groupedFilteredDocuments).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-8 text-center" style={{ color: '#64748b' }}>
                  {copy.emptyState}
                </div>
              ) : (
                Object.entries(groupedFilteredDocuments).map(([type, items]) => (
                  <div key={type}>
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
                        {type === 'indicators' ? copy.quarterlyIndicators : type === 'financial' ? copy.financialStatements : copy.otherDocuments}
                      </h3>
                      <span className="rounded-full bg-primary-subtle px-3 py-1 text-sm font-medium text-primary">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {items.map((document) => (
                        <div key={document.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-white p-2 text-primary shadow-sm">
                              <FileText className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: '#0f172a' }}>{getLocalizedTitle(document, lang)}</p>
                              <div className="mt-3 flex flex-wrap gap-3 text-sm" style={{ color: '#64748b' }}>
                                <span>{copy.categoryLabel}: {getLocalizedCategoryName(document.category, lang)}</span>
                                <span>{copy.fileSizeLabel}: {formatBytes(document.file_size_bytes)}</span>
                                <span>{copy.publishedLabel}: {formatDate(document.published_at, lang)}</span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/access-info-documents/${encodeURIComponent(document.file_path)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium transition hover:bg-primary"
                            style={{ color: '#ffffff', textDecoration: 'none' }}
                            aria-label={`${copy.downloadLabel}: ${getLocalizedTitle(document, lang)}`}
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
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

          <div className="card p-10 lg:p-12">
            <h2 className="text-h3 mb-4 text-ink">{copy.appealTitle}</h2>
            <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>{copy.appealText}</p>
            
            {/* INAI Contact Card */}
            <div className="mt-10 rounded-2xl border border-border bg-slate-50 p-8">
              <h3 className="font-semibold" style={{ color: '#0f172a' }}>{copy.inaiContactTitle}</h3>
              <div className="mt-8 space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-primary-subtle p-2 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{copy.inaiAddress}</p>
                </div>

                {/* Phones */}
                {copy.inaiPhones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="rounded-full bg-primary-subtle p-2 text-primary">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 7.492a1 1 0 00.502.756l4.618 3.463a1 1 0 001.097-.07l3.583-3.583a1 1 0 00.211-1.197l-3.463-4.618a1 1 0 00-.756-.502l-7.492-1.498a1 1 0 00-.684-.948H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-3.28a1 1 0 00-.948.684l-1.498 7.492" />
                      </svg>
                    </div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm font-medium" style={{ color: '#003DA5' }}>
                      {phone}
                    </a>
                  </div>
                ))}

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary-subtle p-2 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href={`mailto:${copy.inaiEmail}`} className="text-sm font-medium" style={{ color: '#003DA5' }}>
                    {copy.inaiEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}