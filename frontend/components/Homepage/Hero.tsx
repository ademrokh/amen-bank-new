'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Zap, Shield, Building2, Cpu } from 'lucide-react';
import { useState } from 'react';

type Language = 'fr' | 'ar' | 'en';

export default function Hero() {
  const pathname = usePathname();
  const [exchangeRates] = useState({ EUR: 3.45, USD: 3.12, CAD: 2.28 });
  const [sicavValues] = useState({ balanced: 156.89, growth: 203.45, conservative: 142.12 });

  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  const heroContent = {
    fr: {
      headline: 'Votre Partenaire Financier de Confiance',
      subheadline: 'Solutions bancaires innovantes pour particuliers et entreprises depuis 1980',
      exchangeRateLabel: 'Taux de change en TND',
      sicavLabel: "Fonds d'investissement",
      trustTitle: 'Pourquoi nous faire confiance ?',
      trustDesc: 'Nous nous engageons à fournir des services financiers excellence avec transparence et intégrité',
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
      funds: [
        { key: 'balanced', name: 'Équilibré' },
        { key: 'growth', name: 'Croissance' },
        { key: 'conservative', name: 'Conservateur' },
      ],
    },
    ar: {
      headline: 'شريكك المالي الموثوق',
      subheadline: 'حلول مصرفية مبتكرة للأفراد والشركات منذ عام 1980',
      exchangeRateLabel: 'أسعار الصرف بالدينار التونسي',
      sicavLabel: 'صناديق الاستثمار',
      trustTitle: 'لماذا تثق بنا؟',
      trustDesc: 'نلتزم بتقديم خدمات مالية ممتازة بشفافية واستقامة',
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
      funds: [
        { key: 'balanced', name: 'متوازن' },
        { key: 'growth', name: 'النمو' },
        { key: 'conservative', name: 'محافظ' },
      ],
    },
    en: {
      headline: 'Your Trusted Financial Partner',
      subheadline: 'Innovative banking solutions for individuals and businesses since 1980',
      exchangeRateLabel: 'Exchange Rates in TND',
      sicavLabel: 'Investment Funds',
      trustTitle: 'Why Trust Us?',
      trustDesc: 'We are committed to providing excellent financial services with transparency and integrity',
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
      funds: [
        { key: 'balanced', name: 'Balanced' },
        { key: 'growth', name: 'Growth' },
        { key: 'conservative', name: 'Conservative' },
      ],
    },
  };

  const content = heroContent[currentLang];
  const fundValues: Record<string, number> = {
    balanced: sicavValues.balanced,
    growth: sicavValues.growth,
    conservative: sicavValues.conservative,
  };

  return (
    <div className="relative min-h-screen overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-emerald-50/40 to-slate-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Hero ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

            {/* Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Amen Bank · Since 1980
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  {content.headline}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  {content.subheadline}
                </p>
              </div>

              {/* Stats */}
              <div className={`flex gap-8 py-6 border-y border-slate-200 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                {content.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-3xl font-bold text-emerald-700">{stat.value}</span>
                    <span className="text-sm text-slate-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className={`flex gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={`/${currentLang}/devenir-client`}
                  className="px-8 py-4 bg-linear-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
                >
                  {content.cta1}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${currentLang}/particuliers`}
                  className="px-8 py-4 bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  {content.cta2}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative h-96">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-900/8 to-green-400/8 rounded-2xl border border-emerald-200 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Decorative rings */}
                <div className="absolute w-72 h-72 rounded-full border border-emerald-200/40" />
                <div className="absolute w-52 h-52 rounded-full border border-emerald-300/30" />
                <div className="text-center relative z-10">
                  <TrendingUp className="w-20 h-20 text-emerald-600/40 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">Banking Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Rates & SICAV ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">

            {/* Exchange Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-6 h-6 text-emerald-700" />
                <h3 className="text-2xl font-bold text-slate-900">{content.exchangeRateLabel}</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(exchangeRates).map(([currency, rate]) => (
                  <div
                    key={currency}
                    className={`flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="font-semibold text-slate-700">{currency}/TND</span>
                    <span className="text-2xl font-bold text-emerald-700">{rate.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">{content.rateUpdate}</p>
            </div>

            {/* SICAV */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-6 h-6 text-emerald-700" />
                <h3 className="text-2xl font-bold text-slate-900">{content.sicavLabel}</h3>
              </div>
              <div className="space-y-3">
                {content.funds.map((fund) => (
                  <div
                    key={fund.key}
                    className={`flex items-center justify-between p-4 bg-linear-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="font-semibold text-slate-700">{fund.name}</span>
                    <span className="text-2xl font-bold text-emerald-700">
                      {fundValues[fund.key].toFixed(2)} TND
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">{content.vni}</p>
            </div>
          </div>

          {/* ── Trust ── */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">{content.trustTitle}</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">{content.trustDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl border border-slate-200 p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
                  >
                    <div className="w-16 h-16 bg-emerald-100 group-hover:bg-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors">
                      <Icon className="w-8 h-8 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-green-700 rounded-2xl p-12 text-center text-white shadow-2xl mb-8">
            <h3 className="text-3xl font-bold mb-4">{content.ctaBottom}</h3>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">{content.ctaBottomDesc}</p>
            <Link
              href={`/${currentLang}/devenir-client`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {content.cta1}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}