'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
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
  'governance', 'results', 'profit', 'markets', 'esg', 'card', 'home', 'mobile', 'approval', 'report',
] as const;

type IconOption = (typeof ICON_OPTIONS)[number];

const getLocalizedString = (
  value: { fr?: string; en?: string; ar?: string; labelFr?: string; labelEn?: string; labelAr?: string },
  lang: Language,
) => {
  if (lang === 'fr') return value.fr ?? value.labelFr ?? '';
  if (lang === 'ar') return value.ar ?? value.labelAr ?? '';
  return value.en ?? value.labelEn ?? '';
};

export default function AdminPressPage({ params }: { params: { lang: Language } }) {
  const { lang } = params;
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

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/press', { method: 'GET' });
      if (response.status === 401) {
        router.replace(`/${lang}/admin/login`);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load press articles');
      }

      const payload = await response.json();
      setArticles(payload.articles ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load press content';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [lang, router]);

  const resetForm = () => {
    setTitleFr('');
    setTitleEn('');
    setTitleAr('');
    setExcerptFr('');
    setExcerptEn('');
    setExcerptAr('');
    setBodyFr('');
    setBodyEn('');
    setBodyAr('');
    setCategory(PRESS_CATEGORIES[0].value);
    setIcon('governance');
    setIsPublished(false);
    setDisplayOrder(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

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

      const response = await fetch('/api/admin/press', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create article');
      }

      setSuccessMessage('Press article created successfully.');
      resetForm();
      await loadArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create article';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (article: PressArticle) => {
    try {
      const response = await fetch('/api/admin/press', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, is_published: !article.is_published }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to update article');
      }

      setSuccessMessage('Press article status updated.');
      await loadArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update article';
      setErrorMessage(message);
    }
  };

  const handleDelete = async (articleId: string) => {
    try {
      const response = await fetch('/api/admin/press', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to delete article');
      }

      setSuccessMessage('Press article deleted.');
      await loadArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete article';
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  return (
    <div className="min-h-screen bg-surface">
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container max-w-6xl">
          <span className="section-badge section-badge-light">Admin</span>
          <h1 className="text-h1 mt-3 mb-4 text-white">Press administration</h1>
          <p className="max-w-3xl text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
            Manage press articles and news cards used on the public news page.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-6xl space-y-8">
          <div className="card">
            <h2 className="text-h3 text-ink">Create press article</h2>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Title (FR)</label>
                <input value={titleFr} onChange={(event) => setTitleFr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Title (EN)</label>
                <input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Title (AR)</label>
                <input value={titleAr} onChange={(event) => setTitleAr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Excerpt (FR)</label>
                <textarea value={excerptFr} onChange={(event) => setExcerptFr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={3} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Excerpt (EN)</label>
                <textarea value={excerptEn} onChange={(event) => setExcerptEn(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={3} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Excerpt (AR)</label>
                <textarea value={excerptAr} onChange={(event) => setExcerptAr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-ink">Body (FR)</label>
                <textarea value={bodyFr} onChange={(event) => setBodyFr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-ink">Body (EN)</label>
                <textarea value={bodyEn} onChange={(event) => setBodyEn(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-ink">Body (AR)</label>
                <textarea value={bodyAr} onChange={(event) => setBodyAr(event.target.value)} required className="w-full rounded-2xl border border-border px-4 py-3" rows={4} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Category</label>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-2xl border border-border px-4 py-3">
                  {PRESS_CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>{getLocalizedString(option, lang)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Icon</label>
                <select value={icon} onChange={(event) => setIcon(event.target.value as IconOption)} className="w-full rounded-2xl border border-border px-4 py-3">
                  {ICON_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Publish?</label>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} id="publish-switch" />
                  <label htmlFor="publish-switch" className="text-sm text-ink-secondary">Publish immediately</label>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Display order</label>
                <input type="number" value={displayOrder} onChange={(event) => setDisplayOrder(Number(event.target.value))} className="w-full rounded-2xl border border-border px-4 py-3" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-ink px-5 py-3 font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Saving…' : 'Save press article'}
                </button>
                <span className="text-sm text-ink-secondary">Use the form above to create searchable press summaries.</span>
              </div>
            </form>
            {errorMessage && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{errorMessage}</p>}
            {successMessage && <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{successMessage}</p>}
          </div>

          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-h3 text-ink">Existing press articles</h2>
              <button onClick={loadArticles} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-alt">Refresh</button>
            </div>

            {isLoading ? (
              <p className="mt-4 text-ink-secondary">Loading…</p>
            ) : articles.length === 0 ? (
              <p className="mt-4 text-ink-secondary">No press articles found.</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-ink-secondary">
                      <th className="py-3 pr-4">Title</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 font-medium text-ink">{article.title_fr}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{article.category}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{article.is_published ? 'Published' : 'Draft'}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleTogglePublish(article)} className="rounded-full border border-border px-3 py-2 text-sm hover:bg-surface-alt">Toggle publish</button>
                            <button onClick={() => handleDelete(article.id)} className="rounded-full border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
