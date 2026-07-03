'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import jsPDF from 'jspdf';

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

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftMargin = 12;
    const rightMargin = 12;
    const maxWidth = pageWidth - leftMargin - rightMargin;
    let yPosition = 10;

    // Colors
    const primaryGreen: [number, number, number] = [0, 107, 60];
    const darkGreen: [number, number, number] = [0, 80, 40];
    const accentBlue: [number, number, number] = [0, 61, 165];
    const textDark: [number, number, number] = [15, 23, 42];
    const textMuted: [number, number, number] = [100, 120, 139];
    const lightGray: [number, number, number] = [248, 250, 252];
    const borderGray: [number, number, number] = [226, 232, 240];
    const warningOrange: [number, number, number] = [255, 152, 0];

    // Language content
    const pdfContent = {
      fr: {
        title: 'FORMULAIRE DE DEMANDE CLIENT',
        tagline: 'Votre partenaire financier de confiance depuis 1980',
        badge: 'FORMULAIRE OFFICIEL',
        reference: 'Référence:',
        date: 'Date:',
        status: 'Statut: EN ATTENTE',
        version: 'Version du formulaire: 2.1',
        applicantInfo: 'INFORMATIONS DU DEMANDEUR',
        fullName: 'Nom complet',
        email: 'Adresse e-mail',
        phone: 'Numéro de téléphone',
        accountType: 'Type de compte',
        additionalInfo: 'INFORMATIONS SUPPLÉMENTAIRES',
        termsText: 'Ce formulaire est confidentiel et réservé à usage officiel. Vos données seront traitées conformément à notre politique de confidentialité et à la réglementation applicable.',
        address: 'Amen Bank • 50, Avenue Mohamed V • Tunis 1002',
        phone2: 'Téléphone: +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'Non spécifié',
      },
      en: {
        title: 'CLIENT APPLICATION FORM',
        tagline: 'Your Trusted Financial Partner Since 1980',
        badge: 'OFFICIAL FORM',
        reference: 'Reference:',
        date: 'Date:',
        status: 'Status: PENDING',
        version: 'Form Version: 2.1',
        applicantInfo: 'APPLICANT INFORMATION',
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        accountType: 'Account Type',
        additionalInfo: 'ADDITIONAL INFORMATION',
        termsText: 'This form is confidential and for official use only. Your data will be processed in accordance with our Privacy Policy and applicable regulations.',
        address: 'Amen Bank • 50, Avenue Mohamed V • Tunis 1002',
        phone2: 'Phone: +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'Not specified',
      },
      ar: {
        title: 'نموذج طلب العميل',
        tagline: 'شريكك المالي الموثوق منذ عام 1980',
        badge: 'النموذج الرسمي',
        reference: 'المرجع:',
        date: 'التاريخ:',
        status: 'الحالة: قيد الانتظار',
        version: 'إصدار النموذج: 2.1',
        applicantInfo: 'معلومات المتقدم',
        fullName: 'الاسم الكامل',
        email: 'عنوان البريد الإلكتروني',
        phone: 'رقم الهاتف',
        accountType: 'نوع الحساب',
        additionalInfo: 'معلومات إضافية',
        termsText: 'هذا النموذج سري وللاستخدام الرسمي فقط. سيتم معالجة بياناتك وفقاً لسياسة الخصوصية الخاصة بنا والأنظمة المعمول بها.',
        address: 'بنك آمن • 50 شارع محمد الخامس • تونس 1002',
        phone2: 'الهاتف: +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'غير محدد',
      },
    };

    const content = pdfContent[lang];
    const isRTL = lang === 'ar';

    // ════════════════════════════════════════════════════════
    // HEADER SECTION
    // ════════════════════════════════════════════════════════
    
    // Green background
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.rect(0, 0, pageWidth, 48, 'F');

    // Bank name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('AMEN BANK', leftMargin, 16);

    // Form title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(content.title, leftMargin, 26);

    // Tagline
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(200, 220, 210);
    doc.text(content.tagline, leftMargin, 31);

    // Badge
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('✓ ' + content.badge, leftMargin, 36);

    // Blue accent bar
    doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.rect(0, 48, pageWidth, 3.5, 'F');

    yPosition = 56;

    // ════════════════════════════════════════════════════════
    // METADATA SECTION
    // ════════════════════════════════════════════════════════

    const appRef = `APP-${Date.now().toString().slice(-8)}`;
    const today = new Date();
    const dateStr = isRTL 
      ? today.toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' })
      : today.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Left side: Reference and Date
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${content.reference} ${appRef}`, leftMargin, yPosition);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`${content.date} ${dateStr}`, leftMargin, yPosition + 6);

    // Right side: Status and Version
    doc.setTextColor(accentBlue[0], accentBlue[1], accentBlue[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(content.status, pageWidth - rightMargin - 50, yPosition);
    
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(content.version, pageWidth - rightMargin - 50, yPosition + 6);

    yPosition += 16;

    // ════════════════════════════════════════════════════════
    // APPLICANT INFORMATION SECTION
    // ════════════════════════════════════════════════════════

    // Section header
    doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.rect(leftMargin, yPosition - 2, maxWidth, 7, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(content.applicantInfo, leftMargin + 2, yPosition + 2);

    yPosition += 10;

    // Fields table
    const fields = [
      { label: content.fullName, value: formData.fullName || '—' },
      { label: content.email, value: formData.email || '—' },
      { label: content.phone, value: formData.phone || '—' },
      { label: content.accountType, value: formData.accountType || content.notSpecified },
    ];

    fields.forEach((field, idx) => {
      const rowHeight = 8;
      
      // Alternating row background
      if (idx % 2 === 0) {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(leftMargin, yPosition - 1, maxWidth, rowHeight, 'F');
      }

      // Row border
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.3);
      doc.rect(leftMargin, yPosition - 1, maxWidth, rowHeight, 'S');

      // Label (colored)
      doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${field.label}:`, leftMargin + 2, yPosition + 2);

      // Value
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(field.value, leftMargin + 50, yPosition + 2);

      yPosition += rowHeight;
    });

    yPosition += 4;

    // ════════════════════════════════════════════════════════
    // ADDITIONAL INFORMATION (if present)
    // ════════════════════════════════════════════════════════

    if (formData.message && formData.message.trim()) {
      doc.setFillColor(accentBlue[0], accentBlue[1], accentBlue[2]);
      doc.rect(leftMargin, yPosition - 2, maxWidth, 7, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(content.additionalInfo, leftMargin + 2, yPosition + 2);

      yPosition += 10;

      // Message box
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.5);
      doc.setFillColor(248, 255, 248);
      
      const messageLines = doc.splitTextToSize(formData.message, maxWidth - 4);
      const messageHeight = Math.max(12, messageLines.length * 4.5 + 2);
      
      doc.rect(leftMargin, yPosition, maxWidth, messageHeight, 'FD');

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(messageLines, leftMargin + 2, yPosition + 3);

      yPosition += messageHeight + 3;
    }

    yPosition += 3;

    // ════════════════════════════════════════════════════════
    // CONFIDENTIALITY BANNER
    // ════════════════════════════════════════════════════════

    doc.setFillColor(255, 243, 224);
    doc.setDrawColor(warningOrange[0], warningOrange[1], warningOrange[2]);
    doc.setLineWidth(0.8);
    doc.rect(leftMargin, yPosition, maxWidth, 12, 'FD');

    doc.setTextColor(178, 75, 0);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    
    const termsLines = doc.splitTextToSize(content.termsText, maxWidth - 4);
    doc.text(termsLines, leftMargin + 2, yPosition + 2);

    yPosition += 15;

    // ════════════════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════════════════

    const footerStartY = pageHeight - 18;

    // Divider line
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, footerStartY - 1, pageWidth - rightMargin, footerStartY - 1);

    // Contact info
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(content.address, leftMargin, footerStartY + 3);
    doc.text(`${content.phone2} | ${content.web}`, leftMargin, footerStartY + 7);

    // Bottom info line
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${lang === 'fr' ? 'Confidentiel' : lang === 'ar' ? 'سري' : 'Confidential'} • ${appRef} • ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}`,
      leftMargin,
      footerStartY + 11
    );

    // ════════════════════════════════════════════════════════
    // SAVE PDF
    // ════════════════════════════════════════════════════════

    const langSuffix = lang === 'fr' ? '_FR' : lang === 'ar' ? '_AR' : '_EN';
    const fileName = `Amen_Bank_Application_${appRef}${langSuffix}.pdf`;
    doc.save(fileName);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, message: '' });

    try {
      // Generate PDF first (now async)
      await generatePDF();

      // Then submit to API
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