'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORY_CONFIG, parseCategoryString, type CategoryKey } from '@/lib/document-categories';

type Language = 'fr' | 'en' | 'ar';

interface AdminDocument {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  category: string;
  file_size_bytes: number | null;
  is_published: boolean;
}

interface UploadedFileInfo {
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
}

interface AdminAccessInformationPageProps {
  params: Promise<{ lang: Language }>;
}

// --- Translations ---
const ui: Record<Language, Record<string, string>> = {
  fr: {
    badge: 'Admin',
    title: 'Administration des informations d\'accès',
    uploadTitle: 'Télécharger un document',
    category: 'Catégorie',
    titleFr: 'Titre (FR)',
    titleEn: 'Titre (EN)',
    titleAr: 'Titre (AR)',
    language: 'Langue',
    year: 'Année',
    semester: 'Semestre',
    type: 'Type',
    customLabel: 'Label personnalisé',
    file: 'Fichier PDF',
    sendToStorage: 'Envoyer vers le stockage',
    sendingToStorage: 'Envoi en cours...',
    sentToStorage: '✓ Envoyé au stockage',
    uploadBtn: 'Télécharger',
    uploadingBtn: 'Téléchargement...',
    all: 'Tous',
    thTitle: 'Titre',
    thCategory: 'Catégorie',
    thFilters: 'Filtres',
    thStatus: 'Statut',
    thActions: 'Actions',
    published: 'Publié',
    draft: 'Brouillon',
    publish: 'Publier',
    unpublish: 'Dépublier',
    delete: 'Supprimer',
    msgUploaded: 'Document téléchargé avec succès.',
    msgUpdated: 'Statut mis à jour.',
    msgDeleted: 'Supprimé.',
    msgSentToStorage: 'Fichier envoyé au stockage.',
    errSelectFile: 'Veuillez sélectionner un fichier PDF.',
    errNotSent: 'Veuillez d\'abord envoyer le fichier vers le stockage.',
    errUpdate: 'Échec de la mise à jour.',
    errDelete: 'Échec de la suppression.',
    confirmDel: 'Supprimer ce document ?',
    loading: 'Chargement...',
    yearPh: '2024',
    labelPh: 'ex: Résultats annuels 2024',
    analyzing: 'Analyse du document...',
    aiSuggested: '✨ Titre et catégorie suggérés par IA — à vérifier avant l\'envoi',
  },
  en: {
    badge: 'Admin',
    title: 'Access Information Admin',
    uploadTitle: 'Upload Document',
    category: 'Category',
    titleFr: 'Title (FR)',
    titleEn: 'Title (EN)',
    titleAr: 'Title (AR)',
    language: 'Language',
    year: 'Year',
    semester: 'Semester',
    type: 'Type',
    customLabel: 'Custom Label',
    file: 'PDF File',
    sendToStorage: 'Send to Storage',
    sendingToStorage: 'Uploading...',
    sentToStorage: '✓ Sent to Storage',
    uploadBtn: 'Upload',
    uploadingBtn: 'Uploading...',
    all: 'All',
    thTitle: 'Title',
    thCategory: 'Category',
    thFilters: 'Filters',
    thStatus: 'Status',
    thActions: 'Actions',
    published: 'Published',
    draft: 'Draft',
    publish: 'Publish',
    unpublish: 'Unpublish',
    delete: 'Delete',
    msgUploaded: 'Document uploaded successfully.',
    msgUpdated: 'Status updated.',
    msgDeleted: 'Deleted.',
    msgSentToStorage: 'File sent to storage.',
    errSelectFile: 'Please select a PDF file.',
    errNotSent: 'Please send the file to storage first.',
    errUpdate: 'Failed to update.',
    errDelete: 'Failed to delete.',
    confirmDel: 'Delete this document?',
    loading: 'Loading...',
    yearPh: '2024',
    labelPh: 'e.g. Annual results 2024',
    analyzing: 'Analyzing document...',
    aiSuggested: '✨ AI-suggested title & category — review before uploading',
  },
  ar: {
    badge: 'إدارة',
    title: 'إدارة معلومات الوصول',
    uploadTitle: 'رفع مستند',
    category: 'الفئة',
    titleFr: 'العنوان (FR)',
    titleEn: 'العنوان (EN)',
    titleAr: 'العنوان (AR)',
    language: 'اللغة',
    year: 'السنة',
    semester: 'الفصل',
    type: 'النوع',
    customLabel: 'تصنيف مخصص',
    file: 'ملف PDF',
    sendToStorage: 'إرسال إلى التخزين',
    sendingToStorage: 'جاري الإرسال...',
    sentToStorage: '✓ تم الإرسال إلى التخزين',
    uploadBtn: 'رفع',
    uploadingBtn: 'جاري الرفع...',
    all: 'الكل',
    thTitle: 'العنوان',
    thCategory: 'الفئة',
    thFilters: 'الفلاتر',
    thStatus: 'الحالة',
    thActions: 'الإجراءات',
    published: 'منشور',
    draft: 'مسودة',
    publish: 'نشر',
    unpublish: 'إلغاء النشر',
    delete: 'حذف',
    msgUploaded: 'تم رفع المستند بنجاح.',
    msgUpdated: 'تم تحديث الحالة.',
    msgDeleted: 'تم الحذف.',
    msgSentToStorage: 'تم إرسال الملف إلى التخزين.',
    errSelectFile: 'يرجى اختيار ملف PDF.',
    errNotSent: 'يرجى إرسال الملف إلى التخزين أولاً.',
    errUpdate: 'فشل التحديث.',
    errDelete: 'فشل الحذف.',
    confirmDel: 'حذف هذا المستند؟',
    loading: 'جاري التحميل...',
    yearPh: '2024',
    labelPh: 'مثال: النتائج السنوية 2024',
    analyzing: 'جاري تحليل المستند...',
    aiSuggested: '✨ العنوان والفئة مقترحان بالذكاء الاصطناعي — يرجى المراجعة قبل الرفع',
  },
};

const categoryLabels: Record<CategoryKey, Record<Language, string>> = {
  agenda_financier: { fr: 'Agenda Financier', en: 'Financial Agenda', ar: 'الأجندة المالية' },
  indicateur_financier: { fr: 'Indicateur Financier', en: 'Financial Indicator', ar: 'المؤشرات المالية' },
  informations_financieres: { fr: 'Informations Financières', en: 'Financial Information', ar: 'المعلومات المالية' },
  publications_financieres: { fr: 'Publications Financières', en: 'Financial Publications', ar: 'المنشورات المالية' },
  rapports_activite: { fr: "Rapports d'activité", en: 'Activity Reports', ar: 'تقارير النشاط' },
  documents_reference: { fr: 'Documents de référence', en: 'Reference Documents', ar: 'وثائق مرجعية' },
  rapports_rse: { fr: 'Rapports RSE', en: 'CSR Reports', ar: 'تقارير المسؤولية الاجتماعية' },
  lettres_actionnaires: { fr: 'Lettres aux actionnaires', en: 'Letters to Shareholders', ar: 'رسائل إلى المساهمين' },
};

const SEMESTER_OPTIONS = [
  { value: '1', label: { fr: '1er Semestre', en: '1st Semester', ar: 'الفصل الأول' } },
  { value: '2', label: { fr: '2ème Semestre', en: '2nd Semester', ar: 'الفصل الثاني' } },
];
const FINANCIAL_TYPE_OPTIONS = [
  { value: 'consolides', label: { fr: 'Consolidés', en: 'Consolidated', ar: 'المدمجة' } },
  { value: 'individuels', label: { fr: 'Individuels', en: 'Individual', ar: 'الفردية' } },
  { value: 'intermediaires', label: { fr: 'Intermédiaires', en: 'Interim', ar: 'المرحلية' } },
];
const LANGUAGE_OPTIONS = [
  { value: 'fr', label: { fr: 'Français', en: 'French', ar: 'الفرنسية' } },
  { value: 'en', label: { fr: 'English', en: 'English', ar: 'الإنجليزية' } },
  { value: 'ar', label: { fr: 'العربية', en: 'Arabic', ar: 'العربية' } },
];

const inputClasses = "w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2";

// --- Component ---
export default function AdminAccessInformationPage({ params }: AdminAccessInformationPageProps) {
  const { lang } = use(params);
  const t = ui[lang];

  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState<CategoryKey>('agenda_financier');
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryKey | 'all'>('all');

  const [filterYear, setFilterYear] = useState('');
  const [filterSem, setFilterSem] = useState('1');
  const [filterLang, setFilterLang] = useState('fr');
  const [filterType, setFilterType] = useState('consolides');
  const [filterLabel, setFilterLabel] = useState('');

  // AI suggestion state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  // Storage upload state
  const [isUploadingToStorage, setIsUploadingToStorage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);

  const router = useRouter();
  const currentConfig = CATEGORY_CONFIG[category];

  useEffect(() => {
    let isMounted = true;
    const fetchDocuments = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/admin/documents');
        if (!isMounted) return;
        if (res.status === 401) return router.replace(`/${lang}/admin/login`);
        if (!res.ok) throw new Error('Failed to load');
        const payload = await res.json();
        setDocuments(payload.documents ?? []);
      } catch (err) {
        if (isMounted) setErrorMessage((err as Error).message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDocuments();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCategoryChange(newCategory: CategoryKey) {
    setCategory(newCategory);
    setFilterYear(''); setFilterSem('1'); setFilterLang('fr'); setFilterType('consolides'); setFilterLabel('');
  }

  async function handleFileSelect(selected: File | null) {
    setFile(selected);
    setAiSuggested(false);
    setUploadedFile(null);
    if (!selected) return;

    setIsAnalyzing(true);
    try {
      const fd = new FormData();
      fd.append('file', selected);
      const res = await fetch('/api/admin/documents/analyze', { method: 'POST', body: fd });
      if (res.ok) {
        const suggestion = await res.json();
        if (!titleFr) setTitleFr(suggestion.title_fr ?? '');
        if (!titleEn) setTitleEn(suggestion.title_en ?? '');
        if (!titleAr) setTitleAr(suggestion.title_ar ?? '');
        if (suggestion.category && suggestion.category in CATEGORY_CONFIG) {
          handleCategoryChange(suggestion.category as CategoryKey);
        }
        setAiSuggested(true);
      }
    } catch {
      // silent fail — admin just fills manually, no need to block the form
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSendToStorage() {
    if (!file) return;
    setIsUploadingToStorage(true);
    setErrorMessage(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      const res = await fetch('/api/admin/documents/upload', { method: 'POST', body: fd });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error);
      setUploadedFile({
        file_path: payload.file_path,
        file_size_bytes: payload.file_size_bytes,
        mime_type: payload.mime_type,
      });
      setSuccessMessage(t.msgSentToStorage);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsUploadingToStorage(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return setErrorMessage(t.errSelectFile);
    if (!uploadedFile) return setErrorMessage(t.errNotSent);
    setIsSubmitting(true); setErrorMessage(null); setSuccessMessage(null);

    const body: Record<string, string | number> = {
      title_fr: titleFr,
      title_en: titleEn,
      title_ar: titleAr,
      category,
      file_path: uploadedFile.file_path,
      file_size_bytes: uploadedFile.file_size_bytes,
      mime_type: uploadedFile.mime_type,
    };

    if (currentConfig.filters.includes('year') && filterYear) body.filter_year = filterYear;
    if (currentConfig.filters.includes('sem')) body.filter_sem = filterSem;
    if (currentConfig.filters.includes('lang')) body.filter_lang = filterLang;
    if (currentConfig.filters.includes('type')) body.filter_type = filterType;
    if (currentConfig.filters.includes('label') && filterLabel) body.filter_label = filterLabel;

    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error);
      setSuccessMessage(t.msgUploaded);
      setTitleFr(''); setTitleEn(''); setTitleAr(''); setFile(null);
      setAiSuggested(false); setUploadedFile(null);
      (document.getElementById('document-file') as HTMLInputElement).value = '';

      const listRes = await fetch('/api/admin/documents');
      if (listRes.ok) {
        const listPayload = await listRes.json();
        setDocuments(listPayload.documents ?? []);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(id: string, val: boolean) {
    try {
      const res = await fetch('/api/admin/documents', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_published: !val }) });
      if (!res.ok) throw new Error();
      setSuccessMessage(t.msgUpdated);
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, is_published: !val } : d));
    } catch { setErrorMessage(t.errUpdate); }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDel)) return;
    try {
      const res = await fetch('/api/admin/documents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error();
      setSuccessMessage(t.msgDeleted);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch { setErrorMessage(t.errDelete); }
  }

  function getFilterBadge(rawCategory: string) {
    const parsed = parseCategoryString(rawCategory);
    const map: Record<string, string> = { sem: 'S', lang: '', type: '', year: '', label: '' };
    return Object.entries(parsed.filters).map(([k, v]) => `${map[k] || ''}${v}`).join(' · ') || '—';
  }

  function getDocTitle(doc: AdminDocument) {
    if (lang === 'ar') return doc.title_ar;
    if (lang === 'en') return doc.title_en;
    return doc.title_fr;
  }

  const tabOptions: Array<CategoryKey | 'all'> = ['all', ...(Object.keys(CATEGORY_CONFIG) as CategoryKey[])];
  const filteredDocuments = activeTab === 'all' ? documents : documents.filter(doc => doc.category.startsWith(activeTab));

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-6xl">
          <span className="section-badge section-badge-light">{t.badge}</span>
          <h1 className="text-h1 mt-3" style={{ color: '#ffffff' }}>{t.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container max-w-6xl space-y-8">

          {/* UPLOAD FORM */}
          <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <h2 className="text-h3" style={{ color: '#0f172a' }}>{t.uploadTitle}</h2>

            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.category}</label>
                <select value={category} onChange={e => handleCategoryChange(e.target.value as CategoryKey)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                  {Object.entries(CATEGORY_CONFIG).map(([k]) => (
                    <option key={k} value={k}>{categoryLabels[k as CategoryKey][lang]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleFr}</label>
                <input value={titleFr} onChange={e => setTitleFr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleEn}</label>
                <input value={titleEn} onChange={e => setTitleEn(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleAr}</label>
                <input value={titleAr} onChange={e => setTitleAr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>

              {currentConfig.filters.includes('lang') && (
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.language}</label>
                  <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                    {LANGUAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label[lang]}</option>)}
                  </select>
                </div>
              )}
              {currentConfig.filters.includes('year') && (
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.year}</label>
                  <input type="number" min="2000" max="2099" placeholder={t.yearPh} value={filterYear} onChange={e => setFilterYear(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
                </div>
              )}
              {currentConfig.filters.includes('sem') && (
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.semester}</label>
                  <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                    {SEMESTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label[lang]}</option>)}
                  </select>
                </div>
              )}
              {currentConfig.filters.includes('type') && (
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.type}</label>
                  <select value={filterType} onChange={e => setFilterType(e.target.value)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                    {FINANCIAL_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label[lang]}</option>)}
                  </select>
                </div>
              )}
              {currentConfig.filters.includes('label') && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.customLabel}</label>
                  <input type="text" placeholder={t.labelPh} value={filterLabel} onChange={e => setFilterLabel(e.target.value)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.file}</label>
                <label htmlFor="document-file" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition" style={{ borderColor: '#cbd5e1', background: '#f8fafc' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#006B3C'; e.currentTarget.style.background = 'rgba(0, 107, 60, 0.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <svg className="mb-3 h-10 w-10" style={{ color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-sm font-medium" style={{ color: '#334155' }}>{file ? file.name : 'Click to select PDF file'}</span>
                  {isAnalyzing && (
                    <span className="mt-1 text-xs" style={{ color: '#003DA5' }}>{t.analyzing}</span>
                  )}
                  {aiSuggested && !isAnalyzing && (
                    <span className="mt-1 text-xs" style={{ color: '#006B3C' }}>{t.aiSuggested}</span>
                  )}
                  {!isAnalyzing && !aiSuggested && (
                    <span className="mt-1 text-xs" style={{ color: '#64748b' }}>Max 10MB</span>
                  )}
                  <input id="document-file" type="file" accept="application/pdf" onChange={e => handleFileSelect(e.target.files?.[0] ?? null)} required className="hidden" />
                </label>

                {file && (
                  <button
                    type="button"
                    onClick={handleSendToStorage}
                    disabled={isUploadingToStorage || !!uploadedFile}
                    className="mt-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid #003DA5',
                      background: uploadedFile ? 'rgba(0, 107, 60, 0.1)' : 'transparent',
                      color: uploadedFile ? '#006B3C' : '#003DA5',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (!uploadedFile) e.currentTarget.style.background = 'rgba(0, 61, 165, 0.1)'; }}
                    onMouseLeave={e => { if (!uploadedFile) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {isUploadingToStorage ? t.sendingToStorage : uploadedFile ? t.sentToStorage : t.sendToStorage}
                  </button>
                )}
              </div>

              <div className="md:col-span-2 flex items-center gap-4 border-t pt-6" style={{ borderColor: '#f1f5f9' }}>
                {/* AMEN BANK GREEN PRIMARY BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadedFile}
                  className="text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '10px 24px',
                    borderRadius: '999px',
                    background: '#006B3C',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#004d2b'}
                  onMouseLeave={e => e.currentTarget.style.background = '#006B3C'}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 inline h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      {t.uploadingBtn}
                    </>
                  ) : t.uploadBtn}
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              {errorMessage && (
                <div className="flex items-center gap-3 rounded-lg border p-4 text-sm" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
                  <svg className="h-5 w-5 shrink-0" style={{ color: '#b91c1c' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-3 rounded-lg border p-4 text-sm" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
                  <svg className="h-5 w-5 shrink-0" style={{ color: '#059669' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {successMessage}
                </div>
              )}
            </div>
          </div>
          <br></br>
          {/* TABLE LIST */}
          <div>
            {/* AMEN BANK BLUE TABS */}
            <div className="mb-4 flex flex-wrap gap-3">
              {tabOptions.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === key ? '#003DA5' : '#f1f5f9',
                    color: activeTab === key ? '#ffffff' : '#475569',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onMouseEnter={e => { if (activeTab !== key) e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={e => { if (activeTab !== key) e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  {key === 'all' ? t.all : categoryLabels[key][lang]}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl bg-white" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-16" style={{ color: '#64748b' }}>
                  <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24" style={{ color: '#003DA5' }}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {t.loading}
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="py-16 text-center" style={{ color: '#64748b' }}>
                  <svg className="mx-auto mb-4 h-12 w-12" style={{ color: '#cbd5e1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="font-medium">No documents found</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}>
                      <th className="px-4 py-3">{t.thTitle}</th>
                      <th className="px-4 py-3">{t.thCategory}</th>
                      <th className="px-4 py-3">{t.thFilters}</th>
                      <th className="px-4 py-3">{t.thStatus}</th>
                      <th className="px-4 py-3 text-right">{t.thActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                    {filteredDocuments.map((doc) => {
                      const parsed = parseCategoryString(doc.category);
                      return (
                        <tr key={doc.id} className="transition" style={{ background: 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-medium" style={{ color: '#0f172a' }}>{getDocTitle(doc)}</td>

                          {/* AMEN BANK BLUE CATEGORY BADGE */}
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(0, 61, 165, 0.1)', color: '#003DA5' }}>
                              {categoryLabels[parsed.base]?.[lang] || parsed.base}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-xs" style={{ color: '#64748b' }}>
                            {getFilterBadge(doc.category)}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{
                              background: doc.is_published ? 'rgba(0, 107, 60, 0.1)' : '#fffbeb',
                              color: doc.is_published ? '#006B3C' : '#92400e'
                            }}>
                              {doc.is_published ? t.published : t.draft}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                              {/* AMEN BANK BLUE OUTLINE BUTTON */}
                              <button
                                onClick={() => handleToggle(doc.id, doc.is_published)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '10px 20px',
                                  borderRadius: '999px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  border: '1px solid #003DA5',
                                  background: 'transparent',
                                  color: '#003DA5',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease, color 0.15s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0, 61, 165, 0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                {doc.is_published ? t.unpublish : t.publish}
                              </button>

                              {/* DANGER DELETE BUTTON */}
                              <button
                                onClick={() => handleDelete(doc.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '10px 20px',
                                  borderRadius: '999px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  border: '1px solid #fecaca',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease, color 0.15s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#b91c1c'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc2626'; }}
                              >
                                {t.delete}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}