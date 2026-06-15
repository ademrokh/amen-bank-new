'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

type Language = 'fr' | 'ar' | 'en';

export default function Hero() {
  const pathname = usePathname();
  const [exchangeRates, setExchangeRates] = useState({
    EUR: 3.45,
    USD: 3.12,
    CAD: 2.28,
  });

  const [sicavValues, setSicavValues] = useState({
    balanced: 156.89,
    growth: 203.45,
    conservative: 142.12,
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

  const heroContent = {
    fr: {
      headline: 'Votre Partenaire Financier de Confiance',
      subheadline: 'Solutions bancaires innovantes pour particuliers et entreprises depuis 1980',
      exchangeRateLabel: 'Taux de change en TND',
      sicavLabel: 'Fonds d\'investissement',
      trustTitle: 'Pourquoi nous faire confiance ?',
      trustItems: [
        { icon: '🏛️', title: '40+ ans d\'expérience', desc: 'Leader du secteur bancaire tunisien' },
        { icon: '🔒', title: 'Sécurité garantie', desc: 'Certifications internationales et conformité stricte' },
        { icon: '⚡', title: 'Technologie moderne', desc: 'Plateforme digitale sécurisée et performante' },
      ],
      cta1: 'Ouvrir un compte',
      cta2: 'Avez-vous besoin d\'un prêt ?',
      stats: [
        { value: '164', label: 'Agences' },
        { value: '500K+', label: 'Clients' },
        { value: '98%', label: 'Satisfaction' },
      ],
    },
    ar: {
      headline: 'شريكك المالي الموثوق',
      subheadline: 'حلول مصرفية مبتكرة للأفراد والشركات منذ عام 1980',
      exchangeRateLabel: 'أسعار الصرف بالدينار التونسي',
      sicavLabel: 'صناديق الاستثمار',
      trustTitle: 'لماذا تثق بنا؟',
      trustItems: [
        { icon: '🏛️', title: 'أكثر من 40 سنة من الخبرة', desc: 'رائد القطاع المصرفي التونسي' },
        { icon: '🔒', title: 'أمان مضمون', desc: 'شهادات دولية والامتثال الصارم' },
        { icon: '⚡', title: 'تكنولوجيا حديثة', desc: 'منصة رقمية آمنة وفعالة' },
      ],
      cta1: 'فتح حساب',
      cta2: 'هل تحتاج إلى قرض؟',
      stats: [
        { value: '164', label: 'فرع' },
        { value: '500K+', label: 'عملاء' },
        { value: '98%', label: 'الرضا' },
      ],
    },
    en: {
      headline: 'Your Trusted Financial Partner',
      subheadline: 'Innovative banking solutions for individuals and businesses since 1980',
      exchangeRateLabel: 'Exchange Rates in TND',
      sicavLabel: 'Investment Funds',
      trustTitle: 'Why Trust Us?',
      trustItems: [
        { icon: '🏛️', title: '40+ Years of Experience', desc: 'Leader in Tunisian banking sector' },
        { icon: '🔒', title: 'Guaranteed Security', desc: 'International certifications and strict compliance' },
        { icon: '⚡', title: 'Modern Technology', desc: 'Secure and efficient digital platform' },
      ],
      cta1: 'Open Account',
      cta2: 'Need a Loan?',
      stats: [
        { value: '164', label: 'Branches' },
        { value: '500K+', label: 'Clients' },
        { value: '98%', label: 'Satisfaction' },
      ],
    },
  };

  const content = heroContent[currentLang];

  return (
    <div className={`relative min-h-screen overflow-hidden ${isRTL ? 'dir-rtl' : ''}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-12">
        {/* Main Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            {/* Left: Text Content */}
            <div className={`space-y-8 ${isRTL ? 'lg:col-start-2' : ''}`}>
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  {content.headline}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  {content.subheadline}
                </p>
              </div>

              {/* Stats Row */}
              <div className={`flex gap-8 py-6 border-y border-slate-200 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                {content.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-3xl font-bold text-blue-900">{stat.value}</span>
                    <span className="text-sm text-slate-600">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className={`flex gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href={`/${currentLang}/devenir-client`}
                  className="px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 group"
                >
                  {content.cta1}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${currentLang}/particuliers`}
                  className="px-8 py-4 bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  {content.cta2}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Visuals */}
            <div className={`relative h-96 ${isRTL ? 'lg:col-start-1' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-cyan-500/5 rounded-2xl border border-slate-200 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-24 h-24 text-blue-900/20 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Banking Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rates & SICAV Section */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            {/* Exchange Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-6 h-6 text-blue-900" />
                <h3 className="text-2xl font-bold text-slate-900">{content.exchangeRateLabel}</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(exchangeRates).map(([currency, rate]) => (
                  <div key={currency} className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-slate-900">{currency}/TND</span>
                    <span className="text-2xl font-bold text-blue-900">{rate.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">Mise à jour en temps réel</p>
            </div>

            {/* SICAV Values */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-6 h-6 text-blue-900" />
                <h3 className="text-2xl font-bold text-slate-900">{content.sicavLabel}</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: currentLang === 'fr' ? 'Équilibré' : currentLang === 'ar' ? 'متوازن' : 'Balanced', value: sicavValues.balanced },
                  { name: currentLang === 'fr' ? 'Croissance' : currentLang === 'ar' ? 'النمو' : 'Growth', value: sicavValues.growth },
                  { name: currentLang === 'fr' ? 'Conservateur' : currentLang === 'ar' ? 'محافظ' : 'Conservative', value: sicavValues.conservative },
                ].map((fund) => (
                  <div key={fund.name} className={`flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-slate-900">{fund.name}</span>
                    <span className="text-2xl font-bold text-green-700">{fund.value.toFixed(2)} TND</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">{currentLang === 'fr' ? 'Valeurs nettes d\'inventaire (VNI)' : currentLang === 'ar' ? 'قيم صافي الأصول' : 'Net Asset Values'}</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">{content.trustTitle}</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {currentLang === 'fr'
                  ? 'Nous nous engageons à fournir des services financiers excellence avec transparence et intégrité'
                  : currentLang === 'ar'
                  ? 'نلتزم بتقديم خدمات مالية ممتازة بشفافية واستقامة'
                  : 'We are committed to providing excellent financial services with transparency and integrity'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.trustItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 rounded-2xl p-12 text-center text-white shadow-2xl mb-8">
            <h3 className="text-3xl font-bold mb-4">
              {currentLang === 'fr'
                ? 'Prêt à commencer votre parcours financier ?'
                : currentLang === 'ar'
                ? 'هل أنت مستعد لبدء رحلتك المالية؟'
                : 'Ready to start your financial journey?'}
            </h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {currentLang === 'fr'
                ? 'Rejoignez des milliers de clients satisfaits qui font confiance à Amen Bank'
                : currentLang === 'ar'
                ? 'انضم إلى آلاف العملاء الراضين الذين يثقون بـ Amen Bank'
                : 'Join thousands of satisfied customers who trust Amen Bank'}
            </p>
            <Link
              href={`/${currentLang}/devenir-client`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
