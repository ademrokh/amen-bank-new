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
    const leftMargin = 14;
    const rightMargin = 14;
    const maxWidth = pageWidth - leftMargin - rightMargin;
    let yPosition = 10;

    // ── Colors ──────────────────────────────────────────────
    const primaryGreen: [number, number, number] = [0, 107, 60];
    const darkGreen: [number, number, number] = [0, 80, 40];
    const accentBlue: [number, number, number] = [0, 61, 165];
    const textDark: [number, number, number] = [15, 23, 42];
    const textMuted: [number, number, number] = [100, 116, 139];
    const lightGray: [number, number, number] = [248, 250, 252];
    const borderGray: [number, number, number] = [226, 232, 240];
    const warningAmber: [number, number, number] = [217, 119, 6];
    const white: [number, number, number] = [255, 255, 255];

    // ── i18n ─────────────────────────────────────────────────
    const pdfContent = {
      fr: {
        title: 'FORMULAIRE DE DEMANDE CLIENT',
        tagline: 'Votre partenaire financier de confiance depuis 1980',
        badge: 'DOCUMENT OFFICIEL',
        reference: 'Référence :',
        date: 'Date :',
        status: 'Statut : EN ATTENTE DE TRAITEMENT',
        version: 'Version 2.1',
        applicantInfo: 'INFORMATIONS DU DEMANDEUR',
        fullName: 'Nom complet',
        email: 'Adresse e-mail',
        phone: 'Numéro de téléphone',
        accountType: 'Type de compte',
        additionalInfo: 'MESSAGE / INFORMATIONS SUPPLÉMENTAIRES',
        termsText:
          "Ce document est strictement confidentiel et réservé à l'usage officiel d'Amen Bank. Vos données personnelles sont traitées conformément à notre politique de confidentialité et à la législation tunisienne en vigueur.",
        address: '50, Avenue Mohamed V – Tunis 1002, Tunisie',
        phone2: 'Tél : +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'Non spécifié',
        signatureLabel: 'Signature du demandeur',
        stampLabel: 'Cachet Amen Bank',
        signatureLine: '____________________________',
      },
      en: {
        title: 'CLIENT APPLICATION FORM',
        tagline: 'Your Trusted Financial Partner Since 1980',
        badge: 'OFFICIAL DOCUMENT',
        reference: 'Reference:',
        date: 'Date:',
        status: 'Status: PENDING PROCESSING',
        version: 'Version 2.1',
        applicantInfo: 'APPLICANT INFORMATION',
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        accountType: 'Account Type',
        additionalInfo: 'MESSAGE / ADDITIONAL INFORMATION',
        termsText:
          'This document is strictly confidential and for official Amen Bank use only. Your personal data is processed in accordance with our Privacy Policy and applicable Tunisian legislation.',
        address: '50, Avenue Mohamed V – Tunis 1002, Tunisia',
        phone2: 'Tel: +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'Not specified',
        signatureLabel: 'Applicant Signature',
        stampLabel: 'Amen Bank Stamp',
        signatureLine: '____________________________',
      },
      ar: {
        title: 'نموذج طلب العميل',
        tagline: 'شريكك المالي الموثوق منذ عام 1980',
        badge: 'وثيقة رسمية',
        reference: 'المرجع:',
        date: 'التاريخ:',
        status: 'الحالة: قيد المعالجة',
        version: 'الإصدار 2.1',
        applicantInfo: 'معلومات المتقدم',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        accountType: 'نوع الحساب',
        additionalInfo: 'الرسالة / معلومات إضافية',
        termsText:
          'هذه الوثيقة سرية للغاية ومخصصة للاستخدام الرسمي لبنك آمن فقط. تتم معالجة بياناتك الشخصية وفقاً لسياسة الخصوصية والتشريعات التونسية المعمول بها.',
        address: '50 شارع محمد الخامس – تونس 1002، تونس',
        phone2: 'هاتف: +216 71 833 517',
        web: 'www.amenbank.com.tn',
        notSpecified: 'غير محدد',
        signatureLabel: 'توقيع المتقدم',
        stampLabel: 'ختم بنك آمن',
        signatureLine: '____________________________',
      },
    };

    const content = pdfContent[lang];

    // ── Fetch & embed logo ───────────────────────────────────
    let logoBase64: string | null = null;
    try {
      const proxyUrl = `https://images.weserv.nl/?url=pbs.twimg.com/profile_images/842261819330842624/PrmnR9ug_400x400.jpg&output=jpg&w=200`;
      const resp = await fetch(proxyUrl);
      const blob = await resp.blob();
      logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // Logo unavailable — continue without it
    }

    // ════════════════════════════════════════════════════════
    // HEADER  (green bg, logo, name, title, tagline)
    // ════════════════════════════════════════════════════════
    const headerH = 52;

    // Green background
    doc.setFillColor(...primaryGreen);
    doc.rect(0, 0, pageWidth, headerH, 'F');

    // Logo top-left with white circle behind it
    const logoSize = 30;
    const logoPad = 11;
    if (logoBase64) {
      doc.setFillColor(...white);
      doc.circle(leftMargin + logoSize / 2, logoPad + logoSize / 2, logoSize / 2 + 1, 'F');
      doc.addImage(logoBase64, 'JPEG', leftMargin, logoPad, logoSize, logoSize);
    }

    // Text block to the right of logo
    const textX = leftMargin + logoSize + 8;

    doc.setTextColor(...white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AMEN BANK', textX, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(content.title, textX, 29);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(190, 220, 205);
    doc.text(content.tagline, textX, 36);

    // Badge top-right
    const badgeW = 44;
    const badgeH = 7;
    const badgeX = pageWidth - rightMargin - badgeW;
    doc.setFillColor(...accentBlue);
    doc.roundedRect(badgeX, 8, badgeW, badgeH, 1.5, 1.5, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`✓ ${content.badge}`, badgeX + badgeW / 2, 8 + badgeH / 2 + 1.2, { align: 'center' });

    // Thin accent stripe under header
    doc.setFillColor(...accentBlue);
    doc.rect(0, headerH, pageWidth, 2.5, 'F');

    yPosition = headerH + 10;

    // ════════════════════════════════════════════════════════
    // METADATA ROW
    // ════════════════════════════════════════════════════════
    const appRef = `APP-${Date.now().toString().slice(-8)}`;
    const today = new Date();
    const dateStr = today.toLocaleDateString(
      lang === 'ar' ? 'ar-TN' : lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

    // Left: reference + date
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text(`${content.reference} ${appRef}`, leftMargin, yPosition);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text(`${content.date} ${dateStr}`, leftMargin, yPosition + 5.5);

    // Right: status + version
    const statusX = pageWidth - rightMargin;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentBlue);
    doc.text(content.status, statusX, yPosition, { align: 'right' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text(content.version, statusX, yPosition + 5.5, { align: 'right' });

    // Thin separator
    yPosition += 13;
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
    yPosition += 6;

    // ════════════════════════════════════════════════════════
    // APPLICANT INFO SECTION
    // ════════════════════════════════════════════════════════

    // Section header bar
    doc.setFillColor(...darkGreen);
    doc.roundedRect(leftMargin, yPosition, maxWidth, 8, 1, 1, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(content.applicantInfo, leftMargin + 3, yPosition + 5.5);
    yPosition += 12;

    // Field rows
    const fields = [
      { label: content.fullName,    value: formData.fullName    || '—' },
      { label: content.email,       value: formData.email       || '—' },
      { label: content.phone,       value: formData.phone       || '—' },
      { label: content.accountType, value: formData.accountType || content.notSpecified },
    ];

    const rowH = 9;
    const labelColW = 55;

    fields.forEach((field, idx) => {
      // Zebra stripe
      if (idx % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(leftMargin, yPosition, maxWidth, rowH, 'F');
      }
      // Outer border
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.25);
      doc.rect(leftMargin, yPosition, maxWidth, rowH, 'S');

      // Vertical divider
      doc.line(leftMargin + labelColW, yPosition, leftMargin + labelColW, yPosition + rowH);

      // Label
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(field.label, leftMargin + 3, yPosition + 6);

      // Value
      doc.setTextColor(...textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(field.value, leftMargin + labelColW + 4, yPosition + 6);

      yPosition += rowH;
    });

    yPosition += 6;

    // ════════════════════════════════════════════════════════
    // OPTIONAL MESSAGE SECTION
    // ════════════════════════════════════════════════════════
    if (formData.message?.trim()) {
      doc.setFillColor(...accentBlue);
      doc.roundedRect(leftMargin, yPosition, maxWidth, 8, 1, 1, 'F');
      doc.setTextColor(...white);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(content.additionalInfo, leftMargin + 3, yPosition + 5.5);
      yPosition += 12;

      const msgLines = doc.splitTextToSize(formData.message, maxWidth - 10);
      const msgBoxH = Math.max(14, msgLines.length * 4.8 + 4);

      doc.setFillColor(240, 249, 245);
      doc.setDrawColor(...primaryGreen);
      doc.setLineWidth(0.4);
      doc.roundedRect(leftMargin, yPosition, maxWidth, msgBoxH, 1, 1, 'FD');

      // Left accent bar
      doc.setFillColor(...primaryGreen);
      doc.rect(leftMargin, yPosition, 3, msgBoxH, 'F');

      doc.setTextColor(...textDark);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(msgLines, leftMargin + 6, yPosition + 5);

      yPosition += msgBoxH + 6;
    }

    // ════════════════════════════════════════════════════════
    // SIGNATURE AREA
    // ════════════════════════════════════════════════════════
    yPosition += 4;
    const sigBoxH = 22;
    const sigColW = (maxWidth - 8) / 2;

    // Applicant signature box
    doc.setDrawColor(...borderGray);
    doc.setFillColor(...lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftMargin, yPosition, sigColW, sigBoxH, 1, 1, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textMuted);
    doc.text(content.signatureLabel, leftMargin + sigColW / 2, yPosition + 5, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 220);
    doc.text(content.signatureLine, leftMargin + sigColW / 2, yPosition + 16, { align: 'center' });

    // Bank stamp box
    const stampX = leftMargin + sigColW + 8;
    doc.setFillColor(...lightGray);
    doc.roundedRect(stampX, yPosition, sigColW, sigBoxH, 1, 1, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textMuted);
    doc.text(content.stampLabel, stampX + sigColW / 2, yPosition + 5, { align: 'center' });
    // Dotted circle placeholder for stamp
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.5);
    doc.circle(stampX + sigColW / 2, yPosition + 14, 6, 'S');

    yPosition += sigBoxH + 6;

    // ════════════════════════════════════════════════════════
    // CONFIDENTIALITY BANNER
    // ════════════════════════════════════════════════════════
    const bannerLines = doc.splitTextToSize(content.termsText, maxWidth - 22);
    const bannerH = bannerLines.length * 4.2 + 8;

    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(...warningAmber);
    doc.setLineWidth(0.5);
    doc.roundedRect(leftMargin, yPosition, maxWidth, bannerH, 1.5, 1.5, 'FD');

    // Amber left accent bar
    doc.setFillColor(...warningAmber);
    doc.rect(leftMargin, yPosition, 5, bannerH, 'F');

    doc.setTextColor(146, 64, 14);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.text(bannerLines, leftMargin + 8, yPosition + 5);

    // ════════════════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════════════════
    const footerY = pageHeight - 16;

    // Green footer bar
    doc.setFillColor(...primaryGreen);
    doc.rect(0, footerY - 3, pageWidth, 19, 'F');

    // Small logo in footer
    if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', leftMargin, footerY - 1, 11, 11);
    }

    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AMEN BANK', leftMargin + 14, footerY + 4);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(190, 220, 205);
    doc.text(
      `${content.address}  |  ${content.phone2}  |  ${content.web}`,
      leftMargin + 14,
      footerY + 9
    );

    // Right: ref + date
    doc.setFontSize(7);
    doc.setTextColor(190, 220, 205);
    doc.text(
      `${appRef} • ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}`,
      pageWidth - rightMargin,
      footerY + 4,
      { align: 'right' }
    );

    // ── Save ──────────────────────────────────────────────
    const suffix = lang === 'fr' ? '_FR' : lang === 'ar' ? '_AR' : '_EN';
    doc.save(`Amen_Bank_Application_${appRef}${suffix}.pdf`);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: null, message: '' });

    try {
      await generatePDF();

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

  const inputClasses =
    'w-full px-4 py-3.5 border border-slate-200 rounded-lg text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 text-base';
  const labelClasses = 'block text-sm font-semibold text-slate-900 mb-3';

  return (
    <main className="section" style={{ background: '#f8fafc' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">

            {/* ── Left Column: Form ── */}
            <div>
              <div
                className="section-header"
                style={{
                  textAlign: isRTL ? 'right' : 'left',
                  marginBottom: '3rem',
                  alignItems: isRTL ? 'flex-end' : 'flex-start',
                }}
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
                <br />
                <form onSubmit={handleSubmit}>
                  {page.fields.map((field) => (
                    <div key={field.name} className="mb-8">
                      <label className={labelClasses}>{field.label}</label>
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
                    <label className={labelClasses}>{page.messageLabel}</label>
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

                  {/* Buttons */}
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
              <h2
                style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}
              >
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
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9375rem',
                        lineHeight: '1.6',
                      }}
                    >
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