import Link from 'next/link';
import { ArrowRight, Scale, Star, Rocket, HeartHandshake } from 'lucide-react';
import Timeline from '@/components/Timeline';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Notre Identité - Amen Bank',
  description:
    "À propos d'Amen Bank - Histoire, mission, valeurs et équipe",
};

const VALUE_ICONS = [Scale, Star, Rocket, HeartHandshake];

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
      valuesHeading: 'Nos Valeurs',
      historyTitle: 'Notre Histoire',
      certsTitle: 'Nos Certifications',
      ctaTitle: 'Rejoignez notre communauté',
      ctaDesc: "Faites partie d'une institution bancaire de confiance",
      ctaBtn: 'En savoir plus',
      groupBtn: 'Découvrir notre groupe',
      mission: {
        title: 'Notre Mission',
        desc: "Être le partenaire financier de confiance en Tunisie, en offrant des solutions bancaires innovantes et personnalisées qui contribuent au développement économique et social du pays.",
      },
      values: [
        { title: 'Intégrité', desc: 'Nous agissons avec honnêteté et transparence dans toutes nos relations' },
        { title: 'Excellence', desc: 'Nous nous efforçons de fournir les meilleurs services bancaires' },
        { title: 'Innovation', desc: 'Nous adoptons les dernières technologies pour améliorer nos services' },
        { title: 'Responsabilité', desc: 'Nous prenons soin de nos clients et de la communauté' },
      ],
      history: {
        events: [
          { year: '1980', event: "Fondation d'Amen Bank" },
          { year: '1990', event: 'Expansion du réseau à 50 agences' },
          { year: '2000', event: 'Entrée en bourse et cotation à la Bourse de Tunis' },
          { year: '2010', event: 'Lancement de la plateforme digitale' },
          { year: '2020', event: 'Atteinte de 164 agences dans toute la Tunisie' },
          { year: '2024', event: 'Obtention des certifications ISO 27001 et ISO 20000' },
        ],
      },
    },
    en: {
      label: 'About Us',
      title: 'Our Identity',
      valuesHeading: 'Our Values',
      historyTitle: 'Our History',
      certsTitle: 'Our Certifications',
      ctaTitle: 'Join our community',
      ctaDesc: 'Be part of a trusted banking institution',
      ctaBtn: 'Learn more',
      groupBtn: 'Discover our group',
      mission: {
        title: 'Our Mission',
        desc: "To be Tunisia's trusted financial partner by offering innovative and personalized banking solutions that contribute to the economic and social development of the country.",
      },
      values: [
        { title: 'Integrity', desc: 'We act with honesty and transparency in all our relationships' },
        { title: 'Excellence', desc: 'We strive to provide the best banking services' },
        { title: 'Innovation', desc: 'We embrace the latest technologies to improve our services' },
        { title: 'Responsibility', desc: 'We care for our customers and the community' },
      ],
      history: {
        events: [
          { year: '1980', event: 'Foundation of Amen Bank' },
          { year: '1990', event: 'Network expansion to 50 branches' },
          { year: '2000', event: 'Stock market listing on Tunis Stock Exchange' },
          { year: '2010', event: 'Launch of digital platform' },
          { year: '2020', event: 'Reached 164 branches across Tunisia' },
          { year: '2024', event: 'Obtained ISO 27001 and ISO 20000 certifications' },
        ],
      },
    },
    ar: {
      label: 'هويتنا',
      title: 'هويتنا',
      valuesHeading: 'قيمنا',
      historyTitle: 'تاريخنا',
      certsTitle: 'شهاداتنا',
      ctaTitle: 'انضم إلى مجتمعنا',
      ctaDesc: 'كن جزءًا من مؤسسة مصرفية موثوقة',
      ctaBtn: 'اعرف أكثر',
      groupBtn: 'اكتشف مجموعتنا',
      mission: {
        title: 'مهمتنا',
        desc: 'أن نكون الشريك المالي الموثوق به في تونس، من خلال تقديم حلول مصرفية مبتكرة وشخصية تساهم في التنمية الاقتصادية والاجتماعية للبلاد.',
      },
      values: [
        { title: 'النزاهة', desc: 'نتصرف بصدق وشفافية في جميع علاقاتنا' },
        { title: 'التميز', desc: 'نسعى لتقديم أفضل الخدمات المصرفية' },
        { title: 'الابتكار', desc: 'نتبنى أحدث التقنيات لتحسين خدماتنا' },
        { title: 'المسؤولية', desc: 'نعتني بعملائنا والمجتمع' },
      ],
      history: {
        events: [
          { year: '1980', event: 'تأسيس بنك آمن' },
          { year: '1990', event: 'توسع الشبكة إلى 50 فرعًا' },
          { year: '2000', event: 'الإدراج في بورصة تونس' },
          { year: '2010', event: 'إطلاق المنصة الرقمية' },
          { year: '2020', event: 'الوصول إلى 164 فرعًا في جميع أنحاء تونس' },
          { year: '2024', event: 'الحصول على شهادات ISO 27001 و ISO 20000' },
        ],
      },
    },
  };

  const d = content[lang];

  const stats = [
    {
      value: '164',
      label: lang === 'ar' ? 'فرع' : lang === 'en' ? 'Branches' : 'Agences',
    },
    {
      value: '500K+',
      label: lang === 'ar' ? 'عملاء' : lang === 'en' ? 'Clients' : 'Clients',
    },
    {
      value: '40+',
      label: lang === 'ar' ? 'سنة من التفوق المصرفي' : lang === 'en' ? 'Years of banking excellence' : "Ans d'excellence bancaire",
    },
  ];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ════════════════════════════════════════════
          HERO & KEY FIGURES 
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container">
          <span className="section-badge" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>
            Amen Bank · Since 1980
          </span>
          <h1 className="text-4xl md:text-5xl text-white mt-2 mb-3" style={{ fontWeight: 700, lineHeight: 1.15 }}>
            {d.title}
          </h1>
        </div>

        {/* Increased top margin (mt-20) and top padding (pt-12) for better separation */}
        <div className="container mt-20 pt-12" style={{ borderTop: '1px rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold text-white">
                  {s.value}
                </div>
                <div className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          MISSION 
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container max-w-4xl">
          <div className="card card-stripe-green" style={{ padding: '2.5rem' }}>
            <div className="space-y-4">
              <span className="section-badge" style={{ marginBottom: '0', display: 'block' }}>{d.mission.title}</span>
              <h2 className="text-3xl text-ink" style={{ fontWeight: 700 }}>{d.mission.title}</h2>
              <p className="text-lg leading-relaxed" style={{ color: '#64748b' }}>
                {d.mission.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          VALUES 
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="section-badge">{d.valuesHeading}</span>
            <h2 className="text-3xl text-ink" style={{ fontWeight: 700 }}>{d.valuesHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {d.values.map((value, idx) => {
              const Icon = VALUE_ICONS[idx];
              return (
                <div key={value.title} className="card text-center" style={{ padding: '2rem 1.5rem' }}>
                  <div className="feature-icon mx-auto">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl text-ink mt-4 mb-2" style={{ fontWeight: 600 }}>{value.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HISTORY TIMELINE (Horizontal & Interactive)
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <span className="section-badge">{d.historyTitle}</span>
            <h2 className="text-3xl text-ink" style={{ fontWeight: 700 }}>{d.historyTitle}</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <Timeline events={d.history.events} isRTL={isRTL} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CERTIFICATIONS 
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#f8fafc' }}>
        <div className="container text-center">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-badge">{d.certsTitle}</span>
            <h2 className="text-3xl text-ink" style={{ fontWeight: 700 }}>{d.certsTitle}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['ISO 27001', 'ISO 20000', 'PCI DSS'].map((cert) => (
              <div
                key={cert}
                className="rounded-lg font-bold text-ink"
                style={{ padding: '1rem 1.75rem', border: '1px solid #e2e8f0', background: '#ffffff' }}
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM CTA 
          ════════════════════════════════════════════ */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl text-white" style={{ fontWeight: 700 }}>{d.ctaTitle}</h2>
          <p className="text-lg mt-3 mb-10 leading-relaxed" style={{ color: '#94a3b8' }}>
            {d.ctaDesc}
          </p>
          
          {/* Added flex container to hold both buttons neatly */}
          <div className={`flex flex-wrap items-center justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              href={`/${lang}/particuliers`}
              className="btn btn-white btn-lg inline-flex"
              style={{ color: '#0f172a', textDecoration: 'none' }}
            >
              {d.ctaBtn}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
            </Link>
            
            <Link
              href={`/${lang}/groupe`}
              className="btn btn-lg inline-flex"
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                background: '#006B3C', 
                border: '1px solid #006B3C' 
              }}
            >
              {d.groupBtn}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}