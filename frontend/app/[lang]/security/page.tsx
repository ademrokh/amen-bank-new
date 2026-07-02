import Link from 'next/link';
import { Shield, Lock, Eye, Server, CheckCircle, ArrowRight } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Sécurité - Amen Bank',
  description: 'Découvrez comment Amen Bank protège vos données et transactions bancaires.',
};

export default async function SecurityPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      badge: 'Sécurité',
      title: 'Votre sécurité, notre priorité absolue',
      subtitle: 'Des mesures rigoureuses pour protéger vos données et vos transactions à chaque étape.',
      measuresHeading: 'Des protections concrètes à chaque étape',
      measures: [
        {
          icon: Lock,
          title: 'Chiffrement SSL 256 bits',
          desc: 'Toutes les communications entre votre navigateur et nos serveurs sont chiffrées de bout en bout.',
        },
        {
          icon: Eye,
          title: 'Authentification multi-facteurs',
          desc: 'Un mot de passe plus une preuve supplémentaire pour chaque connexion à votre compte en ligne.',
        },
        {
          icon: Shield,
          title: 'Conformité PCI DSS',
          desc: 'Nous respectons les normes internationales de sécurité des cartes de paiement.',
        },
        {
          icon: Server,
          title: 'Surveillance 24/7',
          desc: 'Nos systèmes sont surveillés en permanence pour détecter toute activité suspecte.',
        },
        {
          icon: CheckCircle,
          title: 'Certifié ISO 27001 & ISO 20000',
          desc: 'Nos systèmes de gestion sont certifiés aux normes internationales de sécurité de l’information.',
        },
        {
          icon: Shield,
          title: 'Protection des données personnelles',
          desc: 'Vos données personnelles sont traitées avec la plus stricte confidentialité conformément à la loi.',
        },
      ],
      tipsTitle: 'Protégez-vous aussi',
      tips: [
        'Utilisez des mots de passe forts et uniques pour chaque service.',
        'Ne partagez jamais vos codes par email, SMS ou téléphone.',
        'Vérifiez régulièrement vos relevés de compte.',
        'Activez les notifications de transaction en temps réel.',
        'Mettez à jour votre navigateur et vos applications.',
        'Signalez immédiatement toute opération suspecte à notre équipe.',
      ],
      ctaTitle: 'Une question sur la sécurité ?',
      ctaDesc: 'Contactez notre équipe pour toute question concernant la sécurité de votre compte.',
      ctaBtn: 'Nous contacter',
    },
    en: {
      badge: 'Security',
      title: 'Your security is our absolute priority',
      subtitle: 'Rigorous measures to protect your data and transactions at every step.',
      measuresHeading: 'Practical protections at every step',
      measures: [
        {
          icon: Lock,
          title: '256-bit SSL encryption',
          desc: 'All communications between your browser and our servers are encrypted end-to-end.',
        },
        {
          icon: Eye,
          title: 'Multi-factor authentication',
          desc: 'A password plus an additional verification for every login to your online account.',
        },
        {
          icon: Shield,
          title: 'PCI DSS compliance',
          desc: 'We follow international payment card security standards.',
        },
        {
          icon: Server,
          title: '24/7 monitoring',
          desc: 'Our systems are continuously monitored to detect any suspicious activity.',
        },
        {
          icon: CheckCircle,
          title: 'ISO 27001 & ISO 20000 certified',
          desc: 'Our management systems meet international information security standards.',
        },
        {
          icon: Shield,
          title: 'Personal data protection',
          desc: 'Your personal data is handled with strict confidentiality in compliance with the law.',
        },
      ],
      tipsTitle: 'Protect yourself too',
      tips: [
        'Use strong, unique passwords for every service.',
        'Never share your codes via email, SMS, or phone.',
        'Check your account statements regularly.',
        'Enable real-time transaction notifications.',
        'Keep your browser and apps up to date.',
        'Report any suspicious activity to our team immediately.',
      ],
      ctaTitle: 'A question about security?',
      ctaDesc: 'Contact our team for any questions about your account security.',
      ctaBtn: 'Contact us',
    },
    ar: {
      badge: 'الأمان',
      title: 'أمانكم أولويتنا المطلقة',
      subtitle: 'إجراءات صارمة لحماية بياناتك ومعاملاتك المالية في كل خطوة.',
      measuresHeading: 'حماية عملية في كل خطوة',
      measures: [
        {
          icon: Lock,
          title: 'تشفير SSL 256 بت',
          desc: 'جميع الاتصالات بين متصفحك وخوادمنا مشفرة من البداية للنهاية.',
        },
        {
          icon: Eye,
          title: 'مصادقة متعددة العوامل',
          desc: 'كلمة مرور بالإضافة إلى تحقق إضافي لكل تسجيل دخول إلى حسابك عبر الإنترنت.',
        },
        {
          icon: Shield,
          title: 'الالتزام بمعيار PCI DSS',
          desc: 'نلتزم بالمعايير الدولية للأمان على بطاقات الدفع.',
        },
        {
          icon: Server,
          title: 'مراقبة على مدار 24/7',
          desc: 'يتم مراقبة أنظمتنا باستمرار لاكتشاف أي نشاط مشبوه.',
        },
        {
          icon: CheckCircle,
          title: 'شهادات ISO 27001 و ISO 20000',
          desc: 'أنظمة إدارة البنك معتمدة وفق المعايير الدولية للأمان المعلوماتي.',
        },
        {
          icon: Shield,
          title: 'حماية البيانات الشخصية',
          desc: 'يتم معالجة بياناتك بسرية تامة وفقًا للقانون.',
        },
      ],
      tipsTitle: 'احمِ نفسك أيضًا',
      tips: [
        'استخدم كلمات مرور قوية وفريدة لكل خدمة.',
        'لا تشارك رموزك عبر البريد أو الرسائل النصية أو الهاتف.',
        'تحقق من كشوف حسابك بانتظام.',
        'فعّل إشعارات المعاملات في الوقت الفعلي.',
        'حدّث متصفحك وتطبيقاتك بانتظام.',
        'أبلغ عن أي نشاط مشبوه لفريقنا فورًا.',
      ],
      ctaTitle: 'لديك سؤال عن الأمان؟',
      ctaDesc: 'تواصل مع فريقنا لأي سؤال حول أمان حسابك.',
      ctaBtn: 'تواصل معنا',
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container max-w-4xl text-center">
          <span className="section-badge section-badge-light">{d.badge}</span>
          <h1 className="text-h1 text-white mt-2 mb-4">{d.title}</h1>
          <p className="text-lg leading-relaxed mx-auto max-w-2xl" style={{ color: '#94a3b8' }}>
            {d.subtitle}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{d.measuresHeading}</span>
            <h2 className="text-h2 text-ink">{d.measuresHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {d.measures.map((measure) => {
              const Icon = measure.icon;
              return (
                <div key={measure.title} className="card card-stripe-blue">
                  <div className="feature-icon">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-h4 text-ink mt-4 mb-2">{measure.title}</h3>
                  <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>
                    {measure.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container max-w-4xl">
          <div className="section-header">
            <span className="section-badge">{d.tipsTitle}</span>
            <h2 className="text-h2 text-ink">{d.tipsTitle}</h2>
          </div>

          <div className="card">
            <ul className="space-y-4">
              {d.tips.map((tip) => (
                <li
                  key={tip}
                  className={`flex items-start gap-3 text-small leading-relaxed ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  style={{ color: '#64748b' }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="text-h2 text-white mb-4">{d.ctaTitle}</h2>
          <p className="text-lg mb-8 leading-relaxed mx-auto max-w-2xl" style={{ color: '#94a3b8' }}>
            {d.ctaDesc}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="btn btn-primary btn-lg inline-flex"
            style={{ color: '#ffffff', textDecoration: 'none' }}
          >
            {d.ctaBtn}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}