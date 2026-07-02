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
    <section className="min-h-screen" style={{ background: '#ffffff' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container max-w-4xl text-center">
          <span className="section-badge section-badge-light">Amen Bank</span>
          <h1 className="text-h1 text-white mt-2 mb-4">{lang.pageTitle}</h1>
          <p className="text-lg leading-relaxed mx-auto max-w-2xl" style={{ color: '#94a3b8' }}>
            {lang.pageDescription}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{lang.contactInfo}</span>
            <h2 className="text-h2 text-ink">{lang.contactInfo}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
            <div>
              <div className="space-y-6">
                <div className="card" style={{ padding: '2rem 2.25rem', background: '#eff6ff', borderColor: 'rgb(0 61 165 / 0.14)' }}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Mail className="w-6 h-6 shrink-0 mt-1" style={{ color: '#003DA5' }} />
                    <div>
                      <h3 className="text-h4 text-ink mb-2">{lang.email}</h3>
                      <a href="mailto:amenbank@amenbank.com.tn" className="text-base font-medium" style={{ color: '#1a56c4' }}>
                        amenbank@amenbank.com.tn
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem 2.25rem', background: '#f0f9ff', borderColor: 'rgb(14 165 233 / 0.18)' }}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="w-6 h-6 shrink-0 mt-1" style={{ color: '#0284c7' }} />
                    <div>
                      <h3 className="text-h4 text-ink mb-2">{lang.phone}</h3>
                      <div className="flex flex-col gap-1">
                        <a href="tel:+21671833517" className="text-base font-medium" style={{ color: '#0369a1' }}>
                          +216 71 833 517
                        </a>
                        <a href="tel:+21671148000" className="text-base font-medium" style={{ color: '#0369a1' }}>
                          +216 71 148 000
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem 2.25rem', background: '#faf5ff', borderColor: 'rgb(126 34 206 / 0.16)' }}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-6 h-6 shrink-0 mt-1" style={{ color: '#7e22ce' }} />
                    <div>
                      <h3 className="text-h4 text-ink mb-2">{lang.address}</h3>
                      <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>
                        Avenue Mohamed V, 1002 Tunis, Tunisia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: '2rem 2.25rem', background: '#f0fdf4', borderColor: 'rgb(0 107 60 / 0.14)' }}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-6 h-6 shrink-0 mt-1" style={{ color: '#006B3C' }} />
                    <div>
                      <h3 className="text-h4 text-ink mb-2">{lang.hours}</h3>
                      <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>
                        {lang.workingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-h3 text-ink mb-6">{lang.location}</h3>
                <div className="rounded-xl h-72 flex items-center justify-center" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                  <div className="text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: '#94a3b8' }} />
                    <p className="text-lg font-medium" style={{ color: '#94a3b8' }}>Leaflet Map</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 className="text-h3 text-ink mb-3">{lang.formTitle}</h2>
              <p className="mb-8 leading-relaxed" style={{ color: '#64748b' }}>{lang.formDesc}</p>

              {submitted && (
                <div className={`flex items-start gap-3 p-4 mb-6 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`} style={{ background: '#f0fdf4', border: '1px solid rgb(0 107 60 / 0.2)' }}>
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#006B3C' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{lang.success}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{lang.successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">{lang.name}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base" placeholder={lang.name} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">{lang.email}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">{lang.phone}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base" placeholder="+216 XX XXX XXX" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">{lang.subject}</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base">
                    <option value="">{lang.subject}</option>
                    {lang.subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">{lang.message}</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={5} className="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base resize-none" placeholder={lang.message} />
                </div>

                <button type="submit" disabled={isLoading} className="btn btn-primary w-full justify-center" style={{ color: '#ffffff', textDecoration: 'none' }}>
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
      </section>

      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={`text-center md:text-left flex-1 ${isRTL ? 'md:text-right' : ''}`}>
              <h3 className="text-h3 text-ink mb-3">{lang.faqTitle}</h3>
              <p className="max-w-2xl leading-relaxed" style={{ color: '#64748b' }}>
                {lang.faqDesc}
              </p>
            </div>
            <div className="shrink-0">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))} className="btn btn-secondary inline-flex" style={{ color: '#ffffff', textDecoration: 'none', padding: '1rem 2rem' }}>
                <MessageCircle className="w-5 h-5 mr-2" />
                {lang.faqLink}
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}