import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Entreprises - Amen Bank',
  description:
    'Solutions bancaires pour les entreprises - Financements, comptes professionnels',
};

/* Stripe mapping: product index → design-system stripe class */
const PRODUCT_STRIPES = [
  'card-stripe-blue',
  'card-stripe-green',
  'card-stripe-accent',
  'card-stripe-blue',
];

export default async function EntreprisesPage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      label: 'Entreprises',
      title: 'Solutions Bancaires pour Entreprises',
      subtitle: 'Financement et gestion optimisée de votre entreprise',
      productsHeading: 'Nos Produits',
      advantagesHeading: 'Nos Avantages',
      ctaTitle: 'Parlons de votre croissance',
      ctaDesc:
        'Contactez nos experts pour étudier vos besoins spécifiques',
      ctaBtn: 'Nous contacter',
      products: [
        {
          title: 'Comptes Professionnels',
          desc: 'Gestion complète de votre trésorerie',
          features: [
            'Comptes courants professionnels',
            'Virements nationaux/internationaux',
            'Services de paiement',
            'Chéquiers',
          ],
        },
        {
          title: 'Crédits Professionnels',
          desc: 'Financement adapté à votre croissance',
          features: [
            "Crédits d'exploitation",
            'Crédits immobiliers',
            'Financement du stock',
            'Découverts autorisés',
          ],
        },
        {
          title: 'Trésorerie & Change',
          desc: 'Optimisation de votre trésorerie',
          features: [
            'Gestion de trésorerie',
            'Opérations de change',
            'Placements court terme',
            'Crédits documentaires',
          ],
        },
        {
          title: 'Commerce International',
          desc: 'Faciliter vos échanges commerciaux',
          features: [
            'Crédits documentaires',
            'Lettres de crédit',
            'Exportation',
            'Importation',
          ],
        },
      ],
      advantages: [
        {
          icon: '💼',
          title: 'Expérience',
          desc: '40+ ans de partenariat avec les entreprises tunisiennes',
        },
        {
          icon: '🚀',
          title: 'Croissance',
          desc: 'Financement flexible pour votre développement',
        },
        {
          icon: '🔧',
          title: 'Solutions',
          desc: 'Produits personnalisés selon vos besoins',
        },
        {
          icon: '🤝',
          title: 'Partenariat',
          desc: 'Relation durable basée sur la confiance',
        },
      ],
    },
    en: {
      label: 'Business',
      title: 'Banking Solutions for Businesses',
      subtitle: 'Optimized financing and treasury management',
      productsHeading: 'Our Products',
      advantagesHeading: 'Our Advantages',
      ctaTitle: "Let's talk about your growth",
      ctaDesc: 'Contact our experts to study your specific needs',
      ctaBtn: 'Contact us',
      products: [
        {
          title: 'Business Accounts',
          desc: 'Complete treasury management',
          features: [
            'Professional current accounts',
            'National/international transfers',
            'Payment services',
            'Checkbooks',
          ],
        },
        {
          title: 'Business Loans',
          desc: 'Financing tailored to your growth',
          features: [
            'Operating credit',
            'Property loans',
            'Inventory financing',
            'Authorized overdraft',
          ],
        },
        {
          title: 'Treasury & Exchange',
          desc: 'Optimize your treasury management',
          features: [
            'Treasury management',
            'Exchange operations',
            'Short-term placements',
            'Documentary credits',
          ],
        },
        {
          title: 'International Trade',
          desc: 'Facilitate your commercial exchanges',
          features: [
            'Documentary credits',
            'Letters of credit',
            'Export',
            'Import',
          ],
        },
      ],
      advantages: [
        {
          icon: '💼',
          title: 'Experience',
          desc: '40+ years of partnership with Tunisian businesses',
        },
        {
          icon: '🚀',
          title: 'Growth',
          desc: 'Flexible financing for your development',
        },
        {
          icon: '🔧',
          title: 'Solutions',
          desc: 'Customized products according to your needs',
        },
        {
          icon: '🤝',
          title: 'Partnership',
          desc: 'Lasting relationship based on trust',
        },
      ],
    },
    ar: {
      label: 'للشركات',
      title: 'الحلول المصرفية للمؤسسات',
      subtitle: 'التمويل والإدارة المثلى للخزينة',
      productsHeading: 'منتجاتنا',
      advantagesHeading: 'مميزاتنا',
      ctaTitle: 'لنتحدث عن نموك',
      ctaDesc: 'تواصل مع خبرائنا لدراسة احتياجاتك الخاصة',
      ctaBtn: 'اتصل بنا',
      products: [
        {
          title: 'الحسابات المهنية',
          desc: 'إدارة شاملة للخزينة',
          features: [
            'حسابات جارية مهنية',
            'التحويلات الوطنية والدولية',
            'خدمات الدفع',
            'دفاتر الشيكات',
          ],
        },
        {
          title: 'القروض المهنية',
          desc: 'التمويل المناسب لنموك',
          features: [
            'ائتمانات التشغيل',
            'قروض عقارية',
            'تمويل المخزون',
            'رصيد سلبي مرخص',
          ],
        },
        {
          title: 'الخزينة والصرف',
          desc: 'تحسين إدارة الخزينة',
          features: [
            'إدارة الخزينة',
            'عمليات الصرف',
            'الاستثمارات قصيرة الأجل',
            'الاعتمادات المستندية',
          ],
        },
        {
          title: 'التجارة الدولية',
          desc: 'تسهيل تبادلك التجاري',
          features: [
            'الاعتمادات المستندية',
            'خطابات الاعتماد',
            'التصدير',
            'الاستيراد',
          ],
        },
      ],
      advantages: [
        {
          icon: '💼',
          title: 'الخبرة',
          desc: 'أكثر من 40 سنة من الشراكة مع المؤسسات التونسية',
        },
        {
          icon: '🚀',
          title: 'النمو',
          desc: 'تمويل مرن لتطورك',
        },
        {
          icon: '🔧',
          title: 'الحلول',
          desc: 'منتجات مخصصة حسب احتياجاتك',
        },
        {
          icon: '🤝',
          title: 'الشراكة',
          desc: 'علاقة دائمة قائمة على الثقة',
        },
      ],
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — #0f172a flat
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-32">
        <div className="container">
          <span className="section-label text-white/50!">
            Amen Bank · {d.label}
          </span>
          <h1 className="text-[2.5rem] sm:text-display text-white mt-2 mb-4">
            {d.title}
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl leading-relaxed">
            {d.subtitle}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRODUCTS — #f8fafc, stripe cards, green dots
          ════════════════════════════════════════════ */}
      <section className="bg-surface-alt py-24">
        <div className="container">
          <span className="section-label">{d.productsHeading}</span>
          <h2 className="text-h2 text-ink mt-2 mb-16">{d.productsHeading}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {d.products.map((product, idx) => (
              <div
                key={product.title}
                className={`card ${PRODUCT_STRIPES[idx]}`}
              >
                <h3 className="text-h4 text-ink mb-2">{product.title}</h3>
                <p className="text-small text-ink-secondary leading-relaxed mb-6">
                  {product.desc}
                </p>
                <ul className="space-y-2.5">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2.5 text-small text-ink-secondary ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="w-1.25 h-1.25 rounded-full bg-primary shrink-0" />
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
          ADVANTAGES — white, centered, feature-icon style
          ════════════════════════════════════════════ */}
      <section className="bg-surface py-24">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label">{d.advantagesHeading}</span>
            <h2 className="text-h2 text-ink mt-2">{d.advantagesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {d.advantages.map((adv) => (
              <div key={adv.title} className="card text-center">
                <div className="feature-icon mx-auto text-xl">
                  {adv.icon}
                </div>
                <h3 className="text-h4 text-ink mt-5 mb-2">{adv.title}</h3>
                <p className="text-small text-ink-secondary leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA — #0f172a flat
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h1 text-white">{d.ctaTitle}</h2>
          <p className="text-lg text-ink-muted mt-4 mb-10 leading-relaxed">
            {d.ctaDesc}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="btn btn-white btn-lg inline-flex"
          >
            {d.ctaBtn}
            <ArrowRight
              className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}