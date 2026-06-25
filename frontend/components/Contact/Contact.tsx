'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Contact() {
  const { lang: currentLang, isRTL } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language: currentLang }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    fr: {
      pageTitle: 'Nous Contacter',
      pageDescription: 'Une question ? Notre équipe est à votre écoute 24h/24, 7j/7',
      contactInfo: 'Coordonnées',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      hours: "Horaires d'ouverture",
      formTitle: 'Formulaire de Contact',
      formDesc: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures',
      name: 'Nom complet',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      success: 'Message envoyé avec succès !',
      successMsg: 'Merci pour votre message. Nous vous répondrons dans les 24 heures.',
      location: 'Localisation',
      workingHours: 'Lun-Ven : 8:00-17:00 | Sam : 9:00-12:00',
      subjects: ['Général', 'Support Client', 'Demande de Crédit', 'Plainte', 'Autre'],
      faqTitle: 'Questions Fréquemment Posées',
      faqDesc: 'Consultez notre section FAQ pour trouver des réponses à vos questions',
      faqLink: 'Voir la FAQ',
    },
    ar: {
      pageTitle: 'اتصل بنا',
      pageDescription: 'هل لديك سؤال؟ فريقنا مستعد للاستماع إليك 24/7',
      contactInfo: 'معلومات الاتصال',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      hours: 'ساعات العمل',
      formTitle: 'نموذج الاتصال',
      formDesc: 'املأ النموذج أدناه وسنرد عليك في غضون 24 ساعة',
      name: 'الاسم الكامل',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'إرسال',
      success: 'تم إرسال الرسالة بنجاح!',
      successMsg: 'شكراً لرسالتك. سنرد عليك في غضون 24 ساعة.',
      location: 'الموقع',
      workingHours: 'الاثنين-الجمعة: 8:00-17:00 | السبت: 9:00-12:00',
      subjects: ['عام', 'دعم العملاء', 'طلب قرض', 'شكوى', 'أخرى'],
      faqTitle: 'الأسئلة الشائعة',
      faqDesc: 'تحقق من قسم الأسئلة الشائعة للعثور على إجابات لأسئلتك',
      faqLink: 'عرض الأسئلة',
    },
    en: {
      pageTitle: 'Contact Us',
      pageDescription: 'Have a question? Our team is here to listen 24/7',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      hours: 'Working Hours',
      formTitle: 'Contact Form',
      formDesc: "Fill out the form below and we'll get back to you within 24 hours",
      name: 'Full Name',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      success: 'Message sent successfully!',
      successMsg: "Thank you for your message. We'll get back to you within 24 hours.",
      location: 'Location',
      workingHours: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
      subjects: ['General', 'Customer Support', 'Loan Request', 'Complaint', 'Other'],
      faqTitle: 'Frequently Asked Questions',
      faqDesc: 'Check our FAQ section to find answers to your questions',
      faqLink: 'View FAQ',
    },
  };

  const lang = content[currentLang];

  return (
    <section className="bg-surface py-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* ── Header ── */}
        <div className="section-header mb-16">
          <h1>{lang.pageTitle}</h1>
          <p>{lang.pageDescription}</p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left — Contact Info */}
          <div>
            <h2 className="text-h2 text-ink mb-8">{lang.contactInfo}</h2>

            <div className="space-y-4">
              {/* Email — blue tint */}
              <div
                className={`flex items-start gap-4 p-5 rounded-lg bg-blue-50 border border-blue-100 ${
                  isRTL ? 'flex-row-reverse text-right' : ''
                }`}
              >
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-small font-semibold text-ink mb-1">{lang.email}</h3>
                  <a
                    href="mailto:amenbank@amenbank.com.tn"
                    className="text-small text-blue-800 hover:text-blue-600 font-medium transition-colors"
                  >
                    amenbank@amenbank.com.tn
                  </a>
                </div>
              </div>

              {/* Phone — cyan tint */}
              <div
                className={`flex items-start gap-4 p-5 rounded-lg bg-cyan-50 border border-cyan-100 ${
                  isRTL ? 'flex-row-reverse text-right' : ''
                }`}
              >
                <Phone className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-small font-semibold text-ink mb-1">{lang.phone}</h3>
                  <div className="space-y-0.5">
                    <a
                      href="tel:+21671833517"
                      className="block text-small text-cyan-700 hover:text-cyan-900 font-medium transition-colors"
                    >
                      +216 71 833 517
                    </a>
                    <a
                      href="tel:+21671148000"
                      className="block text-small text-cyan-700 hover:text-cyan-900 font-medium transition-colors"
                    >
                      +216 71 148 000
                    </a>
                  </div>
                </div>
              </div>

              {/* Address — purple tint */}
              <div
                className={`flex items-start gap-4 p-5 rounded-lg bg-purple-50 border border-purple-100 ${
                  isRTL ? 'flex-row-reverse text-right' : ''
                }`}
              >
                <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-small font-semibold text-ink mb-1">{lang.address}</h3>
                  <p className="text-small text-ink-secondary">
                    Avenue Mohamed V, 1002 Tunis, Tunisia
                  </p>
                </div>
              </div>

              {/* Hours — green tint */}
              <div
                className={`flex items-start gap-4 p-5 rounded-lg bg-primary-50 border border-primary-100 ${
                  isRTL ? 'flex-row-reverse text-right' : ''
                }`}
              >
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-small font-semibold text-ink mb-1">{lang.hours}</h3>
                  <p className="text-small text-ink-secondary">{lang.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <h3 className="text-h4 text-ink mb-4">{lang.location}</h3>
              <div className="bg-surface-alt border border-border rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-ink-muted mx-auto mb-2" />
                  <p className="text-small text-ink-muted">Leaflet Map</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <div className="card">
              <h2 className="text-h2 text-ink mb-2">{lang.formTitle}</h2>
              <p className="text-ink-secondary mb-8 leading-relaxed">{lang.formDesc}</p>

              {/* Success Alert */}
              {submitted && (
                <div
                  className={`flex items-start gap-3 p-4 mb-6 rounded-lg bg-primary-50 border border-primary-100 ${
                    isRTL ? 'flex-row-reverse text-right' : ''
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-small font-semibold text-ink">{lang.success}</p>
                    <p className="text-small text-ink-secondary mt-0.5">{lang.successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-small font-semibold text-ink mb-2">
                    {lang.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder={lang.name}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-small font-semibold text-ink mb-2">
                    {lang.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-small font-semibold text-ink mb-2">
                    {lang.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-small font-semibold text-ink mb-2">
                    {lang.subject}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">{lang.subject}</option>
                    {lang.subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-small font-semibold text-ink mb-2">
                    {lang.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder={lang.message}
                  />
                </div>

                {/* Submit — primary solid green, full width */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-full"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {lang.send}...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {lang.send}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── FAQ CTA ── */}
        <div
          className={`bg-secondary-50 border border-secondary-100 rounded-lg p-10 text-center ${
            isRTL ? 'text-right' : ''
          }`}
        >
          <h3 className="text-h3 text-ink mb-3">{lang.faqTitle}</h3>
          <p className="text-ink-secondary mb-6 max-w-lg mx-auto leading-relaxed">
            {lang.faqDesc}
          </p>
          <Link
            href={`/${currentLang}/faq`}
            className={`btn btn-outline inline-flex ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {lang.faqLink}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}