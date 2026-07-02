'use client';

import { FormEvent, useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

type Language = 'fr' | 'ar' | 'en';

interface AdminDocument {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  category: string;
  file_path: string;
  file_size_bytes: number | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
}

interface AdminAccessInformationPageProps {
  params: Promise<{ lang: Language }>;
}

const categoryOptions = [
  { value: 'rapport_financier', labelFr: 'Rapports financiers', labelEn: 'Financial reports', labelAr: 'التقارير المالية' },
  { value: 'statuts', labelFr: 'Statuts', labelEn: 'Constitution / statutes', labelAr: 'النظام الأساسي' },
  { value: 'gouvernance', labelFr: 'Gouvernance', labelEn: 'Governance', labelAr: 'الحوكمة' },
  { value: 'commissaire_comptes', labelFr: 'Rapports du commissaire aux comptes', labelEn: 'Auditor reports', labelAr: 'تقارير المراجع' },
  { value: 'guide', labelFr: 'Guides', labelEn: 'Guides', labelAr: 'الأدلة' },
];

export default function AdminAccessInformationPage({}: AdminAccessInformationPageProps) {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState(categoryOptions[0].value);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/admin/documents', { method: 'GET' });
      if (response.status === 401) {
        router.replace('/fr/admin/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Unable to load documents');
      }
      const payload = await response.json();
      setDocuments(payload.documents ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load documents';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initialize = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        }
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/fr/admin/login');
        return;
      }

      await loadDocuments();
    };

    void initialize();
  }, [loadDocuments, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage('Please select a PDF file.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title_fr', titleFr);
    formData.append('title_en', titleEn);
    formData.append('title_ar', titleAr);
    formData.append('category', category);

    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? 'Upload failed');
      }
      setSuccessMessage('Document uploaded successfully.');
      setTitleFr('');
      setTitleEn('');
      setTitleAr('');
      setCategory(categoryOptions[0].value);
      setFile(null);
      const fileInput = document.getElementById('document-file') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
      await loadDocuments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTogglePublish(documentId: string, currentValue: boolean) {
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: documentId, is_published: !currentValue }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to update document');
      }
      setSuccessMessage('Document updated.');
      await loadDocuments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update document';
      setErrorMessage(message);
    }
  }

  async function handleDelete(documentId: string) {
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: documentId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to delete document');
      }
      setSuccessMessage('Document deleted.');
      await loadDocuments();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete document';
      setErrorMessage(message);
    }
  }

  const selectedCategoryLabel = useMemo(() => {
    const match = categoryOptions.find((option) => option.value === category);
    return match?.labelFr ?? category;
  }, [category]);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container max-w-6xl">
          <span className="section-badge section-badge-light">Admin</span>
          <h1 className="text-h1 mt-3 mb-4 text-white">Access information administration</h1>
          <p className="max-w-3xl text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
            Upload and manage public documents for the access-to-information page.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-6xl space-y-8">
          <div className="card">
            <h2 className="text-h3 text-ink">Upload document</h2>
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
                <label className="mb-2 block text-sm font-medium text-ink">Category</label>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-2xl border border-border px-4 py-3">
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.labelFr}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-ink">PDF file</label>
                <input id="document-file" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required className="w-full rounded-2xl border border-dashed border-border px-4 py-3" />
                <p className="mt-2 text-sm text-ink-secondary">Maximum size: 10 MB. Only PDFs are accepted.</p>
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={isSubmitting} className="rounded-full bg-ink px-5 py-3 font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Uploading…' : 'Upload document'}
                </button>
                <span className="text-sm text-ink-secondary">{selectedCategoryLabel}</span>
              </div>
            </form>
            {errorMessage && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{errorMessage}</p>}
            {successMessage && <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{successMessage}</p>}
          </div>

          <div className="card">
            <h2 className="text-h3 text-ink">Existing documents</h2>
            {isLoading ? (
              <p className="mt-4 text-ink-secondary">Loading…</p>
            ) : documents.length === 0 ? (
              <p className="mt-4 text-ink-secondary">No documents yet.</p>
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
                    {documents.map((document) => (
                      <tr key={document.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 font-medium text-ink">{document.title_fr}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{document.category}</td>
                        <td className="py-3 pr-4 text-ink-secondary">{document.is_published ? 'Published' : 'Draft'}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleTogglePublish(document.id, document.is_published)} className="rounded-full border border-border px-3 py-2 text-sm hover:bg-surface-alt">Toggle publish</button>
                            <button onClick={() => handleDelete(document.id)} className="rounded-full border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
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
