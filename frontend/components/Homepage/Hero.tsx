'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Zap, Shield, Building2, Cpu, Loader, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Hero() {
  const { lang: currentLang, isRTL } = useLang();
  const [exchangeRates, setExchangeRates] = useState({ EUR: 3.39, USD: 3.17, CAD: 2.38 });
  const [sicavValues, setSicavValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

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
    amenPay: { badge: string; title: string; desc: string; cta: string; platforms: string };
  }> = {
    fr: {
      headline: 'Votre Partenaire Financier de Confiance',
      subheadline: 'Solutions bancaires innovantes pour particuliers et entreprises depuis 1980',
      exchangeRateLabel: 'Taux de change en TND',
      sicavLabel: "Fonds d'investissement",
      trustTitle: 'Pourquoi nous faire confiance ?',
      trustDesc: 'Nous nous engageons à fournir des services financiers d\'excellence avec transparence et intégrité',
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
      },
    },
  };

  const content = heroContent[currentLang];
  const errorMsg =
    currentLang === 'ar'
      ? '⚠ البيانات غير متاحة'
      : currentLang === 'en'
        ? '⚠ Data unavailable'
        : '⚠ Données indisponibles';

  const getFundDisplayName = (fundId: string): string => {
    const nameMap: Record<string, Record<Language, string>> = {
      'sicav-diversif': { fr: 'Diversification', ar: 'التنويع', en: 'Diversification' },
      'sicav-actions': { fr: 'Actions Monde', ar: 'الأسهم العالمية', en: 'Global Equities' },
      'sicav-obligations': { fr: 'Obligations', ar: 'السندات', en: 'Bonds' },
    };
    return nameMap[fundId]?.[currentLang] ?? fundId.replace('sicav-', '').replace(/-/g, ' ');
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — #0f172a flat, no gradient, no blobs
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900 relative">
        <div className="container py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Headline + Sub + CTA + Stats */}
            <div className="space-y-8">
              {/* Label: plain uppercase, no pill */}
              <span className="section-label text-white/50!">
                Amen Bank · {currentLang === 'fr' ? 'Depuis 1980' : currentLang === 'ar' ? 'منذ 1980' : 'Since 1980'}
              </span>

              <h1 className="text-[2.5rem] sm:text-display text-white leading-[1.1] tracking-tight">
                {content.headline}
              </h1>

              <p className="text-lg text-ink-muted leading-relaxed max-w-lg">
                {content.subheadline}
              </p>

              {/* Stats bar — 3 cols, white/10 vertical dividers */}
              <div className={`grid grid-cols-3 py-8 border-y border-white/10 ${isRTL ? 'text-right' : ''}`}>
                {content.stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`stats-divider ${isRTL ? 'pl-6' : 'pr-6'} ${i === 0 ? (isRTL ? 'pr-6' : 'pl-6') : ''}`}
                  >
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-small text-ink-muted mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs — primary green + outline-white */}
              <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={`/${currentLang}/devenir-client`}
                  className="btn btn-primary btn-lg"
                >
                  {content.cta1}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
                <Link
                  href={`/${currentLang}/particuliers`}
                  className="btn btn-outline-white btn-lg"
                >
                  {content.cta2}
                </Link>
              </div>
            </div>

            {/* Right — Glass panels */}
            <div className="space-y-5">
              {/* Certifications panel — glass effect */}
              <div className="glass-panel">
                <h3 className="text-h4 text-white mb-5">{content.certificationsTitle}</h3>
                <div className="space-y-4">
                  {[
                    { label: 'ISO', title: 'ISO 27001', sub: 'Information Security' },
                    { label: 'ISO', title: 'ISO 20000', sub: 'IT Service Management' },
                    { label: '✓', title: 'PCI DSS', sub: 'Payment Card Security' },
                  ].map((cert) => (
                    <div
                      key={cert.title}
                      className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold text-primary bg-primary-50 border border-border">
                        {cert.label}
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="font-semibold text-white text-sm">{cert.title}</p>
                        <p className="text-xs text-ink-muted">{cert.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Award panel — glass + accent left-border */}
              <div className="glass-panel border-l-2! border-l-accent!">
                <p className="text-small font-medium text-accent mb-1">🏆 Award Winning</p>
                <p className="text-h4 text-white">
                  {currentLang === 'fr'
                    ? 'Élu Service Client de l\'Année 2024'
                    : currentLang === 'ar'
                      ? 'تم انتخاب خدمة العملاء لعام 2024'
                      : 'Elected Customer Service of the Year 2024'}
                </p>
                <p className="text-small text-ink-muted mt-1">
                  {currentLang === 'fr'
                    ? 'Pour la 3ème année consécutive'
                    : currentLang === 'ar'
                      ? 'للسنة الثالثة على التوالي'
                      : 'For the 3rd consecutive year'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AMENPAY STRIP — #0f172a, full-bleed, no radius
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900">
        <div className="container py-8">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 bg-white/6">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                {/* Badge: plain uppercase text, no pill */}
                <span className="section-label text-white/50! mb-0.5! block!">
                  {content.amenPay.badge}
                </span>
                <p className="font-bold text-white">{content.amenPay.title}</p>
                <p className="text-small text-ink-muted">{content.amenPay.platforms}</p>
              </div>
            </div>
            <Link
              href={`/${currentLang}/particuliers#amenpay`}
              className="btn btn-secondary shrink-0"
            >
              {content.amenPay.cta}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          RATES & SICAV — #f8fafc section, white cards
          ════════════════════════════════════════════ */}
      <section className="bg-surface-alt py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Exchange Rates */}
            <div className="card">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="feature-icon">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-h4 text-ink">{content.exchangeRateLabel}</h3>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-ink-muted">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-small">
                      {currentLang === 'fr' ? 'Chargement...' : currentLang === 'ar' ? 'جار التحميل...' : 'Loading...'}
                    </span>
                  </div>
                ) : error ? (
                  <p className="text-small text-error py-4 text-center">{errorMsg}</p>
                ) : (
                  Object.entries(exchangeRates).map(([currency, rate]) => (
                    <div
                      key={currency}
                      className={`flex items-center justify-between p-4 rounded-lg bg-surface-alt hover:bg-primary-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="currency-tag">{currency}</span>
                        <span className="text-small font-medium text-ink-secondary">
                          1 {currency}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-ink">
                        {(rate as number).toFixed(3)} TND
                      </span>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-ink-muted mt-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {content.rateUpdate}
              </p>
            </div>

            {/* SICAV */}
            <div className="card">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="feature-icon">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-h4 text-ink">{content.sicavLabel}</h3>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-ink-muted">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-small">
                      {currentLang === 'fr' ? 'Chargement...' : currentLang === 'ar' ? 'جار التحميل...' : 'Loading...'}
                    </span>
                  </div>
                ) : error ? (
                  <p className="text-small text-error py-4 text-center">{errorMsg}</p>
                ) : Object.keys(sicavValues).length > 0 ? (
                  Object.entries(sicavValues).map(([fundId, value]) => (
                    <div
                      key={fundId}
                      className={`flex items-center justify-between p-4 rounded-lg bg-surface-alt hover:bg-secondary-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className="text-small font-medium text-ink-secondary">
                        {getFundDisplayName(fundId)}
                      </span>
                      <span className="text-lg font-bold text-ink">
                        {(value as number).toFixed(3)} TND
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-small text-ink-muted py-4 text-center">—</p>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-4">{content.vni}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST — white section, centered cards, stripe top
          ════════════════════════════════════════════ */}
      <section className="bg-surface py-24">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label">
              {currentLang === 'ar'
                ? 'ثقتك أولويتنا'
                : currentLang === 'en'
                  ? 'Why Choose Us'
                  : 'Pourquoi nous'}
            </span>
            <h2 className="text-h1 text-ink mt-2">{content.trustTitle}</h2>
            <p className="text-lg text-ink-secondary max-w-2xl mx-auto mt-4 leading-relaxed">
              {content.trustDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {content.trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card card-stripe-green text-center">
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-h4 text-ink mt-5 mb-2">{item.title}</h3>
                  <p className="text-small text-ink-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA — #0f172a flat, white button
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h1 text-white">{content.ctaBottom}</h2>
          <p className="text-lg text-ink-muted mt-4 mb-10 leading-relaxed">
            {content.ctaBottomDesc}
          </p>
          <Link
            href={`/${currentLang}/devenir-client`}
            className="btn btn-white btn-lg"
          >
            {content.cta1}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}