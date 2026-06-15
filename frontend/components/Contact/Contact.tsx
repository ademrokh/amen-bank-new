'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export default function Contact() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Extract current language
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const content = {
    fr: {
      pageTitle: 'Nous Contacter',
      pageDescription: 'Une question ? Notre équipe est à votre écoute 24h/24, 7j/7',
      contactInfo: 'Coordonnées',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      hours: 'Horaires d\'ouverture',
      formTitle: 'Formulaire de Contact',
      formDesc: 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures',
      name: 'Nom complet',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      success: 'Message envoyé avec succès !',
      successMsg: 'Merci pour votre message. Nous vous répondrons dans les 24 heures.',
      location: 'Localisation',
      workingHours: 'Lun-Ven: 8:00-17:00 | Sam: 9:00-12:00',
      subjects: ['Général', 'Support Client', 'Demande de Crédit', 'Plainte', 'Autre'],
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
      formDesc: 'Fill out the form below and we\'ll get back to you within 24 hours',
      name: 'Full Name',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      success: 'Message sent successfully!',
      successMsg: 'Thank you for your message. We\'ll get back to you within 24 hours.',
      location: 'Location',
      workingHours: 'Mon-Fri: 8:00-17:00 | Sat: 9:00-12:00',
      subjects: ['General', 'Customer Support', 'Loan Request', 'Complaint', 'Other'],
    },
  };

  const lang = content[currentLang];

  return (
    <section className={`py-20 bg-gradient-to-b from-white to-slate-50 ${isRTL ? 'dir-rtl' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{lang.pageTitle}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{lang.pageDescription}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Contact Information */}
          <div className={isRTL ? 'lg:col-start-2' : ''}>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{lang.contactInfo}</h2>

            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Email */}
              <div className={`flex items-start gap-4 p-6 rounded-xl bg-blue-50 border border-blue-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-8 h-8 text-blue-900 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{lang.email}</h3>
                  <a href="mailto:amenbank@amenbank.com.tn" className="text-blue-900 hover:text-blue-700 font-medium">
                    amenbank@amenbank.com.tn
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className={`flex items-start gap-4 p-6 rounded-xl bg-cyan-50 border border-cyan-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-8 h-8 text-cyan-700 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{lang.phone}</h3>
                  <div className="space-y-1">
                    <a href="tel:+21671833517" className="block text-cyan-700 hover:text-cyan-900 font-medium">
                      +216 71 833 517
                    </a>
                    <a href="tel:+21671148000" className="block text-cyan-700 hover:text-cyan-900 font-medium">
                      +216 71 148 000
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className={`flex items-start gap-4 p-6 rounded-xl bg-purple-50 border border-purple-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-8 h-8 text-purple-900 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{lang.address}</h3>
                  <p className="text-slate-700">Avenue Mohamed V, 1002 Tunis, Tunisia</p>
                </div>
              </div>

              {/* Hours */}
              <div className={`flex items-start gap-4 p-6 rounded-xl bg-green-50 border border-green-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-8 h-8 text-green-700 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{lang.hours}</h3>
                  <p className="text-slate-700">{lang.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{lang.location}</h3>
              <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl h-64 flex items-center justify-center border border-slate-300">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 font-medium">Leaflet Map</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className={isRTL ? 'lg:col-start-1' : ''}>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{lang.formTitle}</h2>
              <p className="text-slate-600 mb-8">{lang.formDesc}</p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">{lang.success}</p>
                    <p className="text-sm text-green-700">{lang.successMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{lang.name}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder={lang.name}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{lang.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{lang.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{lang.subject}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all ${isRTL ? 'text-right' : ''}`}
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
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{lang.message}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all resize-none ${isRTL ? 'text-right' : ''}`}
                    placeholder={lang.message}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {currentLang === 'fr'
              ? 'Questions Fréquemment Posées'
              : currentLang === 'ar'
              ? 'الأسئلة الشائعة'
              : 'Frequently Asked Questions'}
          </h3>
          <p className="text-slate-600 mb-6">
            {currentLang === 'fr'
              ? 'Consultez notre section FAQ pour trouver des réponses à vos questions'
              : currentLang === 'ar'
              ? 'تحقق من قسم الأسئلة الشائعة للعثور على إجابات لأسئلتك'
              : 'Check our FAQ section to find answers to your questions'}
          </p>
          <a
            href={`/${currentLang}/faq`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {currentLang === 'fr' ? 'Voir la FAQ' : currentLang === 'ar' ? 'عرض الأسئلة' : 'View FAQ'}
          </a>
        </div>
      </div>
    </section>
  );
}
