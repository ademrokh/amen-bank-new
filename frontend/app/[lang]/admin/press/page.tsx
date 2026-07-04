'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Language = 'fr' | 'ar' | 'en';

type PressArticle = {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_fr: string;
  body_en: string;
  body_ar: string;
  category: string;
  icon: string;
  is_published: boolean;
  display_order: number;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

interface AdminPressPageProps {
  params: Promise<{ lang: Language }>;
}

const PRESS_CATEGORIES = [
  { value: 'Gouvernance', labelFr: 'Gouvernance', labelEn: 'Governance', labelAr: 'الحوكمة' },
  { value: 'Résultats', labelFr: 'Résultats', labelEn: 'Results', labelAr: 'النتائج' },
  { value: 'Marchés', labelFr: 'Marchés', labelEn: 'Markets', labelAr: 'الأسواق' },
  { value: 'RSE', labelFr: 'RSE', labelEn: 'CSR', labelAr: 'المسؤولية المجتمعية' },
  { value: 'Produits', labelFr: 'Produits', labelEn: 'Products', labelAr: 'منتجات' },
  { value: 'Innovation', labelFr: 'Innovation', labelEn: 'Innovation', labelAr: 'ابتكار' },
  { value: 'Expansion', labelFr: 'Expansion', labelEn: 'Expansion', labelAr: 'توسع' },
];

const ICON_OPTIONS = [
  { value: 'governance', labelFr: 'Gouvernance', labelEn: 'Governance', labelAr: 'حوكمة' },
  { value: 'results', labelFr: 'Résultats', labelEn: 'Results', labelAr: 'نتائج' },
  { value: 'profit', labelFr: 'Profit', labelEn: 'Profit', labelAr: 'أرباح' },
  { value: 'markets', labelFr: 'Marchés', labelEn: 'Markets', labelAr: 'أسواق' },
  { value: 'esg', labelFr: 'RSE / ESG', labelEn: 'CSR / ESG', labelAr: 'مسؤولية مجتمعية' },
  { value: 'card', labelFr: 'Carte bancaire', labelEn: 'Bank card', labelAr: 'بطاقة بنكية' },
  { value: 'home', labelFr: 'Accueil', labelEn: 'Home', labelAr: 'الرئيسية' },
  { value: 'mobile', labelFr: 'Mobile / App', labelEn: 'Mobile / App', labelAr: 'جوال / تطبيق' },
  { value: 'approval', labelFr: 'Approbation', labelEn: 'Approval', labelAr: 'موافقة' },
  { value: 'report', labelFr: 'Rapport', labelEn: 'Report', labelAr: 'تقرير' },
];

// Derives the exact string union type for the form state from the array above
type IconOption = typeof ICON_OPTIONS[number]['value'];

// --- Translations ---
const ui: Record<Language, Record<string, string>> = {
  fr: {
    badge: 'Admin',
    title: 'Administration de la presse',
    subtitle: 'Gérez les articles de presse et les cartes d\'actualités utilisés sur la page publique.',
    createTitle: 'Créer un article de presse',
    titleFr: 'Titre (FR)',
    titleEn: 'Titre (EN)',
    titleAr: 'Titre (AR)',
    excerptFr: 'Extrait (FR)',
    excerptEn: 'Extrait (EN)',
    excerptAr: 'Extrait (AR)',
    bodyFr: 'Contenu (FR)',
    bodyEn: 'Contenu (EN)',
    bodyAr: 'Contenu (AR)',
    category: 'Catégorie',
    icon: 'Icône',
    publish: 'Publier ?',
    publishLabel: 'Publier immédiatement',
    order: 'Ordre d\'affichage',
    saveBtn: 'Enregistrer l\'article',
    savingBtn: 'Enregistrement...',
    existingTitle: 'Articles de presse existants',
    refreshBtn: 'Actualiser',
    thTitle: 'Titre',
    thCategory: 'Catégorie',
    thStatus: 'Statut',
    thActions: 'Actions',
    published: 'Publié',
    draft: 'Brouillon',
    publishAction: 'Publier',
    unpublishAction: 'Dépublier',
    deleteAction: 'Supprimer',
    confirmDel: 'Supprimer cet article ?',
    msgCreated: 'Article de presse créé avec succès.',
    msgUpdated: 'Statut de l\'article mis à jour.',
    msgDeleted: 'Article supprimé.',
    loading: 'Chargement...',
    empty: 'Aucun article de presse trouvé.',
  },
  en: {
    badge: 'Admin',
    title: 'Press administration',
    subtitle: 'Manage press articles and news cards used on the public news page.',
    createTitle: 'Create press article',
    titleFr: 'Title (FR)',
    titleEn: 'Title (EN)',
    titleAr: 'Title (AR)',
    excerptFr: 'Excerpt (FR)',
    excerptEn: 'Excerpt (EN)',
    excerptAr: 'Excerpt (AR)',
    bodyFr: 'Body (FR)',
    bodyEn: 'Body (EN)',
    bodyAr: 'Body (AR)',
    category: 'Category',
    icon: 'Icon',
    publish: 'Publish?',
    publishLabel: 'Publish immediately',
    order: 'Display order',
    saveBtn: 'Save press article',
    savingBtn: 'Saving...',
    existingTitle: 'Existing press articles',
    refreshBtn: 'Refresh',
    thTitle: 'Title',
    thCategory: 'Category',
    thStatus: 'Status',
    thActions: 'Actions',
    published: 'Published',
    draft: 'Draft',
    publishAction: 'Publish',
    unpublishAction: 'Unpublish',
    deleteAction: 'Delete',
    confirmDel: 'Delete this article?',
    msgCreated: 'Press article created successfully.',
    msgUpdated: 'Press article status updated.',
    msgDeleted: 'Press article deleted.',
    loading: 'Loading...',
    empty: 'No press articles found.',
  },
  ar: {
    badge: 'إدارة',
    title: 'إدارة الصحافة',
    subtitle: 'إدارة مقالات الصحافة وبطاقات الأخبار المستخدمة في صفحة الأخبار العامة.',
    createTitle: 'إنشاء مقال صحفي',
    titleFr: 'العنوان (FR)',
    titleEn: 'العنوان (EN)',
    titleAr: 'العنوان (AR)',
    excerptFr: 'المقتطف (FR)',
    excerptEn: 'المقتطف (EN)',
    excerptAr: 'المقتطف (AR)',
    bodyFr: 'المحتوى (FR)',
    bodyEn: 'المحتوى (EN)',
    bodyAr: 'المحتوى (AR)',
    category: 'الفئة',
    icon: 'الأيقونة',
    publish: 'نشر؟',
    publishLabel: 'النشر فوراً',
    order: 'ترتيب العرض',
    saveBtn: 'حفظ المقال الصحفي',
    savingBtn: 'جاري الحفظ...',
    existingTitle: 'المقالات الصحفية الحالية',
    refreshBtn: 'تحديث',
    thTitle: 'العنوان',
    thCategory: 'الفئة',
    thStatus: 'الحالة',
    thActions: 'الإجراءات',
    published: 'منشور',
    draft: 'مسودة',
    publishAction: 'نشر',
    unpublishAction: 'إلغاء النشر',
    deleteAction: 'حذف',
    confirmDel: 'حذف هذا المقال؟',
    msgCreated: 'تم إنشاء المقال الصحفي بنجاح.',
    msgUpdated: 'تم تحديث حالة المقال.',
    msgDeleted: 'تم حذف المقال.',
    loading: 'جاري التحميل...',
    empty: 'لا توجد مقالات صحفية.',
  },
};

const getLocalizedString = (
  value: { fr?: string; en?: string; ar?: string; labelFr?: string; labelEn?: string; labelAr?: string },
  lang: Language,
) => {
  if (lang === 'fr') return value.fr ?? value.labelFr ?? '';
  if (lang === 'ar') return value.ar ?? value.labelAr ?? '';
  return value.en ?? value.labelEn ?? '';
};

const inputClasses = "w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2";

// --- Component ---
export default function AdminPressPage({ params }: AdminPressPageProps) {
  const { lang } = use(params);
  const t = ui[lang];
  const router = useRouter();
  
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [excerptFr, setExcerptFr] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [bodyFr, setBodyFr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [category, setCategory] = useState(PRESS_CATEGORIES[0].value);
  const [icon, setIcon] = useState<IconOption>('governance');
  const [isPublished, setIsPublished] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Safe fetch pattern for React 19 / Next.js 16
  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch('/api/admin/press', { method: 'GET' });
        if (!isMounted) return;
        if (response.status === 401) return router.replace(`/${lang}/admin/login`);
        if (!response.ok) throw new Error('Failed to load');
        const payload = await response.json();
        setArticles(payload.articles ?? []);
      } catch (err) {
        if (isMounted) setErrorMessage((err as Error).message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchArticles();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setTitleFr(''); setTitleEn(''); setTitleAr('');
    setExcerptFr(''); setExcerptEn(''); setExcerptAr('');
    setBodyFr(''); setBodyEn(''); setBodyAr('');
    setCategory(PRESS_CATEGORIES[0].value);
    setIcon('governance');
    setIsPublished(false);
    setDisplayOrder(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); setErrorMessage(null); setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('title_fr', titleFr);
      formData.append('title_en', titleEn);
      formData.append('title_ar', titleAr);
      formData.append('excerpt_fr', excerptFr);
      formData.append('excerpt_en', excerptEn);
      formData.append('excerpt_ar', excerptAr);
      formData.append('body_fr', bodyFr);
      formData.append('body_en', bodyEn);
      formData.append('body_ar', bodyAr);
      formData.append('category', category);
      formData.append('icon', icon);
      formData.append('is_published', String(isPublished));
      formData.append('display_order', String(displayOrder));

      const response = await fetch('/api/admin/press', { method: 'POST', body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to create');

      setSuccessMessage(t.msgCreated);
      resetForm();
      
      const listRes = await fetch('/api/admin/press');
      if (listRes.ok) {
        const listPayload = await listRes.json();
        setArticles(listPayload.articles ?? []);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (article: PressArticle) => {
    try {
      const res = await fetch('/api/admin/press', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, is_published: !article.is_published }),
      });
      if (!res.ok) throw new Error();
      setSuccessMessage(t.msgUpdated); 
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_published: !a.is_published } : a));
    } catch { setErrorMessage('Failed to update'); }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm(t.confirmDel)) return;
    try {
      const res = await fetch('/api/admin/press', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId }),
      });
      if (!res.ok) throw new Error();
      setSuccessMessage(t.msgDeleted); 
      setArticles(prev => prev.filter(a => a.id !== articleId));
    } catch { setErrorMessage('Failed to delete'); }
  };

  const getDocTitle = (article: PressArticle) => {
    if (lang === 'ar') return article.title_ar;
    if (lang === 'en') return article.title_en;
    return article.title_fr;
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-6xl">
          <span className="section-badge section-badge-light">{t.badge}</span>
          <h1 className="text-h1 mt-3" style={{ color: '#ffffff' }}>{t.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed" style={{ color: '#94a3b8' }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-6xl space-y-8">
          
          {/* CREATE FORM */}
          <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <h2 className="text-h3" style={{ color: '#0f172a' }}>{t.createTitle}</h2>
            
            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              {/* Titles */}
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleFr}</label>
                <input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleEn}</label>
                <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.titleAr}</label>
                <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>

              {/* Excerpts */}
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.excerptFr}</label>
                <textarea value={excerptFr} onChange={(e) => setExcerptFr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={3} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.excerptEn}</label>
                <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={3} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.excerptAr}</label>
                <textarea value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={3} />
              </div>

              {/* Bodies */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.bodyFr}</label>
                <textarea value={bodyFr} onChange={(e) => setBodyFr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.bodyEn}</label>
                <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.bodyAr}</label>
                <textarea value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} required className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} rows={4} />
              </div>

              {/* Meta */}
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.category}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                  {PRESS_CATEGORIES.map((opt) => (<option key={opt.value} value={opt.value}>{getLocalizedString(opt, lang)}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.icon}</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value as IconOption)} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {getLocalizedString(opt, lang)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.publish}</label>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <input 
                  type="checkbox" 
                  checked={isPublished} 
                  onChange={(e) => setIsPublished(e.target.checked)} 
                  id="publish-switch"
                  className="h-4 w-4 rounded border-slate-300"
                  style={{ accentColor: '#006B3C' }}
                />
                <label htmlFor="publish-switch" className="text-sm" style={{ color: '#64748b' }}>{t.publishLabel}</label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: '#334155' }}>{t.order}</label>
                <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className={inputClasses} style={{ borderColor: '#e2e8f0', color: '#0f172a' }} />
              </div>
              <div />

              {/* Submit */}
              <div className="md:col-span-2 flex items-center gap-4 border-t pt-6" style={{ borderColor: '#f1f5f9' }}>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
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
                  {isSubmitting ? t.savingBtn : t.saveBtn}
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

          {/* TABLE LIST */}
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-h3" style={{ color: '#0f172a' }}>{t.existingTitle}</h2>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
              >
                {t.refreshBtn}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-16" style={{ color: '#64748b' }}>
                  <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24" style={{ color: '#003DA5' }}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  {t.loading}
                </div>
              ) : articles.length === 0 ? (
                <div className="py-16 text-center" style={{ color: '#64748b' }}>
                  <p className="font-medium">{t.empty}</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}>
                      <th className="px-4 py-3">{t.thTitle}</th>
                      <th className="px-4 py-3">{t.thCategory}</th>
                      <th className="px-4 py-3">{t.thStatus}</th>
                      <th className="px-4 py-3 text-right">{t.thActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                    {articles.map((article) => (
                      <tr key={article.id} className="transition" style={{ background: 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium" style={{ color: '#0f172a' }}>{getDocTitle(article)}</td>
                        
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(0, 61, 165, 0.1)', color: '#003DA5' }}>
                            {article.category}
                          </span>
                        </td>
                        
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{
                            background: article.is_published ? 'rgba(0, 107, 60, 0.1)' : '#fffbeb',
                            color: article.is_published ? '#006B3C' : '#92400e'
                          }}>
                            {article.is_published ? t.published : t.draft}
                          </span>
                        </td>
                        
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                              onClick={() => handleTogglePublish(article)} 
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
                                transition: 'background 0.15s ease'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0, 61, 165, 0.1)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              {article.is_published ? t.unpublishAction : t.publishAction}
                            </button>
                            <button 
                              onClick={() => handleDelete(article.id)} 
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
                              {t.deleteAction}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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