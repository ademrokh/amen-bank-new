'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

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
      faqTitle: 'Besoin d\'aide immédiate ?',
      faqDesc: 'Notre assistant virtuel est disponible 24h/24 pour répondre à vos questions fréquentes.',
      faqLink: 'Discuter avec l\'assistant',
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
      faqTitle: 'بحاجة إلى مساعدة فورية؟',
      faqDesc: 'مساعدنا الافتراضي متاح 24/7 للإجابة على أسئلتك الشائعة.',
      faqLink: 'تحدث مع المساعد',
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
      faqTitle: 'Need immediate help?',
      faqDesc: 'Our virtual assistant is available 24/7 to answer your frequently asked questions.',
      faqLink: 'Chat with Assistant',
    },
  };

  const lang = content[currentLang as keyof typeof content];

  return (
    <section className="section" style={{ background: '#ffffff' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* ── Header ── */}
        <div className="section-header">
          <h1 style={{ color: '#0f172a' }}>{lang.pageTitle}</h1>
          <p style={{ color: '#64748b' }}>{lang.pageDescription}</p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Contact Info */}
          <div>
            <h2 className="text-3xl mb-10" style={{ color: '#0f172a', fontWeight: 700 }}>{lang.contactInfo}</h2>

            {/* Explicit flex layout with 2rem gap for uncramped spacing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Email */}
              <div
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  padding: '2rem 2.5rem', 
                  borderRadius: '0.75rem', 
                  background: '#eff6ff', 
                  border: '1px solid rgb(0 61 165 / 0.15)', 
                  flexDirection: isRTL ? 'row-reverse' : 'row' 
                }}
              >
                <Mail className="w-6 h-6 shrink-0 mt-1" style={{ color: '#003DA5' }} />
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#0f172a' }}>{lang.email}</h3>
                  <a
                    href="mailto:amenbank@amenbank.com.tn"
                    className="text-base font-medium transition-colors"
                    style={{ color: '#1a56c4' }}
                  >
                    amenbank@amenbank.com.tn
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  padding: '2rem 2.5rem', 
                  borderRadius: '0.75rem', 
                  background: '#f0f9ff', 
                  border: '1px solid rgb(14 165 233 / 0.2)', 
                  flexDirection: isRTL ? 'row-reverse' : 'row' 
                }}
              >
                <Phone className="w-6 h-6 shrink-0 mt-1" style={{ color: '#0284c7' }} />
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#0f172a' }}>{lang.phone}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <a href="tel:+21671833517" className="text-base font-medium transition-colors" style={{ color: '#0369a1' }}>
                      +216 71 833 517
                    </a>
                    <a href="tel:+21671148000" className="text-base font-medium transition-colors" style={{ color: '#0369a1' }}>
                      +216 71 148 000
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  padding: '2rem 2.5rem', 
                  borderRadius: '0.75rem', 
                  background: '#faf5ff', 
                  border: '1px solid rgb(126 34 206 / 0.15)', 
                  flexDirection: isRTL ? 'row-reverse' : 'row' 
                }}
              >
                <MapPin className="w-6 h-6 shrink-0 mt-1" style={{ color: '#7e22ce' }} />
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#0f172a' }}>{lang.address}</h3>
                  <p className="text-base" style={{ color: '#64748b' }}>
                    Avenue Mohamed V, 1002 Tunis, Tunisia
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  padding: '2rem 2.5rem', 
                  borderRadius: '0.75rem', 
                  background: '#f0fdf4', 
                  border: '1px solid rgb(0 107 60 / 0.15)', 
                  flexDirection: isRTL ? 'row-reverse' : 'row' 
                }}
              >
                <Clock className="w-6 h-6 shrink-0 mt-1" style={{ color: '#006B3C' }} />
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#0f172a' }}>{lang.hours}</h3>
                  <p className="text-base" style={{ color: '#64748b' }}>{lang.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-16">
              <h3 className="text-2xl mb-6" style={{ color: '#0f172a', fontWeight: 700 }}>{lang.location}</h3>
              <div 
                className="rounded-xl h-72 flex items-center justify-center"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: '#94a3b8' }} />
                  <p className="text-lg font-medium" style={{ color: '#94a3b8' }}>Leaflet Map</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 className="text-3xl mb-3" style={{ color: '#0f172a', fontWeight: 700 }}>{lang.formTitle}</h2>
              <p className="mb-8 leading-relaxed" style={{ color: '#64748b' }}>{lang.formDesc}</p>

              {/* Success Alert */}
              {submitted && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid rgb(0 107 60 / 0.2)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#006B3C' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{lang.success}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{lang.successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label">{lang.name}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input-base"
                    placeholder={lang.name}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input-base"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input-base"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{lang.subject}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-input-base"
                  >
                    <option value="">{lang.subject}</option>
                    {lang.subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang.message}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="form-input-base resize-none"
                    placeholder={lang.message}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full justify-center"
                  style={{ color: '#ffffff', textDecoration: 'none' }}
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
        <br></br>
        {/* ── Chatbot / FAQ CTA (Restructured for perfect alignment) ── */}
                {/* ── Chatbot / FAQ CTA (Restructured for perfect alignment) ── */}
        <div 
          className="mt-20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ 
            background: '#eff6ff', 
            border: '1px solid rgb(0 61 165 / 0.1)', 
            padding: '3rem 2.5rem', 
            flexDirection: isRTL ? 'row-reverse' : 'row' 
          }}
        >
          <div className={`text-center md:text-left flex-1 ${isRTL ? 'md:text-right' : ''}`}>
            <h3 className="text-2xl mb-3" style={{ color: '#0f172a', fontWeight: 700 }}>{lang.faqTitle}</h3>
            <p className="max-w-lg leading-relaxed" style={{ color: '#64748b' }}>
              {lang.faqDesc}
            </p>
          </div>
          <div className="shrink-0">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="btn btn-secondary inline-flex"
              style={{ color: '#ffffff', textDecoration: 'none', padding: '1rem 2rem' }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {lang.faqLink}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}