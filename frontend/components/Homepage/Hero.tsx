'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Zap, Shield, Building2, Cpu, Loader, Smartphone, X, Trophy, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Hero() {
  const { lang: currentLang, isRTL } = useLang();
  
  const [exchangeRates, setExchangeRates] = useState<Record<string, { toTND: number; fromTND: number }>>({
    EUR: { toTND: 3.39, fromTND: 0.295 },
    USD: { toTND: 3.17, fromTND: 0.315 },
    CAD: { toTND: 2.38, fromTND: 0.420 },
  });
  
  const [sicavValues, setSicavValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sicav');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        if (data.exchangeRates?.rates) setExchangeRates(data.exchangeRates.rates);
        if (data.sicavFunds && Array.isArray(data.sicavFunds)) {
          const fundMap: Record<string, number> = {};
          data.sicavFunds.forEach((fund: { id: string; value?: number }) => {
            if (fund.value) fundMap[fund.id] = fund.value;
          });
          setSicavValues(fundMap);
        }
        setError(false);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroContent: Record<Language, {
    headline: string;
    subheadline: string;
    exchangeRateLabel: string;
    sicavLabel: string;
    trustTitle: string;
    trustDesc: string;
    trustItems: { icon: React.ElementType; title: string; desc: string }[];
    certificationsTitle: string;
    cta1: string;
    cta2: string;
    ctaBottom: string;
    ctaBottomDesc: string;
    rateUpdate: string;
    vni: string;
    stats: { value: string; label: string }[];
    amenPay: { badge: string; title: string; desc: string; cta: string; platforms: string; popupTitle: string };
  }> = {
    fr: {
      headline: 'Votre Partenaire Financier de Confiance',
      subheadline: 'Solutions bancaires innovantes pour particuliers et entreprises depuis 1980',
      exchangeRateLabel: 'Taux de change en TND',
      sicavLabel: "Fonds d'investissement",
      trustTitle: 'Pourquoi nous faire confiance ?',
      trustDesc: "Nous nous engageons à fournir des services financiers d'excellence avec transparence et intégrité",
      certificationsTitle: 'Certifications & Standards',
      trustItems: [
        { icon: Building2, title: "40+ ans d'expérience", desc: 'Leader du secteur bancaire tunisien' },
        { icon: Shield, title: 'Sécurité garantie', desc: 'Certifications internationales et conformité stricte' },
        { icon: Cpu, title: 'Technologie moderne', desc: 'Plateforme digitale sécurisée et performante' },
      ],
      cta1: 'Ouvrir un compte',
      cta2: "Avez-vous besoin d'un prêt ?",
      ctaBottom: 'Prêt à commencer votre parcours financier ?',
      ctaBottomDesc: 'Rejoignez des milliers de clients satisfaits qui font confiance à Amen Bank',
      rateUpdate: 'Mise à jour en temps réel',
      vni: "Valeurs nettes d'inventaire (VNI)",
      stats: [
        { value: '164', label: 'Agences' },
        { value: '500K+', label: 'Clients' },
        { value: '98%', label: 'Satisfaction' },
      ],
      amenPay: {
        badge: 'Nouveau',
        title: 'Payez avec AmenPay',
        platforms: 'Disponible sur iOS et Android',
        desc: "Payez en toute simplicité avec AmenPay, l'application de mobile payment d'Amen Bank.",
        cta: 'Découvrir AmenPay',
        popupTitle: 'Choisissez votre plateforme',
      },
    },
    ar: {
      headline: 'شريكك المالي الموثوق',
      subheadline: 'حلول مصرفية مبتكرة للأفراد والشركات منذ عام 1980',
      exchangeRateLabel: 'أسعار الصرف بالدينار التونسي',
      sicavLabel: 'صناديق الاستثمار',
      trustTitle: 'لماذا تثق بنا؟',
      trustDesc: 'نلتزم بتقديم خدمات مالية ممتازة بشفافية واستقامة',
      certificationsTitle: 'الشهادات والمعايير',
      trustItems: [
        { icon: Building2, title: 'أكثر من 40 سنة من الخبرة', desc: 'رائد القطاع المصرفي التونسي' },
        { icon: Shield, title: 'أمان مضمون', desc: 'شهادات دولية والامتثال الصارم' },
        { icon: Cpu, title: 'تكنولوجيا حديثة', desc: 'منصة رقمية آمنة وفعالة' },
      ],
      cta1: 'فتح حساب',
      cta2: 'هل تحتاج إلى قرض؟',
      ctaBottom: 'هل أنت مستعد لبدء رحلتك المالية؟',
      ctaBottomDesc: 'انضم إلى آلاف العملاء الراضين الذين يثقون بـ Amen Bank',
      rateUpdate: 'تحديث في الوقت الفعلي',
      vni: 'قيم صافي الأصول',
      stats: [
        { value: '164', label: 'فرع' },
        { value: '500K+', label: 'عملاء' },
        { value: '98%', label: 'الرضا' },
      ],
      amenPay: {
        badge: 'جديد',
        title: 'ادفع مع AmenPay',
        platforms: 'متاح على iOS و Android',
        desc: 'ادفع بكل سهولة مع AmenPay، تطبيق الدفع المحمول من أمين بنك.',
        cta: 'اكتشف AmenPay',
        popupTitle: 'اختر نظام التشغيل',
      },
    },
    en: {
      headline: 'Your Trusted Financial Partner',
      subheadline: 'Innovative banking solutions for individuals and businesses since 1980',
      exchangeRateLabel: 'Exchange Rates in TND',
      sicavLabel: 'Investment Funds',
      trustTitle: 'Why Trust Us?',
      trustDesc: 'We are committed to providing excellent financial services with transparency and integrity',
      certificationsTitle: 'Certifications & Standards',
      trustItems: [
        { icon: Building2, title: '40+ Years of Experience', desc: 'Leader in Tunisian banking sector' },
        { icon: Shield, title: 'Guaranteed Security', desc: 'International certifications and strict compliance' },
        { icon: Cpu, title: 'Modern Technology', desc: 'Secure and efficient digital platform' },
      ],
      cta1: 'Open Account',
      cta2: 'Need a Loan?',
      ctaBottom: 'Ready to start your financial journey?',
      ctaBottomDesc: 'Join thousands of satisfied customers who trust Amen Bank',
      rateUpdate: 'Updated in real time',
      vni: 'Net Asset Values',
      stats: [
        { value: '164', label: 'Branches' },
        { value: '500K+', label: 'Clients' },
        { value: '98%', label: 'Satisfaction' },
      ],
      amenPay: {
        badge: 'New',
        title: 'Pay with AmenPay',
        platforms: 'Available on iOS and Android',
        desc: "Pay effortlessly with AmenPay, Amen Bank's mobile payment app.",
        cta: 'Discover AmenPay',
        popupTitle: 'Choose your platform',
      },
    },
  };

  const content = heroContent[currentLang];
  const errorMsg =
    currentLang === 'ar' ? '⚠ البيانات غير متاحة'
    : currentLang === 'en' ? '⚠ Data unavailable'
    : '⚠ Données indisponibles';

  const getFundDisplayName = (fundId: string): string => {
    const nameMap: Record<string, Record<Language, string>> = {
      'sicav-diversif':   { fr: 'Diversification', ar: 'التنويع',        en: 'Diversification' },
      'sicav-actions':    { fr: 'Actions Monde',   ar: 'الأسهم العالمية', en: 'Global Equities' },
      'sicav-obligations':{ fr: 'Obligations',     ar: 'السندات',         en: 'Bonds' },
    };
    return nameMap[fundId]?.[currentLang] ?? fundId.replace('sicav-', '').replace(/-/g, ' ');
  };

  // Mapping currency codes to symbols
  const currencySymbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    CAD: 'CA$',
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — dark, full-height, two-column
          ════════════════════════════════════════════ */}
      <section style={{ background: '#0f172a' }}>
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 items-center`} style={{ gap: '4rem' }}>

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#94a3b8',
              }}>
                Amen Bank · {currentLang === 'fr' ? 'Depuis 1980' : currentLang === 'ar' ? 'منذ 1980' : 'Since 1980'}
              </span>

              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
                color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.025em',
              }}>
                {content.headline}
              </h1>

              <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '32rem' }}>
                {content.subheadline}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '1.75rem', paddingBottom: '1.75rem',
              }}>
                {content.stats.map((stat, i) => (
                  <div key={stat.label} style={{
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    paddingLeft: i > 0 ? '1.5rem' : 0,
                    paddingRight: i < 2 ? '1.5rem' : 0,
                  }}>
                    <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                <Link href={`/${currentLang}/devenir-client`} className="btn btn-primary btn-lg">
                  {content.cta1}
                  <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                </Link>
                <Link href={`/${currentLang}/particuliers`} className="btn btn-outline btn-lg">
                  {content.cta2}
                </Link>
              </div>
            </div>

            {/* Right — glass panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Certifications */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                padding: '1.75rem',
              }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '1.25rem' }}>
                  {content.certificationsTitle}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { 
                      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi1PrlV6apvxfQ1PUBOR4fcHkRJLht-CJGDg&s', 
                      title: 'ISO 27001', 
                      sub: 'Information Security' 
                    },
                    { 
                      logo: 'https://uaexpertcorporation.com/wp-content/uploads/2021/12/iso-20000-removebg-preview.png', 
                      title: 'ISO 20000', 
                      sub: 'IT Service Management' 
                    },
                    { 
                      logo: 'https://www.staffordnet.com/img/logos/logo-pci-dss-500.png', 
                      title: 'PCI DSS', 
                      sub: 'Payment Card Security' 
                    },
                  ].map((cert) => (
                    <div key={cert.title} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{
                        width: '3rem', height: '3rem', borderRadius: '0.5rem', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#ffffff', padding: '0.25rem', position: 'relative'
                      }}>
                        <Image 
                          src={cert.logo} 
                          alt={`${cert.title} logo`} 
                          fill
                          unoptimized
                          style={{ objectFit: 'contain', padding: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9375rem' }}>{cert.title}</p>
                        <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>{cert.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Award - Compact Strip */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(232, 160, 0, 0.15) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(232, 160, 0, 0.4)',
                borderLeft: '4px solid #E8A000',
                borderRadius: '0.75rem',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 4px 20px rgba(232, 160, 0, 0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Trophy size={16} style={{ color: '#E8A000' }} />
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#E8A000', margin: 0 }}>
                    Award Winning
                  </p>
                </div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0 }}>
                  {currentLang === 'fr' ? "Élu Service Client de l'Année 2024"
                    : currentLang === 'ar' ? 'تم انتخاب خدمة العملاء لعام 2024'
                    : 'Elected Customer Service of the Year 2024'}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem', marginBottom: 0 }}>
                  {currentLang === 'fr' ? 'Pour la 3ème année consécutive'
                    : currentLang === 'ar' ? 'للسنة الثالثة على التوالي'
                    : 'For the 3rd consecutive year'}
                </p>
              </div>

              {/* Award Image Hyperlink Container */}
              <a 
                href="https://www.facebook.com/AMENBANK.page.officielle/posts/pour-la-3ème-année-consécutive-amen-bank-a-obtenu-le-label-elu-service-client-de/349859677676333/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(232, 160, 0, 0.4)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                  height: '200px'
                }}
              >
                <Image 
                  src="https://i.gyazo.com/e063ce088344468575867819058ddde2.png" 
                  alt="Service Client de l'Année 2024 Certificate" 
                  fill
                  unoptimized
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AMENPAY STRIP — secondary blue, visually distinct
          ════════════════════════════════════════════ */}
      <section style={{ background: '#003DA5', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
                  {content.amenPay.badge}
                </p>
                <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>{content.amenPay.title}</p>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>{content.amenPay.platforms}</p>
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
              {content.amenPay.cta}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          RATES & SICAV
          ════════════════════════════════════════════ */}
      <section className="section section-alt">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Exchange Rates */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                <div className="feature-icon" style={{ marginBottom: 0 }}>
                  <TrendingUp size={20} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  {content.exchangeRateLabel}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', color: '#94a3b8' }}>
                    <Loader size={16} className="animate-spin" />
                    <span style={{ fontSize: '0.875rem' }}>
                      {currentLang === 'fr' ? 'Chargement...' : currentLang === 'ar' ? 'جار التحميل...' : 'Loading...'}
                    </span>
                  </div>
                ) : error ? (
                  <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center', padding: '1rem' }}>{errorMsg}</p>
                ) : (
                  Object.entries(exchangeRates).map(([currency, rate]) => {
                    const symbol = currencySymbols[currency] || currency;
                    return (
                      <div key={currency} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.875rem 1rem', borderRadius: '0.5rem', background: '#f8fafc',
                        transition: 'background 0.15s ease',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className="currency-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Banknote size={12} />
                            {symbol}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>1 {symbol}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                            {rate.toTND.toFixed(3)} TND
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            1 TND = {rate.fromTND.toFixed(4)} {symbol}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: '#006B3C', display: 'inline-block' }} />
                {content.rateUpdate}
              </p>
            </div>

            {/* SICAV */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                <div className="feature-icon" style={{ marginBottom: 0 }}>
                  <Zap size={20} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  {content.sicavLabel}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', color: '#94a3b8' }}>
                    <Loader size={16} className="animate-spin" />
                    <span style={{ fontSize: '0.875rem' }}>
                      {currentLang === 'fr' ? 'Chargement...' : currentLang === 'ar' ? 'جار التحميل...' : 'Loading...'}
                    </span>
                  </div>
                ) : error ? (
                  <p style={{ fontSize: '0.875rem', color: '#dc2626', textAlign: 'center', padding: '1rem' }}>{errorMsg}</p>
                ) : Object.keys(sicavValues).length > 0 ? (
                  Object.entries(sicavValues).map(([fundId, value]) => (
                    <div key={fundId} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1rem', borderRadius: '0.5rem', background: '#f8fafc',
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                        {getFundDisplayName(fundId)}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {(value as number).toFixed(3)} TND
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>—</p>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>{content.vni}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST — white bg, 3 cards
          ════════════════════════════════════════════ */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              {currentLang === 'ar' ? 'ثقتك أولويتنا' : currentLang === 'en' ? 'Why Choose Us' : 'Pourquoi nous'}
            </span>
            <h2>{content.trustTitle}</h2>
            <p>{content.trustDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card card-accent-green" style={{ textAlign: 'center' }}>
                  <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA — dark, centered
          ════════════════════════════════════════════ */}
      <section style={{ background: '#0f172a' }}>
        <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              {content.ctaBottom}
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', marginTop: '1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              {content.ctaBottomDesc}
            </p>
            <Link href={`/${currentLang}/devenir-client`} className="btn btn-white btn-lg">
              {content.cta1}
              <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
            </Link>
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
                {content.amenPay.popupTitle}
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