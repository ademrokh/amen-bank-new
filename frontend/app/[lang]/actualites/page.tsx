import { ArrowRight } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Actualités - Amen Bank',
  description:
    "Dernières actualités et communiqués de presse d'Amen Bank",
};

/**
 * Map article categories to brand tokens only.
 * Green (primary) for expansion/certification, blue (secondary) for innovation/products.
 * No arbitrary hex colors — keeps everything on-brand.
 */
function getCategoryStyle(category: string) {
  const green = ['Expansion', 'توسع', 'Certification', 'شهادة'];
  if (green.includes(category)) {
    return 'bg-primary-50 text-primary';
  }
  return 'bg-secondary-50 text-secondary';
}

export default async function ActualitesPage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      label: 'Actualités',
      title: 'Actualités',
      subtitle: "Restez informé des dernières nouvelles d'Amen Bank",
      readMore: 'Lire plus',
      newsletterTitle: 'Recevez nos actualités',
      newsletterDesc:
        'Inscrivez-vous à notre newsletter pour recevoir les dernières actualités directement dans votre boîte mail',
      emailPlaceholder: 'Votre adresse email',
      subscribeLabel: "S'abonner",
      articles: [
        {
          date: '1 Oct 2024',
          title: 'Carte Visa Infinite — Nationale & Internationale',
          excerpt:
            "À partir du 1er octobre 2024, décollez en toute sérénité avec AMEN BANK. Découvrez notre nouvelle Carte Visa Infinite.",
          category: 'Produits',
          image: '💳',
        },
        {
          date: '1 Sep 2024',
          title: 'Offre exceptionnelle crédit immobilier',
          excerpt:
            "Boostez vos projets immobiliers avec AMEN BANK ! Du 1er septembre au 31 décembre 2024, profitez de conditions exceptionnelles.",
          category: 'Produits',
          image: '🏠',
        },
        {
          date: '15 Mar 2024',
          title: "Élu Service Client de l'Année 2024",
          excerpt:
            "Pour la troisième année consécutive, AMEN BANK a remporté le prix Élu Service Client de l'Année 2024.",
          category: 'Certification',
          image: '🏆',
        },
        {
          date: '10 Jan 2024',
          title: 'AmenPay — Application de mobile payment',
          excerpt:
            "AMEN BANK met à votre disposition son application de mobile payment AmenPay. Payez en toute simplicité.",
          category: 'Innovation',
          image: '📱',
        },
        {
          date: '5 Dec 2023',
          title: 'First Pay obtient son agrément BCT',
          excerpt:
            'First Pay a obtenu son agrément officiel de la Banque Centrale de Tunisie (BCT).',
          category: 'Expansion',
          image: '✅',
        },
        {
          date: '1 Jun 2023',
          title: 'Rapport Annuel 2023',
          excerpt:
            "Consultez le Rapport Annuel 2023 d'AMEN BANK et découvrez nos performances et engagements.",
          category: 'Expansion',
          image: '📊',
        },
      ],
    },
    en: {
      label: 'News',
      title: 'News',
      subtitle: 'Stay informed about the latest Amen Bank updates',
      readMore: 'Read more',
      newsletterTitle: 'Subscribe to our newsletter',
      newsletterDesc:
        'Subscribe to our newsletter to receive the latest news directly in your inbox',
      emailPlaceholder: 'Your email address',
      subscribeLabel: 'Subscribe',
      articles: [
        {
          date: 'Oct 1, 2024',
          title: 'Visa Infinite Card — National & International',
          excerpt:
            'From October 1, 2024, fly with complete peace of mind with AMEN BANK. Discover our new Visa Infinite Card.',
          category: 'Products',
          image: '💳',
        },
        {
          date: 'Sep 1, 2024',
          title: 'Exceptional home loan offer',
          excerpt:
            'Boost your real estate projects with AMEN BANK! From September 1 to December 31, 2024, enjoy exceptional conditions.',
          category: 'Products',
          image: '🏠',
        },
        {
          date: 'Mar 15, 2024',
          title: 'Elected Customer Service of the Year 2024',
          excerpt:
            'For the third consecutive year, AMEN BANK won the Elected Customer Service of the Year 2024 award.',
          category: 'Certification',
          image: '🏆',
        },
        {
          date: 'Jan 10, 2024',
          title: 'AmenPay — Mobile Payment App',
          excerpt:
            "AMEN BANK makes its mobile payment application AmenPay available to you. Pay with complete ease.",
          category: 'Innovation',
          image: '📱',
        },
        {
          date: 'Dec 5, 2023',
          title: 'First Pay obtains BCT approval',
          excerpt:
            'First Pay has obtained its official approval from the Central Bank of Tunisia (BCT).',
          category: 'Expansion',
          image: '✅',
        },
        {
          date: 'Jun 1, 2023',
          title: 'Annual Report 2023',
          excerpt:
            "Consult AMEN BANK's 2023 Annual Report and discover our performance and commitments.",
          category: 'Expansion',
          image: '📊',
        },
      ],
    },
    ar: {
      label: 'الأخبار',
      title: 'الأخبار',
      subtitle: 'ابق على اطلاع بآخر أخبار بنك آمن',
      readMore: 'اقرأ المزيد',
      newsletterTitle: 'اشترك في نشرتنا',
      newsletterDesc:
        'اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار مباشرة في صندوق بريدك',
      emailPlaceholder: 'بريدك الإلكتروني',
      subscribeLabel: 'اشتراك',
      articles: [
        {
          date: '1 أكتوبر 2024',
          title: 'بطاقة Visa Infinite — وطنية ودولية',
          excerpt:
            'ابتداءً من 1 أكتوبر 2024، انطلق بكل راحة مع بنك آمن. اكتشف بطاقتنا الجديدة Visa Infinite.',
          category: 'منتجات',
          image: '💳',
        },
        {
          date: '1 سبتمبر 2024',
          title: 'عرض استثنائي للقروض العقارية',
          excerpt:
            'عزز مشاريعك العقارية مع بنك آمن! من 1 سبتمبر إلى 31 ديسمبر 2024، استفد من شروط استثنائية.',
          category: 'منتجات',
          image: '🏠',
        },
        {
          date: '15 مارس 2024',
          title: 'جائزة خدمة العملاء لعام 2024',
          excerpt:
            'للسنة الثالثة على التوالي، فاز بنك آمن بجائزة خدمة العملاء المختارة لعام 2024.',
          category: 'شهادة',
          image: '🏆',
        },
        {
          date: '10 يناير 2024',
          title: 'AmenPay — تطبيق الدفع المحمول',
          excerpt:
            'يضع بنك آمن تحت تصرفك تطبيق الدفع المحمول AmenPay. ادفع بكل سهولة.',
          category: 'ابتكار',
          image: '📱',
        },
        {
          date: '5 ديسمبر 2023',
          title: 'First Pay يحصل على اعتماد BCT',
          excerpt:
            'حصل First Pay على اعتماده الرسمي من البنك المركزي التونسي.',
          category: 'توسع',
          image: '✅',
        },
        {
          date: '1 يونيو 2023',
          title: 'التقرير السنوي 2023',
          excerpt:
            'اطلع على التقرير السنوي لبنك آمن لعام 2023 واكتشف أداءنا والتزاماتنا.',
          category: 'توسع',
          image: '📊',
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
          ARTICLES — #f8fafc, token-based category tags
          ════════════════════════════════════════════ */}
      <section className="bg-surface-alt py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {d.articles.map((article, idx) => (
              <div key={idx} className="card cursor-pointer">
                <div
                  className={`flex gap-5 sm:gap-6 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Image / Emoji container */}
                  <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-surface border border-border flex items-center justify-center text-3xl sm:text-4xl">
                    {article.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`flex items-center gap-3 mb-2 flex-wrap ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="text-xs text-ink-muted">
                        {article.date}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider rounded-lg ${getCategoryStyle(
                          article.category
                        )}`}
                      >
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-h4 text-ink mb-1.5">
                      {article.title}
                    </h3>
                    <p className="text-small text-ink-secondary leading-relaxed mb-3">
                      {article.excerpt}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-small font-semibold text-secondary hover:text-secondary-dark transition-colors ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {d.readMore}
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${
                          isRTL ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          NEWSLETTER — white, centered
          ════════════════════════════════════════════ */}
      <section className="bg-surface py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Newsletter</span>
          <h2 className="text-h2 text-ink mt-2 mb-4">{d.newsletterTitle}</h2>
          <p className="text-ink-secondary mb-8 leading-relaxed">
            {d.newsletterDesc}
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-3 ${
              isRTL ? 'sm:flex-row-reverse' : ''
            }`}
          >
            <input
              type="email"
              placeholder={d.emailPlaceholder}
              className="input-field flex-1"
            />
            <button className="btn btn-primary whitespace-nowrap">
              {d.subscribeLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}