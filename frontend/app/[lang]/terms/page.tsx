type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Conditions Générales - Amen Bank',
  description: "Conditions générales d'utilisation des services Amen Bank.",
};

export default async function TermsPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content = {
    fr: {
      title: 'Conditions Générales d\'Utilisation',
      lastUpdated: 'Dernière mise à jour : 1er janvier 2025',
      intro: 'Les présentes conditions générales régissent l\'utilisation des services et de la plateforme Amen Bank. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.',
      sections: [
        {
          title: '1. Objet',
          text: 'Les présentes conditions générales définissent les conditions d\'utilisation de l\'ensemble des services proposés par Amen Bank, accessibles via notre site web, notre application mobile Amen First Bank, nos agences et tout autre canal autorisé.',
        },
        {
          title: '2. Ouverture de compte',
          text: 'L\'ouverture d\'un compte implique l\'acceptation des présentes conditions, la fourniture d\'informations exactes et véridiques, ainsi que le respect des conditions spécifiques du type de compte choisi.',
        },
        {
          title: 'Utilisation des services',
          text: 'L\'utilisation de nos services bancaires est soumise au respect des conditions tarifaires en vigueur, des limites de transaction et des réglementations en vigueur. L\'utilisateur s\'engage à ne pas utiliser les services à des fins illicites.',
        },
        {
          title: 'Sécurité',
          text: 'Le client est responsable de la confidentialité de ses identifiants de connexion. En cas de soupçon de fraude ou d\'utilisation non autorisée, Amen Bank se réserve le droit de suspendre ou clôturer le compte sans préavis.',
        },
        {
          title: 'Propriété intellectuelle',
          text: 'Tous les contenus du site web, de l\'application et des supports de communication sont la propriété d\'Amen Bank. Toute reproduction non autorisée est strictement interdite.',
        },
        {
          title: 'Limitation de responsabilité',
          text: 'Amen Bank met tout en œuvre pour assurer la fiabilité de ses services, mais ne saurait être tenu responsable des pertes indirectes liées à des facteurs externes tels que des pannes de réseau.',
        },
        {
          title: 'Modifications',
          text: 'Amen Bank se réserve le droit de modifier les présentes conditions à tout moment. Les modifications seront notifiées aux utilisateurs par les canaux officiels de la banque.',
        },
        {
          title: 'Droit applicable',
          text: 'Les présentes conditions sont régies par le droit tunisien. En cas de litige, le tribunal compétent de Tunis sera seul compétent.',
        },
        {
          title: 'Contact',
          text: 'Pour toute question relative aux présentes conditions, contactez-nous par email à contact@amenbank.com.tn ou via le formulaire de contact.',
        },
      ],
    },
    en: {
      title: 'General Terms of Use',
      lastUpdated: 'Last updated: January 1, 2025',
      intro: 'These general terms govern the use of Amen Bank\'s services, accessible via our website, Amen First Bank app, our branches, and any other authorized channel. By using our services, you accept these terms in full.',
      sections: [
        {
          title: '1. Scope',
          text: 'These general terms define the conditions of use for all services offered by Amen Bank, accessible via our website, Amen First Bank app, our branches, and any other authorized channel.',
        },
        {
          title: '2. Account opening',
          text: 'Opening an account implies acceptance of these terms, providing accurate and truthful information, and compliance with the specific conditions of the chosen account type.',
        },
        {
          title: 'Service usage',
          text: 'Using our banking services is subject to current tariff conditions, transaction limits, and applicable regulations. The user agrees not to use services for illegal purposes.',
        },
        {
          title: 'Security',
          text: 'The client is responsible for the confidentiality of their login credentials. In case of suspected fraud or unauthorized use, Amen Bank reserves the right to suspend or close the account without notice.',
        },
        {
          title: 'Intellectual property',
          text: 'All content on the website, app, and communication materials are the property of Amen Bank. Any unauthorized reproduction is strictly prohibited.',
        },
        {
          title: 'Liability limitation',
          text: 'Amen Bank strives to ensure service reliability but shall not be held liable for indirect losses linked to external factors beyond its control.',
        },
        {
          title: 'Modifications',
          text: 'Amen Bank reserves the right to modify these terms at any time. Changes will be notified through official bank channels.',
        },
        {
          title: 'Governing law',
          text: 'These terms are governed by Tunisian law. In case of litigation, the competent Tunisian court shall have sole jurisdiction.',
        },
        {
          title: 'Contact',
          text: 'For any questions regarding these terms, contact us at contact@amenbank.com.tn or via the contact form.',
        },
      ],
    },
    ar: {
      title: 'الشروط العامة للاستخدام',
      lastUpdated: 'آخر تحديث: 1 يناير 2025',
      intro: 'تنظم هذه الشروط العامة استخدام جميع الخدمات المقدمة من بنك آمن، عبر موقعنا الإلكتروني تطبيق بنك فيرست، فروعنا وأي قناة أخرى مصرح بها. باستخدام خدماتنا، فإنك تقبل هذه الشروط بالكامل.',
      sections: [
        {
          title: '1. النطاق',
          text: 'تنظم هذه الشروط العامة شروط استخدام جميع الخدمات المقدمة من بنك آمن، عبر موقعنا الإلكتروني تطبيق بنك فيرست، فروعنا وأي قناة أخرى مصرح بها.',
        },
        {
          title: 'فتح حساب',
          text: 'فتح حساب يعني قبول هذه الشروط، وتقديم معلومات دقيقة وصحيحة، والامتثال للشروط المحددة لنوع الحساب المختار.',
        },
        {
          title: 'استخدام الخدمات',
          text: 'يخضع استخدام خدماتنا للشروط التعريفة السارية، وحدود المعاملات، والأنظمة المعمول بها.',
        },
        {
          title: 'الأمان',
          text: 'العميل مسؤول عن سرية بيانات تسجيل الدخول. في حالة الاشتباه في الاحتيال أو الاستخدام غير المصرح، يحتفظ بنك آمن بالحق في تعليق الحساب دون إشعار.',
        },
        {
          title: 'الملكية الفكرية',
          text: 'جميع المحتوى على الموقع والتطبيق ووسائل الاتصال ملك بنك آمن. أي نسخ غير مصرح به ممنوع صراحةً.',
        },
        {
          title: 'حدود المسؤولية',
          text: 'يبذل بنك آمن قصارى جهده لضمان موثوقية الخدمات، لكنه لن يكون مسؤولاً عن الخسائر غير المباشرة الناتجة عن عوامل خارج سيطرته.',
        },
        {
          title: 'تعديلات',
          text: 'يحتفظ بنك آمن بالحق في تعديل هذه الشروط في أي وقت. يتم إخطار المستخدمين عبر القنوات الرسمية للبنك.',
        },
        {
          title: 'القانون المعمول به',
          text: 'تخضع هذه الشروط للقانون التونسي. وفي حال النزاع، تكون محكمة تونس المختصة وحدها هي المختصة.',
        },
        {
          title: 'اتصل بنا',
          text: 'لأي سؤال حول هذه الشروط، تواصل معنا عبر contact@amenbank.com.tn أو نموذج الاتصال.',
        },
      ],
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="section-lg" style={{ background: '#0f172a' }}>
        <div className="container max-w-4xl">
          <span className="section-badge section-badge-light">{d.lastUpdated}</span>
          <h1 className="text-h1 text-white mt-2 mb-4">{d.title}</h1>
          <p className="text-lg leading-relaxed max-w-3xl" style={{ color: '#94a3b8' }}>
            {d.intro}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container max-w-4xl">
          <div className="section-header">
            <span className="section-badge">Informations</span>
            <h2 className="text-h2 text-ink">{d.title}</h2>
          </div>

          <div className="space-y-6">
            {d.sections.map((section) => (
              <div key={section.title} className="card">
                <h2 className="text-h4 text-ink mb-3">{section.title}</h2>
                <p className="text-small leading-relaxed" style={{ color: '#64748b' }}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}