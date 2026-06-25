import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Particuliers - Amen Bank',
  description:
    'Solutions bancaires pour les particuliers - Comptes, épargne, crédits',
};

/* Stripe mapping: product index → design-system stripe class */
const PRODUCT_STRIPES = [
  'card-stripe-blue',
  'card-stripe-green',
  'card-stripe-accent',
  'card-stripe-blue',
];

export default async function ParticuliersPage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

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
        {
          icon: '🔒',
          title: 'Sécurisé',
          desc: 'Chiffrement 256-bit et authentification multi-facteurs',
        },
        {
          icon: '📱',
          title: 'Mobile First',
          desc: 'Application mobile complète disponible 24h/24',
        },
        {
          icon: '⚡',
          title: 'Rapide',
          desc: 'Transactions instantanées et approvals rapides',
        },
        {
          icon: '🌍',
          title: 'Global',
          desc: 'Accès international avec les meilleures devises',
        },
      ],
      amenPay: {
        label: 'Mobile Payment',
        title: 'AmenPay',
        subtitle: "L'application mobile de paiement d'Amen Bank",
        description:
          "Payez en toute simplicité avec AmenPay, l'application de mobile payment d'Amen Bank.",
        features: [
          'Paiements mobiles instantanés',
          "Transferts d'argent simples",
          'Recharges de téléphone',
          'Sécurité maximale avec biométrie',
          'Disponible 24h/24, 7j/7',
        ],
        cta: 'Télécharger AmenPay',
        platforms: 'Disponible sur iOS et Android',
      },
      ctaTitle: 'Prêt à commencer ?',
      ctaDesc:
        "Ouvrez votre compte dès aujourd'hui et bénéficiez de tous nos services",
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
        {
          icon: '🔒',
          title: 'Secure',
          desc: '256-bit encryption and multi-factor authentication',
        },
        {
          icon: '📱',
          title: 'Mobile First',
          desc: 'Complete mobile app available 24/7',
        },
        {
          icon: '⚡',
          title: 'Fast',
          desc: 'Instant transactions and quick approvals',
        },
        {
          icon: '🌍',
          title: 'Global',
          desc: 'International access with best exchange rates',
        },
      ],
      amenPay: {
        label: 'Mobile Payment',
        title: 'AmenPay',
        subtitle: "Amen Bank's Mobile Payment Application",
        description:
          "Pay effortlessly with AmenPay, Amen Bank's mobile payment app.",
        features: [
          'Instant mobile payments',
          'Simple money transfers',
          'Phone recharges',
          'Maximum security with biometrics',
          'Available 24/7',
        ],
        cta: 'Download AmenPay',
        platforms: 'Available on iOS and Android',
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
        {
          icon: '🔒',
          title: 'آمن',
          desc: 'التشفير 256-bit والمصادقة متعددة العوامل',
        },
        {
          icon: '📱',
          title: 'الجوال أولاً',
          desc: 'تطبيق جوال كامل متاح 24/7',
        },
        {
          icon: '⚡',
          title: 'سريع',
          desc: 'معاملات فورية والموافقات السريعة',
        },
        {
          icon: '🌍',
          title: 'عالمي',
          desc: 'الوصول الدولي بأفضل أسعار صرف',
        },
      ],
      amenPay: {
        label: 'Mobile Payment',
        title: 'AmenPay',
        subtitle: 'تطبيق الدفع المحمول من بنك آمن',
        description: 'ادفع بكل سهولة مع AmenPay، تطبيق الدفع المحمول من أمين بنك.',
        features: [
          'دفع فوري عبر الهاتف المحمول',
          'تحويلات أموال بسيطة',
          'إعادة شحن الهاتف',
          'أمان قصوى مع البيومتريا',
          'متاح 24/7',
        ],
        cta: 'تحميل AmenPay',
        platforms: 'متاح على iOS و Android',
      },
      ctaTitle: 'هل أنت مستعد للبدء؟',
      ctaDesc: 'افتح حسابك اليوم والاستفادة من جميع خدماتنا',
      ctaBtn: 'فتح حساب',
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
          AMENPAY — #003DA5 flat, alternating layout
          ════════════════════════════════════════════ */}
      <section id="amenpay" className="bg-secondary py-24">
        <div className="container">
          <div
            className={`flex flex-col ${
              isRTL ? 'md:flex-row-reverse' : 'md:flex-row'
            } gap-16 items-center`}
          >
            {/* Text */}
            <div className="flex-1">
              <span className="section-label text-white/50!">
                {d.amenPay.label}
              </span>
              <h2 className="text-h1 text-white mt-2 mb-3">
                {d.amenPay.title}
              </h2>
              <p className="text-lg text-white/70 mb-2">
                {d.amenPay.subtitle}
              </p>
              <p className="text-ink-muted mb-8 leading-relaxed">
                {d.amenPay.description}
              </p>

              <ul className="space-y-3 mb-8">
                {d.amenPay.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2.5 text-small text-white/80 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span className="w-1.25 h-1.25 rounded-full bg-white shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/particuliers`}
                className={`btn btn-white inline-flex ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {d.amenPay.cta}
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
                />
              </Link>
            </div>

            {/* Visual — phone icon in glass container */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-48 h-48 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center">
                <Smartphone className="w-20 h-20 text-white/80" />
              </div>
              <p className="text-small text-white/50 mt-4">
                {d.amenPay.platforms}
              </p>
            </div>
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
            href={`/${lang}/devenir-client`}
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