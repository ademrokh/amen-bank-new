import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Notre Identité - Amen Bank',
  description:
    "À propos d'Amen Bank - Histoire, mission, valeurs et équipe",
};

export default async function NotreIdentitePage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      label: 'Notre Identité',
      title: 'Notre Identité',
      subtitle: "40+ ans d'excellence bancaire",
      valuesHeading: 'Nos Valeurs',
      historyTitle: 'Notre Histoire',
      certsTitle: 'Nos Certifications',
      ctaTitle: 'Rejoignez notre communauté',
      ctaDesc: "Faites partie d'une institution bancaire de confiance",
      ctaBtn: 'En savoir plus',
      mission: {
        title: 'Notre Mission',
        desc: "Être le partenaire financier de confiance en Tunisie, en offrant des solutions bancaires innovantes et personnalisées qui contribuent au développement économique et social du pays.",
      },
      values: [
        {
          title: 'Intégrité',
          desc: 'Nous agissons avec honnêteté et transparence dans toutes nos relations',
          icon: '⚖️',
        },
        {
          title: 'Excellence',
          desc: 'Nous nous efforçons de fournir les meilleurs services bancaires',
          icon: '⭐',
        },
        {
          title: 'Innovation',
          desc: 'Nous adoptons les dernières technologies pour améliorer nos services',
          icon: '🚀',
        },
        {
          title: 'Responsabilité',
          desc: 'Nous prenons soin de nos clients et de la communauté',
          icon: '🤲',
        },
      ],
      history: {
        events: [
          { year: '1980', event: "Fondation d'Amen Bank" },
          { year: '1990', event: 'Expansion du réseau à 50 agences' },
          {
            year: '2000',
            event: 'Entrée en bourse et cotation à la Bourse de Tunis',
          },
          { year: '2010', event: 'Lancement de la plateforme digitale' },
          {
            year: '2020',
            event: 'Atteinte de 164 agences dans toute la Tunisie',
          },
          {
            year: '2024',
            event: 'Obtention des certifications ISO 27001 et ISO 20000',
          },
        ],
      },
    },
    en: {
      label: 'About Us',
      title: 'Our Identity',
      subtitle: '40+ years of banking excellence',
      valuesHeading: 'Our Values',
      historyTitle: 'Our History',
      certsTitle: 'Our Certifications',
      ctaTitle: 'Join our community',
      ctaDesc: 'Be part of a trusted banking institution',
      ctaBtn: 'Learn more',
      mission: {
        title: 'Our Mission',
        desc: "To be Tunisia's trusted financial partner by offering innovative and personalized banking solutions that contribute to the economic and social development of the country.",
      },
      values: [
        {
          title: 'Integrity',
          desc: 'We act with honesty and transparency in all our relationships',
          icon: '⚖️',
        },
        {
          title: 'Excellence',
          desc: 'We strive to provide the best banking services',
          icon: '⭐',
        },
        {
          title: 'Innovation',
          desc: 'We embrace the latest technologies to improve our services',
          icon: '🚀',
        },
        {
          title: 'Responsibility',
          desc: 'We care for our customers and the community',
          icon: '🤲',
        },
      ],
      history: {
        events: [
          { year: '1980', event: 'Foundation of Amen Bank' },
          { year: '1990', event: 'Network expansion to 50 branches' },
          {
            year: '2000',
            event: 'Stock market listing on Tunis Stock Exchange',
          },
          { year: '2010', event: 'Launch of digital platform' },
          {
            year: '2020',
            event: 'Reached 164 branches across Tunisia',
          },
          {
            year: '2024',
            event: 'Obtained ISO 27001 and ISO 20000 certifications',
          },
        ],
      },
    },
    ar: {
      label: 'هويتنا',
      title: 'هويتنا',
      subtitle: 'أكثر من 40 سنة من التفوق المصرفي',
      valuesHeading: 'قيمنا',
      historyTitle: 'تاريخنا',
      certsTitle: 'شهاداتنا',
      ctaTitle: 'انضم إلى مجتمعنا',
      ctaDesc: 'كن جزءًا من مؤسسة مصرفية موثوقة',
      ctaBtn: 'اعرف أكثر',
      mission: {
        title: 'مهمتنا',
        desc: 'أن نكون الشريك المالي الموثوق به في تونس، من خلال تقديم حلول مصرفية مبتكرة وشخصية تساهم في التنمية الاقتصادية والاجتماعية للبلاد.',
      },
      values: [
        {
          title: 'النزاهة',
          desc: 'نتصرف بصدق وشفافية في جميع علاقاتنا',
          icon: '⚖️',
        },
        {
          title: 'التميز',
          desc: 'نسعى لتقديم أفضل الخدمات المصرفية',
          icon: '⭐',
        },
        {
          title: 'الابتكار',
          desc: 'نتبنى أحدث التقنيات لتحسين خدماتنا',
          icon: '🚀',
        },
        {
          title: 'المسؤولية',
          desc: 'نعتني بعملائنا والمجتمع',
          icon: '🤲',
        },
      ],
      history: {
        events: [
          { year: '1980', event: 'تأسيس بنك آمن' },
          { year: '1990', event: 'توسع الشبكة إلى 50 فرعًا' },
          { year: '2000', event: 'الإدراج في بورصة تونس' },
          { year: '2010', event: 'إطلاق المنصة الرقمية' },
          { year: '2020', event: 'الوصول إلى 164 فرعًا في جميع أنحاء تونس' },
          {
            year: '2024',
            event: 'الحصول على شهادات ISO 27001 و ISO 20000',
          },
        ],
      },
    },
  };

  const d = content[lang];

  const stats = [
    {
      value: '164',
      label:
        lang === 'ar'
          ? 'فرع'
          : lang === 'en'
            ? 'Branches'
            : 'Agences',
    },
    {
      value: '500K+',
      label:
        lang === 'ar' ? 'عملاء' : lang === 'en' ? 'Clients' : 'Clients',
    },
    {
      value: '40+',
      label:
        lang === 'ar'
          ? 'سنة خبرة'
          : lang === 'en'
            ? 'Years'
            : 'Ans',
    },
  ];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO — #0f172a flat
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-32">
        <div className="container">
          <span className="section-label text-white/50!">
            Amen Bank · Since 1980
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
          KEY FIGURES — same dark band, white/10 dividers
          ════════════════════════════════════════════ */}
      <section className="bg-slate-900">
        <div className="container py-10">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`stats-divider text-center ${
                  i === 0 ? (isRTL ? 'pr-6' : 'pl-6') : ''
                } ${isRTL ? 'pl-6' : 'pr-6'}`}
              >
                <div className="text-3xl font-bold text-white">
                  {s.value}
                </div>
                <div className="text-small text-ink-muted mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          MISSION — white, card with accent stripe
          ════════════════════════════════════════════ */}
      <section className="bg-surface py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card card-stripe-green">
            <span className="section-label">{d.mission.title}</span>
            <h2 className="text-h2 text-ink mt-2 mb-6">{d.mission.title}</h2>
            <p className="text-lg text-ink-secondary leading-relaxed">
              {d.mission.desc}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          VALUES — #f8fafc, feature-icon cards
          ════════════════════════════════════════════ */}
      <section className="bg-surface-alt py-24">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label">{d.valuesHeading}</span>
            <h2 className="text-h2 text-ink mt-2">{d.valuesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {d.values.map((value) => (
              <div key={value.title} className="card text-center">
                <div className="feature-icon mx-auto text-xl">
                  {value.icon}
                </div>
                <h3 className="text-h4 text-ink mt-5 mb-2">{value.title}</h3>
                <p className="text-small text-ink-secondary leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HISTORY TIMELINE — white, clean vertical line
          ════════════════════════════════════════════ */}
      <section className="bg-surface py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">{d.historyTitle}</span>
          <h2 className="text-h2 text-ink mt-2 mb-16">{d.historyTitle}</h2>

          <div className="relative">
            {/* Vertical line */}
            <div
              className={`absolute top-0 bottom-0 w-px bg-border ${
                isRTL ? 'right-10' : 'left-10'
              }`}
            />

            <div className="space-y-10">
              {d.history.events.map((event, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-6 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Year dot */}
                  <div
                    className={`shrink-0 w-20 h-10 rounded-lg bg-primary-50 border border-border flex items-center justify-center ${
                      isRTL ? 'mr-6' : 'ml-6'
                    }`}
                  >
                    <span className="text-small font-bold text-primary">
                      {event.year}
                    </span>
                  </div>

                  {/* Event card */}
                  <div className="flex-1 rounded-lg border border-border bg-surface px-6 py-5">
                    <p className="text-small text-ink-secondary font-medium leading-relaxed">
                      {event.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CERTIFICATIONS — #f8fafc, simple bordered tags
          ════════════════════════════════════════════ */}
      <section className="bg-surface-alt py-24">
        <div className="container text-center">
          <span className="section-label">{d.certsTitle}</span>
          <h2 className="text-h2 text-ink mt-2 mb-12">{d.certsTitle}</h2>

          <div className="flex flex-wrap justify-center gap-4">
            {['ISO 27001', 'ISO 20000', 'PCI DSS'].map((cert) => (
              <div
                key={cert}
                className="px-8 py-4 rounded-lg border border-border bg-surface font-bold text-ink"
              >
                {cert}
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
            href={`/${lang}/notre-identite`}
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