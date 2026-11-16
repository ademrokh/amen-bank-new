import type { Metadata } from 'next';

export type SiteLanguage = 'fr' | 'en' | 'ar';
export type MetadataPage =
  | 'site'
  | 'accessInformation'
  | 'news'
  | 'agencies'
  | 'amenFirstBank'
  | 'faq'
  | 'careers'
  | 'contact'
  | 'becomeClient'
  | 'business'
  | 'identity'
  | 'security'
  | 'sustainability'
  | 'terms';

const localizedMetadata: Record<SiteLanguage, Record<MetadataPage, Metadata>> = {
  fr: {
    site: {
      title: 'Amen Bank - Votre partenaire financier en Tunisie',
      description: 'Solutions bancaires pour les particuliers et les entreprises, avec Amen Bank depuis 1980.',
    },
    accessInformation: {
      title: 'Accès à l’information - Amen Bank',
      description: 'Découvrez le droit d’accès à l’information, les procédures de demande et les documents publiés par Amen Bank.',
    },
    news: {
      title: 'Actualités - Amen Bank',
      description: 'Dernières actualités et communiqués de presse d’Amen Bank.',
    },
    agencies: {
      title: 'Réseau d’agences - Amen Bank',
      description: 'Trouvez l’agence Amen Bank la plus proche grâce à notre localisateur interactif.',
    },
    amenFirstBank: {
      title: 'Amen First Bank - Amen Bank',
      description: 'Découvrez la banque digitale Amen First Bank et ouvrez un compte en ligne.',
    },
    faq: {
      title: 'AmenGPT - Amen Bank',
      description: 'Obtenez des réponses à vos questions sur les services et produits d’Amen Bank.',
    },
    careers: {
      title: 'Carrières - Amen Bank',
      description: 'Découvrez les opportunités de carrière et rejoignez les équipes d’Amen Bank.',
    },
    contact: {
      title: 'Contact - Amen Bank',
      description: 'Contactez Amen Bank pour toute question ou demande d’information.',
    },
    becomeClient: {
      title: 'Devenir client - Amen Bank',
      description: 'Remplissez le formulaire pour demander l’ouverture d’un compte chez Amen Bank.',
    },
    business: {
      title: 'Solutions bancaires pour entreprises - Amen Bank',
      description: 'Découvrez les solutions de financement et de gestion dédiées aux entreprises.',
    },
    identity: {
      title: 'Notre identité - Amen Bank',
      description: 'Découvrez l’histoire, la mission, les valeurs et les engagements d’Amen Bank.',
    },
    security: {
      title: 'Sécurité - Amen Bank',
      description: 'Découvrez comment Amen Bank protège vos données et vos transactions.',
    },
    sustainability: {
      title: 'Développement durable - Amen Bank',
      description: 'Découvrez les engagements d’Amen Bank en faveur d’un développement durable et responsable.',
    },
    terms: {
      title: 'Conditions générales - Amen Bank',
      description: 'Consultez les conditions générales d’utilisation des services Amen Bank.',
    },
  },
  en: {
    site: {
      title: 'Amen Bank - Your Trusted Financial Partner',
      description: 'Banking solutions for individuals and businesses in Tunisia, backed by over 40 years of trust.',
    },
    accessInformation: {
      title: 'Access to Information - Amen Bank',
      description: 'Learn about access to public information, request procedures, and documents published by Amen Bank.',
    },
    news: {
      title: 'News - Amen Bank',
      description: 'The latest news and press releases from Amen Bank.',
    },
    agencies: {
      title: 'Branch Network - Amen Bank',
      description: 'Find your nearest Amen Bank branch with our interactive locator.',
    },
    amenFirstBank: {
      title: 'Amen First Bank - Amen Bank',
      description: 'Explore Amen First Bank digital banking and open an account online.',
    },
    faq: {
      title: 'AmenGPT - Amen Bank',
      description: 'Get answers to your questions about Amen Bank products and services.',
    },
    careers: {
      title: 'Careers - Amen Bank',
      description: 'Explore career opportunities and join the Amen Bank team.',
    },
    contact: {
      title: 'Contact - Amen Bank',
      description: 'Contact Amen Bank with any questions or requests for information.',
    },
    becomeClient: {
      title: 'Become a Client - Amen Bank',
      description: 'Complete the form to request an account with Amen Bank.',
    },
    business: {
      title: 'Business Banking Solutions - Amen Bank',
      description: 'Explore financing and banking solutions designed for businesses.',
    },
    identity: {
      title: 'Our Identity - Amen Bank',
      description: 'Learn about Amen Bank’s history, mission, values, and commitments.',
    },
    security: {
      title: 'Security - Amen Bank',
      description: 'Learn how Amen Bank protects your data and transactions.',
    },
    sustainability: {
      title: 'Sustainability - Amen Bank',
      description: 'Explore Amen Bank’s commitment to responsible and sustainable development.',
    },
    terms: {
      title: 'Terms and Conditions - Amen Bank',
      description: 'Read the terms and conditions for using Amen Bank services.',
    },
  },
  ar: {
    site: {
      title: 'بنك آمن - شريكك المالي الموثوق',
      description: 'حلول مصرفية للأفراد والشركات في تونس، بخبرة تمتد لأكثر من 40 عامًا.',
    },
    accessInformation: {
      title: 'النفاذ إلى المعلومات - بنك آمن',
      description: 'تعرّف على حق النفاذ إلى المعلومات وإجراءات الطلب والوثائق المنشورة من بنك آمن.',
    },
    news: {
      title: 'الأخبار - بنك آمن',
      description: 'آخر أخبار بنك آمن وبياناته الصحفية.',
    },
    agencies: {
      title: 'شبكة الفروع - بنك آمن',
      description: 'اعثر على أقرب فرع لبنك آمن باستخدام محدد الفروع التفاعلي.',
    },
    amenFirstBank: {
      title: 'Amen First Bank - بنك آمن',
      description: 'اكتشف الخدمات المصرفية الرقمية من Amen First Bank وافتح حسابًا عبر الإنترنت.',
    },
    faq: {
      title: 'AmenGPT - بنك آمن',
      description: 'احصل على إجابات حول منتجات بنك آمن وخدماته.',
    },
    careers: {
      title: 'الوظائف - بنك آمن',
      description: 'اكتشف فرص العمل وانضم إلى فريق بنك آمن.',
    },
    contact: {
      title: 'اتصل بنا - بنك آمن',
      description: 'تواصل مع بنك آمن لطرح الأسئلة أو طلب المعلومات.',
    },
    becomeClient: {
      title: 'كن عميلًا - بنك آمن',
      description: 'املأ النموذج لتقديم طلب فتح حساب لدى بنك آمن.',
    },
    business: {
      title: 'حلول مصرفية للشركات - بنك آمن',
      description: 'اكتشف حلول التمويل والخدمات المصرفية المخصصة للشركات.',
    },
    identity: {
      title: 'هويتنا - بنك آمن',
      description: 'تعرّف على تاريخ بنك آمن ورسالته وقيمه والتزاماته.',
    },
    security: {
      title: 'الأمان - بنك آمن',
      description: 'تعرّف على كيفية حماية بنك آمن لبياناتك ومعاملاتك.',
    },
    sustainability: {
      title: 'التنمية المستدامة - بنك آمن',
      description: 'اكتشف التزام بنك آمن بالتنمية المستدامة والمسؤولة.',
    },
    terms: {
      title: 'الشروط والأحكام - بنك آمن',
      description: 'اطّلع على شروط وأحكام استخدام خدمات بنك آمن.',
    },
  },
};

export function getLocalizedMetadata(page: MetadataPage, language: SiteLanguage): Metadata {
  return localizedMetadata[language][page];
}