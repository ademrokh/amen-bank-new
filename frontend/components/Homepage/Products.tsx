'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, Wallet, Zap, TrendingUp, Smartphone, Wrench } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

const STRIPE_CLASSES = [
  'card-accent-blue',
  'card-accent-blue',
  'card-accent-green',
  'card-accent-gold',
  'card-accent-blue',
  'card-accent-green',
];

const products = [
  {
    id: 'comptes',
    icon: Wallet,
    link: 'cartes-comptes',
    fr: {
      title: 'Comptes',
      desc: 'Comptes courants et épargne adaptés à vos besoins, avec accès mobile 24/7',
      features: ['Ouverture instantanée', 'Frais réduits', 'Gestion mobile simple'],
      cta: 'Ouvrir un compte',
    },
    ar: {
      title: 'الحسابات',
      desc: 'حسابات جارية وادخار مخصصة لاحتياجاتك مع إمكانية الوصول 24/7',
      features: ['فتح فوري', 'رسوم منخفضة', 'إدارة جوال سهلة'],
      cta: 'فتح حساب',
    },
    en: {
      title: 'Accounts',
      desc: 'Current and savings accounts tailored to your needs, with 24/7 mobile access',
      features: ['Instant opening', 'Low fees', 'Easy mobile management'],
      cta: 'Open Account',
    },
  },
  {
    id: 'cartes',
    icon: CreditCard,
    link: 'cartes-comptes',
    fr: {
      title: 'Cartes Bancaires',
      desc: 'Cartes de débit et crédit avec protection maximale et avantages exclusifs',
      features: ['Paiement sans contact', 'Cashback automatique', 'Assurance voyage'],
      cta: 'Découvrir les cartes',
    },
    ar: {
      title: 'البطاقات البنكية',
      desc: 'بطاقات الخصم والائتمان مع الحماية القصوى والامتيازات الحصرية',
      features: ['الدفع بدون تلامس', 'استرجاع نقدي تلقائي', 'تأمين السفر'],
      cta: 'اكتشف البطاقات',
    },
    en: {
      title: 'Bank Cards',
      desc: 'Debit and credit cards with maximum protection and exclusive benefits',
      features: ['Contactless payment', 'Auto cashback', 'Travel insurance'],
      cta: 'Explore Cards',
    },
  },
  {
    id: 'epargne',
    icon: TrendingUp,
    link: 'particuliers',
    fr: {
      title: 'Épargne & Investissement',
      desc: 'Placements sécurisés avec rendement attractif et conseil expert',
      features: ['SICAV diversifiées', 'Fiscalité avantageuse', 'Suivi en temps réel'],
      cta: 'Investir maintenant',
    },
    ar: {
      title: 'الادخار والاستثمار',
      desc: 'استثمارات آمنة بعائد جذاب وتشاور خبير',
      features: ['صناديق متنوعة', 'ضرائب مواتية', 'متابعة فورية'],
      cta: 'استثمر الآن',
    },
    en: {
      title: 'Savings & Investment',
      desc: 'Secure investments with attractive returns and expert advice',
      features: ['Diversified funds', 'Tax benefits', 'Real-time tracking'],
      cta: 'Invest Now',
    },
  },
  {
    id: 'credits',
    icon: Zap,
    link: 'particuliers',
    fr: {
      title: 'Crédits & Prêts',
      desc: 'Financements rapides et flexibles pour tous vos projets personnels',
      features: ['Taux compétitifs', 'Accord rapide', 'Sans garantie spéciale'],
      cta: 'Demander un crédit',
    },
    ar: {
      title: 'القروض والتمويل',
      desc: 'تمويل سريع ومرن لجميع مشاريعك الشخصية',
      features: ['أسعار فائدة تنافسية', 'موافقة سريعة', 'بدون ضمانات خاصة'],
      cta: 'اطلب قرضا',
    },
    en: {
      title: 'Credits & Loans',
      desc: 'Fast and flexible financing for all your personal projects',
      features: ['Competitive rates', 'Quick approval', 'No special collateral'],
      cta: 'Request Loan',
    },
  },
  {
    id: 'amen-first',
    icon: Smartphone,
    link: 'amen-first-bank',
    fr: {
      title: 'Amen First Bank',
      desc: 'Banque 100% digitale avec tous les services au bout de vos doigts',
      features: ['Interface intuitive', 'Transferts instantanés', 'Support 24/7'],
      cta: 'Activer Amen First',
    },
    ar: {
      title: 'أمين فيرست بانك',
      desc: 'بنك رقمي 100% مع جميع الخدمات في متناول يدك',
      features: ['واجهة بديهية', 'تحويلات فورية', 'دعم 24/7'],
      cta: 'فعّل أمين فيرست',
    },
    en: {
      title: 'Amen First Bank',
      desc: '100% digital banking with all services at your fingertips',
      features: ['Intuitive interface', 'Instant transfers', '24/7 support'],
      cta: 'Activate Now',
    },
  },
  {
    id: 'services',
    icon: Wrench,
    link: 'particuliers',
    fr: {
      title: 'Services Additionnels',
      desc: "Assurances, virements, mandats et bien d'autres services bancaires",
      features: ['Assurance complète', 'Envois sécurisés', 'Frais transparents'],
      cta: 'Voir tous les services',
    },
    ar: {
      title: 'الخدمات الإضافية',
      desc: 'التأمين والتحويلات والحوالات والعديد من الخدمات المصرفية الأخرى',
      features: ['تأمين شامل', 'إرسال آمن', 'رسوم شفافة'],
      cta: 'عرض جميع الخدمات',
    },
    en: {
      title: 'Additional Services',
      desc: 'Insurance, transfers, money orders and many more banking services',
      features: ['Complete insurance', 'Secure shipments', 'Transparent fees'],
      cta: 'View All Services',
    },
  },
];

export default function Products() {
  const { lang, isRTL } = useLang();
  const l = lang as Language;

  const heading =
    l === 'ar' ? 'منتجاتنا والخدمات'
    : l === 'en' ? 'Our Products & Services'
    : 'Nos Produits & Services';

  const sub =
    l === 'ar' ? 'حلول مصرفية شاملة مناسبة لملفك الشخصي وأهدافك'
    : l === 'en' ? 'Complete banking solutions tailored to your profile and goals'
    : 'Solutions bancaires complètes adaptées à votre profil et vos objectifs';

  const badge =
    l === 'ar' ? 'خدماتنا' : l === 'en' ? 'Our Services' : 'Nos Services';

  const notFound =
    l === 'ar' ? 'لا تجد ما تبحث عنه؟'
    : l === 'en' ? "Can't find what you're looking for?"
    : "Vous ne trouvez pas ce qu'il vous faut ?";

  const contactLabel =
    l === 'ar' ? 'تواصل مع فريقنا'
    : l === 'en' ? 'Contact Our Team'
    : 'Contactez notre équipe';

  return (
    <section className="section section-alt" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <span className="section-badge">{badge}</span>
          <h2>{heading}</h2>
          <p>{sub}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const c = product[l];
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className={`card flex flex-col h-full ${STRIPE_CLASSES[idx]}`}
              >
                {/* Icon */}
                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0f172a] mt-6 mb-3">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#64748b] leading-relaxed mb-6">
                  {c.desc}
                </p>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-8">
                  {c.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-3 text-sm text-[#64748b] ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <br></br>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    href={`/${lang}/${product.link}`}
                    className={`btn btn-primary w-full justify-center text-white no-underline ${isRTL ? 'flex-row-reverse' : ''}`}
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                  >
                    {c.cta}
                    <ArrowRight size={16} className={isRTL ? 'rotate-180 ml-2' : 'mr-2'} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <br></br>

        {/* Fallback CTA */}
        <div className="mt-24 text-center">
          <p className="text-[#64748b] mb-5 text-base">{notFound}</p>
          <br></br>
          <Link
            href={`/${lang}/contact`}
            className={`btn btn-outline-dark inline-flex ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: '#64748b', textDecoration: 'none' }}
          >
            {contactLabel}
            <ArrowRight size={16} className={isRTL ? 'rotate-180 ml-2' : 'mr-2'} />
          </Link>
        </div>

      </div>
    </section>
  );
}