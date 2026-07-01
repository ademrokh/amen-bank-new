import Link from 'next/link';
import { ArrowRight, Briefcase, Rocket, Wrench, Handshake } from 'lucide-react';

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

const ADVANTAGE_ICONS = [Briefcase, Rocket, Wrench, Handshake];

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
        { title: 'Expérience', desc: '40+ ans de partenariat avec les entreprises tunisiennes' },
        { title: 'Croissance', desc: 'Financement flexible pour votre développement' },
        { title: 'Solutions', desc: 'Produits personnalisés selon vos besoins' },
        { title: 'Partenariat', desc: 'Relation durable basée sur la confiance' },
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
        { title: 'Experience', desc: '40+ years of partnership with Tunisian businesses' },
        { title: 'Growth', desc: 'Flexible financing for your development' },
        { title: 'Solutions', desc: 'Customized products according to your needs' },
        { title: 'Partnership', desc: 'Lasting relationship based on trust' },
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
        { title: 'الخبرة', desc: 'أكثر من 40 سنة من الشراكة مع المؤسسات التونسية' },
        { title: 'النمو', desc: 'تمويل مرن لتطورك' },
        { title: 'الحلول', desc: 'منتجات مخصصة حسب احتياجاتك' },
        { title: 'الشراكة', desc: 'علاقة دائمة قائمة على الثقة' },
      ],
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — #0f172a flat
          ════════════════════════════════════════════ */}
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container">
          <span className="section-badge" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', display: 'block' }}>
            Amen Bank · {d.label}
          </span>
          <h1 className="text-4xl md:text-5xl text-white mt-2 mb-4" style={{ fontWeight: 700, lineHeight: 1.15 }}>
            {d.title}
          </h1>
          <p className="text-lg max-w-3xl leading-relaxed" style={{ color: '#94a3b8' }}>
            {d.subtitle}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRODUCTS — #f8fafc, stripe cards, green dots
          ════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '4rem' }}>
            <span className="section-badge">{d.productsHeading}</span>
            <h2 className="text-h2 text-ink">{d.productsHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {d.products.map((product, idx) => (
              <div
                key={product.title}
                className={`card ${PRODUCT_STRIPES[idx]}`}
                style={{ padding: '2.5rem' }}
              >
                <h3 className="text-xl mb-2" style={{ fontWeight: 600, color: '#0f172a' }}>{product.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748b' }}>
                  {product.desc}
                </p>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ color: '#64748b' }}
                    >
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
          ADVANTAGES — white, centered, feature-icon style
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="section-badge">{d.advantagesHeading}</span>
            <h2 className="text-h2 text-ink">{d.advantagesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.advantages.map((adv, idx) => {
              const Icon = ADVANTAGE_ICONS[idx];
              return (
                <div key={adv.title} className="card text-center" style={{ padding: '2rem 1.5rem' }}>
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl text-ink mt-4 mb-2" style={{ fontWeight: 600 }}>{adv.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA — #0f172a flat
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl text-white" style={{ fontWeight: 700 }}>{d.ctaTitle}</h2>
          <p className="text-lg mt-3 mb-8 leading-relaxed" style={{ color: '#94a3b8' }}>
            {d.ctaDesc}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="btn btn-white btn-lg inline-flex"
            style={{ color: '#0f172a', textDecoration: 'none' }}
          >
            {d.ctaBtn}
            <ArrowRight
              className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}