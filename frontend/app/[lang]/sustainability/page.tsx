import Link from 'next/link';
import { Leaf, Globe, HandHeart, Recycle, ArrowRight } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Développement Durable - Amen Bank',
  description: 'Amen Bank s\'engage pour un développement durable et responsable.',
};

export default async function SustainabilityPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      badge: 'Responsabilité',
      title: 'Notre Engagement pour un Avenir Durable',
      subtitle: 'Intégrer la durabilité dans chacune de nos décisions stratégiques.',
      pillars: [
        {
          icon: Leaf,
          title: 'Finance verte',
          desc: 'Financement de projets respectueux de l\'environnement et investissements ESG intégrés dans notre stratégie.',
        },
        {
          icon: Globe,
          title: 'Inclusion financière',
          desc: 'Promouvoir l\'accès aux services bancaires pour tous les segments de la population tunisienne.',
        },
        {
          icon: HandHeart,
          title: 'Engagement social',
          desc: 'Soutenir l\'éducation financière, les associations et les initiatives locales dans nos régions.',
        },
        {
          icon: Recycle,
          title: 'Économie circulaire',
          desc: 'Réduire notre empreinte carbone et encourager les pratiques responsables en interne.',
        },
      ],
      stats: [
        { value: '100 %', label: 'Énergies renouvelables dans nos agences' },
        { value: '50 +', label: 'Projets ESG financés' },
        { value: '0', label: 'Objectif carbone neutre en 2035' },
      ],
      reportTitle: 'Rapport RSE',
      reportDesc: 'Consultez notre rapport annuel sur la responsabilité sociétale et environnementale.',
      reportBtn: 'Télécharger le rapport',
      ctaTitle: 'Ensemble, construisons un avenir meilleur',
      ctaDesc: 'Chaque geste compte. Rejoignez-nous dans cette démarche collective.',
      ctaBtn: 'Devenir client',
    },
    en: {
      badge: 'Sustainability',
      title: 'Our Commitment to a Sustainable Future',
      subtitle: 'Integrating sustainability into every strategic decision we make.',
      pillars: [
        {
          icon: Leaf,
          title: 'Green finance',
          desc: 'Financing environmentally responsible projects and integrating ESG investments into our strategy.',
        },
        {
          icon: Globe,
          title: 'Financial inclusion',
          desc: 'Promoting access to banking services for all segments of the Tunisian population.',
        },
        {
          icon: HandHeart,
          title: 'Social commitment',
          desc: 'Supporting financial education, associations, and local initiatives in our regions.',
        },
        {
          icon: Recycle,
          title: 'Circular economy',
          desc: 'Reducing our carbon footprint and encouraging responsible practices internally.',
        },
      ],
      stats: [
        { value: '100 %', label: 'Renewable energy in our branches' },
        { value: '50 +', label: 'ESG projects financed' },
        { value: '0', label: 'Net-zero carbon target by 2035' },
      ],
      reportTitle: 'CSR Report',
      reportDesc: 'Read our annual report on corporate social and environmental responsibility.',
      reportBtn: 'Download report',
      ctaTitle: 'Together, let\'s build a better future',
      ctaDesc: 'Every action counts. Join us in this collective journey.',
      ctaBtn: 'Become a client',
    },
    ar: {
      badge: 'المسؤولية',
      title: 'التزامنا لمستقبل مستدام',
      subtitle: 'دمج الاستدامة في كل قرار استراتيجي نتخذه.',
      pillars: [
        {
          icon: Leaf,
          title: 'تمويل أخضر',
          desc: 'تمويل مشاريع صديقة للبيئة ومشاريع استثماري ESG في استراتيجيتنا.',
        },
        {
          icon: Globe,
          title: 'الشمول المالي',
          desc: 'تعزيز الوصول إلى الخدمات المصرفية لجميع فئات السكان التونسية.',
        },
        {
          icon: HandHeart,
          title: 'التزام اجتماعي',
          desc: 'دعم التعليم المالي والجمعيات والمبادرات المحلية في مناطقنا.',
        },
        {
          icon: Recycle,
          title: 'اقتصاد دائري',
          desc: 'تقليل بصمتنا الكربون و تشجيع الممارسات المسؤولة داخليًا.',
        },
      ],
      stats: [
        { value: '100 %', label: 'طاقة متجددة في فروعنا' },
        { value: '+50', label: 'مشاريع ESG ممولة' },
        { value: '0', label: 'صفر كربون بحلول 2035' },
      ],
      reportTitle: 'تقرير المسؤولية الاجتماعية',
      reportDesc: 'اطلع تقريرنا السنوي عن المسؤولية الاجتماعية والبيئة.',
      reportBtn: 'تحميل التقرير',
      ctaTitle: 'معًا، لنبن مستقبلًا أفضل',
      ctaDesc: 'كل إجراء يُحدث فرقًا. انضم إلينا في هذه الرحلة الجماعية.',
      ctaBtn: 'كن عميلاً',
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Header ── */}
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '0' }}>
            <span className="section-badge" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.badge}</span>
            <h1 className="text-h1 mt-2 mb-4" style={{ color: '#ffffff' }}>{d.title}</h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
              {d.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="card card-stripe-green text-center">
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7" style={{ color: '#006B3C' }} />
                  </div>
                  <h3 className="text-h4 mt-5 mb-2" style={{ color: '#0f172a' }}>{pillar.title}</h3>
                  <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-10">
            {d.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`py-6 px-4 text-center ${idx < d.stats.length - 1 ? 'md:border-r border-border' : ''}`}
              >
                <div className="text-4xl font-bold mb-2" style={{ color: '#006B3C' }}>{stat.value}</div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Report Download ── */}
      <section className="section-sm" style={{ background: '#f8fafc' }}>
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-h3 mb-3" style={{ color: '#0f172a' }}>{d.reportTitle}</h2>
          <p className="mb-6 leading-relaxed" style={{ color: '#64748b' }}>{d.reportDesc}</p>
          <button className="btn btn-outline-dark inline-flex" style={{ color: '#64748b', textDecoration: 'none' }}>
            {d.reportBtn}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
          </button>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl mx-auto text-center">
          {/* Wrapped in flex-col to force vertical stacking and centering */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <h2 className="text-h2" style={{ color: '#ffffff' }}>{d.ctaTitle}</h2>
            <p className="max-w-lg leading-relaxed" style={{ color: '#94a3b8' }}>
              {d.ctaDesc}
            </p>
          </div>
          <br></br>
          <Link
            href={`/${lang}/devenir-client`}
            className="btn btn-white btn-lg inline-flex"
            style={{ color: '#0f172a', textDecoration: 'none' }}
          >
            {d.ctaBtn}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 ml-3' : 'mr-3'}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}