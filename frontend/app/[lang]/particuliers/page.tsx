'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Smartphone, ShieldCheck, Zap, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

/* Stripe mapping: product index → design-system stripe class */
const PRODUCT_STRIPES = [
  'card-stripe-blue',
  'card-stripe-green',
  'card-stripe-accent',
  'card-stripe-blue',
];

const ADVANTAGE_ICONS = [ShieldCheck, Smartphone, Zap, Globe];

export default function ParticuliersPage() {
  const { lang, isRTL } = useLang();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const content = {
    fr: {
      label: 'Particuliers',
      title: 'Solutions Bancaires pour Particuliers',
      subtitle: 'Gestion financière complète et sécurisée',
      productsHeading: 'Nos Produits',
      advantagesHeading: 'Nos Avantages',
      products: [
        {
          title: 'Comptes Chèques',
          desc: 'Comptes courants flexibles avec une multitude de services',
          features: [
            'Cartes bancaires',
            'Chéquiers',
            'Virements nationaux et internationaux',
            'Mobile Banking',
          ],
        },
        {
          title: 'Épargne & Placements',
          desc: "Produits d'épargne pour développer votre patrimoine",
          features: [
            "Comptes d'épargne",
            'Certificats de placement',
            'Assurance-vie',
            'SICAV',
          ],
        },
        {
          title: 'Crédits',
          desc: 'Financement adapté à vos besoins',
          features: [
            'Crédit immobilier',
            'Crédit automobile',
            'Crédit à la consommation',
            'Overdraft',
          ],
        },
        {
          title: 'Amen First Bank',
          desc: 'Services premium pour une gestion enrichie',
          features: [
            'Gestionnaire privé',
            'Services concierge',
            'Accès lounge',
            'Conditions préférentielles',
          ],
        },
      ],
      advantages: [
        { title: 'Sécurisé', desc: 'Chiffrement 256-bit et authentification multi-facteurs' },
        { title: 'Mobile First', desc: 'Application mobile complète disponible 24h/24' },
        { title: 'Rapide', desc: 'Transactions instantanées et approvals rapides' },
        { title: 'Global', desc: 'Accès international avec les meilleures devises' },
      ],
      amenPay: {
        badge: 'Mobile Payment',
        title: 'AmenPay',
        platforms: 'Disponible sur iOS et Android',
        cta: 'Télécharger AmenPay',
        popupTitle: 'Choisissez votre plateforme',
      },
      ctaTitle: 'Prêt à commencer ?',
      ctaDesc: "Ouvrez votre compte dès aujourd'hui et bénéficiez de tous nos services",
      ctaBtn: 'Ouvrir un compte',
    },
    en: {
      label: 'Retail',
      title: 'Banking Solutions for Individuals',
      subtitle: 'Complete and secure financial management',
      productsHeading: 'Our Products',
      advantagesHeading: 'Our Advantages',
      products: [
        {
          title: 'Checking Accounts',
          desc: 'Flexible current accounts with multiple services',
          features: [
            'Debit cards',
            'Checkbooks',
            'National & international transfers',
            'Mobile Banking',
          ],
        },
        {
          title: 'Savings & Investments',
          desc: 'Savings products to grow your wealth',
          features: [
            'Savings accounts',
            'Placement certificates',
            'Life insurance',
            'SICAV',
          ],
        },
        {
          title: 'Loans',
          desc: 'Financing tailored to your needs',
          features: [
            'Home loans',
            'Auto loans',
            'Personal loans',
            'Overdraft',
          ],
        },
        {
          title: 'Amen First Bank',
          desc: 'Premium services for enhanced management',
          features: [
            'Private manager',
            'Concierge services',
            'Lounge access',
            'Preferential rates',
          ],
        },
      ],
      advantages: [
        { title: 'Secure', desc: '256-bit encryption and multi-factor authentication' },
        { title: 'Mobile First', desc: 'Complete mobile app available 24/7' },
        { title: 'Fast', desc: 'Instant transactions and quick approvals' },
        { title: 'Global', desc: 'International access with best exchange rates' },
      ],
      amenPay: {
        badge: 'Mobile Payment',
        title: 'AmenPay',
        platforms: 'Available on iOS and Android',
        cta: 'Download AmenPay',
        popupTitle: 'Choose your platform',
      },
      ctaTitle: 'Ready to get started?',
      ctaDesc: 'Open your account today and enjoy all our services',
      ctaBtn: 'Open Account',
    },
    ar: {
      label: 'للأفراد',
      title: 'الحلول المصرفية للأفراد',
      subtitle: 'الإدارة المالية الكاملة والآمنة',
      productsHeading: 'منتجاتنا',
      advantagesHeading: 'مميزاتنا',
      products: [
        {
          title: 'حسابات جارية',
          desc: 'حسابات جارية مرنة مع عدد من الخدمات',
          features: [
            'بطاقات الخصم',
            'دفاتر الشيكات',
            'التحويلات الوطنية والدولية',
            'البنوك الجوال',
          ],
        },
        {
          title: 'الادخار والاستثمارات',
          desc: 'منتجات الادخار لتنمية ثروتك',
          features: [
            'حسابات الادخار',
            'شهادات الاستثمار',
            'التأمين على الحياة',
            'صناديق الاستثمار',
          ],
        },
        {
          title: 'القروض',
          desc: 'التمويل المناسب لاحتياجاتك',
          features: [
            'قروض عقارية',
            'قروض سيارات',
            'قروض شخصية',
            'رصيد سلبي',
          ],
        },
        {
          title: 'بنك آمن فيرست',
          desc: 'خدمات متميزة للإدارة المتقدمة',
          features: [
            'مدير خاص',
            'خدمات كونسيرج',
            'وصول الصالة',
            'أسعار تفضيلية',
          ],
        },
      ],
      advantages: [
        { title: 'آمن', desc: 'التشفير 256-bit والمصادقة متعددة العوامل' },
        { title: 'الجوال أولاً', desc: 'تطبيق جوال كامل متاح 24/7' },
        { title: 'سريع', desc: 'معاملات فورية والموافقات السريعة' },
        { title: 'عالمي', desc: 'الوصول الدولي بأفضل أسعار صرف' },
      ],
      amenPay: {
        badge: 'Mobile Payment',
        title: 'AmenPay',
        platforms: 'متاح على iOS و Android',
        cta: 'تحميل AmenPay',
        popupTitle: 'اختر نظام التشغيل',
      },
      ctaTitle: 'هل أنت مستعد للبدء؟',
      ctaDesc: 'افتح حسابك اليوم والاستفادة من جميع خدماتنا',
      ctaBtn: 'فتح حساب',
    },
  };

  const d = content[lang as Language];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — section-lg for proper hero spacing
          ════════════════════════════════════════════ */}
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Amen Bank · {d.label}
          </span>
          <h1 className="text-[2.5rem] sm:text-display text-white mt-3 mb-5">
            {d.title}
          </h1>
          <p className="text-xl max-w-3xl leading-relaxed" style={{ color: '#94a3b8' }}>
            {d.subtitle}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRODUCTS — Standard section spacing
          ════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.productsHeading}</span>
            <h2 className="text-h2 text-ink">{d.productsHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {d.products.map((product, idx) => (
              <div key={product.title} className={`card ${PRODUCT_STRIPES[idx]}`}>
                <h3 className="text-h4 text-ink mb-2">{product.title}</h3>
                <p className="text-small text-[#64748b] leading-relaxed mb-6">
                  {product.desc}
                </p>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className={`flex items-center gap-3 text-small text-[#64748b] ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          ADVANTAGES — Smaller section spacing
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.advantagesHeading}</span>
            <h2 className="text-h2 text-ink">{d.advantagesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.advantages.map((adv, idx) => {
              const Icon = ADVANTAGE_ICONS[idx];
              return (
                <div key={adv.title} className="card text-center">
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7 mx-auto text-primary" />
                  </div>
                  <h3 className="text-h4 text-ink mt-5 mb-2">{adv.title}</h3>
                  <p className="text-small text-[#64748b] leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AMENPAY STRIP — compact, matches Hero's strip
          ════════════════════════════════════════════ */}
      <section id="amenpay" style={{ background: '#003DA5', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '1.75rem' }}>
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <Smartphone size={20} color="#ffffff" />
              </div>
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.125rem' }}>
                  {d.amenPay.badge}
                </p>
                <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>{d.amenPay.title}</p>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>{d.amenPay.platforms}</p>
              </div>
            </div>

            {/* Button that triggers popup */}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="btn btn-lg"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', background: '#ffffff', color: '#003DA5',
                borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9375rem',
                whiteSpace: 'nowrap', flexShrink: 0,
                cursor: 'pointer', border: 'none',
              }}
            >
              {d.amenPay.cta}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA — Standard section spacing to overcome button height
          ════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container max-w-5xl">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-10 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'md:text-right' : 'md:text-left'} text-center`}>
              <h2 className="text-h2 text-white mb-2">{d.ctaTitle}</h2>
              <p className="text-lg leading-relaxed" style={{ color: '#94a3b8' }}>
                {d.ctaDesc}
              </p>
            </div>
            <div className="shrink-0">
              <Link href={`/${lang}/devenir-client`} className="btn btn-primary btn-lg inline-flex" style={{ color: '#ffffff', textDecoration: 'none', background: '#006B3C' }}>
                {d.ctaBtn}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AMENPAY POPUP MODAL
          ════════════════════════════════════════════ */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
              style={{ color: '#94a3b8' }}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#eff6ff' }}>
                <Smartphone size={28} style={{ color: '#003DA5' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: '#0f172a' }}>
                {d.amenPay.popupTitle}
              </h3>
            </div>

            {/* Spacious container for App Store and Play Store badges */}
            <div
              className="flex flex-col gap-6 rounded-xl"
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.amen.projects.amenpay&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center transition-transform hover:scale-105"
              >
                <Image
                  src="https://en.logodownload.org/wp-content/uploads/2019/06/get-it-on-google-play-badge-1.png"
                  alt="Get it on Google Play"
                  width={135}
                  height={48}
                  unoptimized
                  className="h-12 w-auto object-contain"
                />
              </a>
              <a
                href="https://apps.apple.com/tn/app/amenpay/id1528149293"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/3840px-Download_on_the_App_Store_Badge.svg.png"
                  alt="Download on the App Store"
                  width={135}
                  height={48}
                  unoptimized
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}