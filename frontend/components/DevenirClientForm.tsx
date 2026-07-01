'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';

type Language = 'fr' | 'en' | 'ar';

type PageContent = {
  title: string;
  subtitle: string;
  intro: string;
  formTitle: string;
  fields: Array<{ label: string; placeholder: string; name: string }>;
  notesHeading: string;
  notes: string[];
  submit: string;
  secondary: string;
  messageLabel: string;
  messagePlaceholder: string;
  success: string;
  error: string;
  loading: string;
};

export default function DevenirClientForm({ lang, page }: { lang: Language; page: PageContent }) {
  const isRTL = lang === 'ar';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: 'Devenir client',
          message: `${formData.accountType}\n\n${formData.message}`,
          language: lang,
          formType: 'devenir-client',
        }),
      });

      const result = await response.json().catch(() => ({ success: false, message: 'Unable to submit' }));

      if (!response.ok || !result.success) {
        throw new Error(result.message || page.error);
      }

      setFeedback({ type: 'success', message: page.success });
      setFormData({ fullName: '', email: '', phone: '', accountType: '', message: '' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : page.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base";
  const labelClasses = "block text-sm font-semibold text-slate-900 mb-3";

  return (
    <main className="section" style={{ background: '#f8fafc' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">

            {/* ── Left Column: Form ── */}
            <div>
              <div 
                className="section-header" 
                style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '3rem', alignItems: isRTL ? 'flex-end' : 'flex-start' }}
              >
                <span className="section-badge">Amen Bank</span>
                <h1 className="text-h1 text-ink">{page.title}</h1>
                <p className="text-lg leading-relaxed" style={{ color: '#64748b', margin: 0 }}>
                  {page.subtitle}
                </p>
                <p className="leading-relaxed" style={{ color: '#64748b', margin: '1rem 0 0 0' }}>
                  {page.intro}
                </p>
              </div>

              <div className="card">
                <h2 className="text-h3 text-ink mb-8">{page.formTitle}</h2>
                <br></br>
                <form onSubmit={handleSubmit}>
                  {page.fields.map((field) => (
                    <div key={field.name} className="mb-8">
                      <label className={labelClasses}>
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder={field.placeholder}
                        required={field.name !== 'accountType'}
                      />
                    </div>
                  ))}

                  <div className="mb-10">
                    <label className={labelClasses}>
                      {page.messageLabel}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClasses} resize-none`}
                      placeholder={page.messagePlaceholder}
                    />
                  </div>

                  {/* Feedback alert */}
                  {feedback.type && (
                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border mb-8 ${
                        feedback.type === 'success' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                      style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#006B3C' }} />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                      )}
                      <p 
                        className="text-sm font-medium" 
                        style={{ color: feedback.type === 'success' ? '#166534' : '#991b1b' }}
                      >
                        {feedback.message}
                      </p>
                    </div>
                  )}

                  {/* Buttons separated with explicit top margin, top padding, and a subtle border */}
                  <div className="flex flex-wrap items-center gap-6 mt-2 pt-8 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ color: '#ffffff', textDecoration: 'none', padding: '0.875rem 2rem' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          {page.loading}
                        </>
                      ) : (
                        page.submit
                      )}
                    </button>
                    <Link
                      href={`/${lang}/particuliers`}
                      className="btn btn-outline-dark"
                      style={{ color: '#64748b', textDecoration: 'none', padding: '0.875rem 2rem' }}
                    >
                      {page.secondary}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Right Column: Notes ── */}
            <div 
              className="lg:sticky lg:top-24" 
              style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '0.75rem' }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>
                {page.notesHeading}
              </h2>
              <ul className="space-y-4">
                {page.notes.map((note) => (
                  <li 
                    key={note} 
                    className="flex items-start gap-3"
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    <span 
                      className="mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}
                    >
                      ✓
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}