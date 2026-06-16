'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CreditCard, Wallet, Zap, TrendingUp, Smartphone, Wrench } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

interface Product {
  id: string;
  icon: React.ReactNode;
  title_fr: string;
  title_ar: string;
  title_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  features_fr: string[];
  features_ar: string[];
  features_en: string[];
  cta_fr: string;
  cta_ar: string;
  cta_en: string;
  link: string;
  color: string;
}

export default function Products() {
  const pathname = usePathname();

  // Extract current language
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  const products: Product[] = [
    {
      id: 'comptes',
      icon: <Wallet className="w-12 h-12" />,
      title_fr: 'Comptes',
      title_ar: 'الحسابات',
      title_en: 'Accounts',
      description_fr: 'Comptes courants et épargne adaptés à vos besoins, avec accès mobile 24/7',
      description_ar: 'حسابات جارية وادخار مخصصة لاحتياجاتك، مع إمكانية الوصول عبر الهاتف المحمول 24/7',
      description_en: 'Current and savings accounts tailored to your needs, with 24/7 mobile access',
      features_fr: ['Ouverture instantanée', 'Frais réduits', 'Gestion mobile simple'],
      features_ar: ['فتح فوري', 'رسوم منخفضة', 'إدارة جوال سهلة'],
      features_en: ['Instant opening', 'Low fees', 'Easy mobile management'],
      cta_fr: 'Ouvrir un compte',
      cta_ar: 'فتح حساب',
      cta_en: 'Open Account',
      link: 'particuliers',
      color: 'from-blue-50 to-blue-100',
    },
    {
      id: 'cartes',
      icon: <CreditCard className="w-12 h-12" />,
      title_fr: 'Cartes Bancaires',
      title_ar: 'البطاقات البنكية',
      title_en: 'Bank Cards',
      description_fr: 'Cartes de débit et crédit avec protection maximale et avantages exclusifs',
      description_ar: 'بطاقات الخصم والائتمان مع الحماية القصوى والامتيازات الحصرية',
      description_en: 'Debit and credit cards with maximum protection and exclusive benefits',
      features_fr: ['Paiement sans contact', 'Cashback automatique', 'Assurance voyage'],
      features_ar: ['الدفع بدون تلامس', 'استرجاع نقدي تلقائي', 'تأمين السفر'],
      features_en: ['Contactless payment', 'Auto cashback', 'Travel insurance'],
      cta_fr: 'Découvrir les cartes',
      cta_ar: 'اكتشف البطاقات',
      cta_en: 'Explore Cards',
      link: 'particuliers',
      color: 'from-purple-50 to-purple-100',
    },
    {
      id: 'epargne',
      icon: <TrendingUp className="w-12 h-12" />,
      title_fr: 'Épargne & Investissement',
      title_ar: 'الادخار والاستثمار',
      title_en: 'Savings & Investment',
      description_fr: 'Placements sécurisés avec rendement attractif et conseil expert',
      description_ar: 'استثمارات آمنة برائد جذاب وتشاور خبير',
      description_en: 'Secure investments with attractive returns and expert advice',
      features_fr: ['SICAV diversifiées', 'Fiscalité avantageuse', 'Suivi en temps réel'],
      features_ar: ['صناديق متنوعة', 'ضرائب مواتية', 'متابعة فورية'],
      features_en: ['Diversified funds', 'Tax benefits', 'Real-time tracking'],
      cta_fr: 'Investir maintenant',
      cta_ar: 'استثمر الآن',
      cta_en: 'Invest Now',
      link: 'particuliers',
      color: 'from-green-50 to-green-100',
    },
    {
      id: 'credits',
      icon: <Zap className="w-12 h-12" />,
      title_fr: 'Crédits & Prêts',
      title_ar: 'القروض والتمويل',
      title_en: 'Credits & Loans',
      description_fr: 'Financements rapides et flexibles pour tous vos projets personnels',
      description_ar: 'تمويل سريع ومرن لجميع مشاريعك الشخصية',
      description_en: 'Fast and flexible financing for all your personal projects',
      features_fr: ['Taux compétitifs', 'Accord rapide', 'Sans garantie spéciale'],
      features_ar: ['أسعار فائدة تنافسية', 'موافقة سريعة', 'بدون ضمانات خاصة'],
      features_en: ['Competitive rates', 'Quick approval', 'No special collateral'],
      cta_fr: 'Demander un crédit',
      cta_ar: 'اطلب قرضا',
      cta_en: 'Request Loan',
      link: 'particuliers',
      color: 'from-orange-50 to-orange-100',
    },
    {
      id: 'amen-first',
      icon: <Smartphone className="w-12 h-12" />,
      title_fr: 'Amen First Bank',
      title_ar: 'أمين فيرست بانك',
      title_en: 'Amen First Bank',
      description_fr: 'Banque 100% digitale avec tous les services au bout de vos doigts',
      description_ar: 'بنك رقمي 100% مع جميع الخدمات في متناول يدك',
      description_en: '100% digital banking with all services at your fingertips',
      features_fr: ['Interface intuitive', 'Transferts instantanés', 'Support 24/7'],
      features_ar: ['واجهة بديهية', 'تحويلات فورية', 'دعم 24/7'],
      features_en: ['Intuitive interface', 'Instant transfers', '24/7 support'],
      cta_fr: 'Activer Amen First',
      cta_ar: 'فعّل أمين فيرست',
      cta_en: 'Activate Now',
      link: 'amen-first-bank',
      color: 'from-cyan-50 to-cyan-100',
    },
    {
      id: 'services',
      icon: <Wrench className="w-12 h-12" />,
      title_fr: 'Services Additionnels',
      title_ar: 'الخدمات الإضافية',
      title_en: 'Additional Services',
      description_fr: 'Assurances, virements, mandats et bien d\'autres services bancaires',
      description_ar: 'التأمين والتحويلات والحوالات والعديد من الخدمات المصرفية الأخرى',
      description_en: 'Insurance, transfers, money orders and many more banking services',
      features_fr: ['Assurance complète', 'Envois sécurisés', 'Frais transparents'],
      features_ar: ['تأمين شامل', 'إرسال آمن', 'رسوم شفافة'],
      features_en: ['Complete insurance', 'Secure shipments', 'Transparent fees'],
      cta_fr: 'Voir tous les services',
      cta_ar: 'عرض جميع الخدمات',
      cta_en: 'View All Services',
      link: 'particuliers',
      color: 'from-pink-50 to-pink-100',
    },
  ];

  const getProductContent = (product: Product) => ({
    title: currentLang === 'fr' ? product.title_fr : currentLang === 'ar' ? product.title_ar : product.title_en,
    description: currentLang === 'fr' ? product.description_fr : currentLang === 'ar' ? product.description_ar : product.description_en,
    features: currentLang === 'fr' ? product.features_fr : currentLang === 'ar' ? product.features_ar : product.features_en,
    cta: currentLang === 'fr' ? product.cta_fr : currentLang === 'ar' ? product.cta_ar : product.cta_en,
  });

  const sectionTitle = currentLang === 'fr'
    ? 'Nos Produits & Services'
    : currentLang === 'ar'
    ? 'منتجاتنا والخدمات'
    : 'Our Products & Services';

  const sectionDescription = currentLang === 'fr'
    ? 'Solutions bancaires complètes adaptées à votre profil et vos objectifs'
    : currentLang === 'ar'
    ? 'حلول مصرفية شاملة مناسبة لملفك الشخصي وأهدافك'
    : 'Complete banking solutions tailored to your profile and goals';

  return (
    <section className={`py-24 bg-linear-to-b from-slate-50 to-white ${isRTL ? 'dir-rtl' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{sectionTitle}</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {sectionDescription}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isRTL ? 'text-right' : ''}`}>
          {products.map((product) => {
            const content = getProductContent(product);
            return (
              <div
                key={product.id}
                className={`group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {/* Background Accent */}
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-linear-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-3xl -m-16`}></div>

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`inline-flex w-16 h-16 rounded-xl bg-linear-to-br ${product.color} items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition-transform duration-300 ${isRTL ? 'ml-auto' : ''}`}>
                    {product.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{content.title}</h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed grow">{content.description}</p>

                  {/* Features */}
                  <div className={`space-y-2 mb-8 ${isRTL ? 'text-right' : ''}`}>
                    {content.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center gap-3 text-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="w-2 h-2 rounded-full bg-blue-900 shrink-0"></span>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/${currentLang}/${product.link}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group/btn w-full justify-center"
                  >
                    {content.cta}
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Border Accent on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-900/0 group-hover:border-blue-900/20 transition-colors pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg text-slate-600 mb-6">
            {currentLang === 'fr'
              ? 'Vous ne trouvez pas ce qu\'il vous faut ?'
              : currentLang === 'ar'
              ? 'لا تجد ما تبحث عنه؟'
              : 'Can\'t find what you\'re looking for?'}
          </p>
          <Link
            href={`/${currentLang}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            {currentLang === 'fr' ? 'Contactez notre équipe' : currentLang === 'ar' ? 'تواصل مع فريقنا' : 'Contact Our Team'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
