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

  return (
    <main className="bg-surface-alt py-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

            {/* ── Left Column: Form ── */}
            <div>
              <span className="section-label">Amen Bank</span>
              <h1 className="text-h1 text-ink mt-2 mb-4">{page.title}</h1>
              <p className="text-lg text-ink-secondary leading-relaxed mb-3">
                {page.subtitle}
              </p>
              <p className="text-ink-secondary leading-relaxed mb-10">
                {page.intro}
              </p>

              <div className="card p-8!">
                <h2 className="text-h3 text-ink mb-6">{page.formTitle}</h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {page.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-small font-semibold text-ink mb-2">
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className="input-field"
                        placeholder={field.placeholder}
                        required={field.name !== 'accountType'}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-small font-semibold text-ink mb-2">
                      {page.messageLabel}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder={page.messagePlaceholder}
                    />
                  </div>

                  {/* Feedback alert */}
                  {feedback.type && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        feedback.type === 'success'
                          ? 'bg-primary-50 border border-primary-100'
                          : 'bg-error/5 border border-error/20'
                      } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                      )}
                      <p
                        className={`text-small font-medium ${
                          feedback.type === 'success' ? 'text-primary' : 'text-error'
                        }`}
                      >
                        {feedback.message}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className={`flex flex-wrap gap-4 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
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
                      className={`btn btn-outline inline-flex ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {page.secondary}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Right Column: Notes ── */}
            <div className="bg-slate-900 rounded-lg p-8 lg:sticky lg:top-24">
              <h2 className="text-h3 text-white mb-6">{page.notesHeading}</h2>
              <ul className="space-y-4">
                {page.notes.map((note) => (
                  <li
                    key={note}
                    className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/80">
                      ✓
                    </span>
                    <span className="text-small text-white/70 leading-relaxed">
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