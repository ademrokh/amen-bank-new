import DevenirClientForm from '@/components/DevenirClientForm';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Devenir client - Amen Bank',
  description: 'Remplissez notre formulaire pour ouvrir un compte chez Amen Bank.',
};

type Language = 'fr' | 'en' | 'ar';

type PageContent = {
  title: string;
  subtitle: string;
  intro: string;
  formTitle: string;
  fields: Array<{ label: string; placeholder: string; name: string }>;
  notesHeading: string;
  notes: string[];
  submit: string;
  secondary: string;
  messageLabel: string;
  messagePlaceholder: string;
  success: string;
  error: string;
  loading: string;
};

export default async function DevenirClientPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;

  const content: Record<Language, PageContent> = {
    fr: {
      title: 'Devenir client',
      subtitle: 'Remplissez le formulaire ci-dessous pour demander l\'ouverture d\'un compte chez Amen Bank.',
      intro: 'Le traitement de votre demande est rapide et nous vous recontactons dès que votre dossier est reçu.',
      formTitle: 'Formulaire de demande',
      fields: [
        { label: 'Nom complet', placeholder: 'Entrez votre nom complet', name: 'fullName' },
        { label: 'Email', placeholder: 'Entrez votre adresse email', name: 'email' },
        { label: 'Téléphone', placeholder: 'Entrez votre numéro de téléphone', name: 'phone' },
        { label: 'Type de compte', placeholder: 'Particulier, jeune, entreprise...', name: 'accountType' },
      ],
      notesHeading: 'Ce dont vous aurez besoin',
      notes: ['Pièce d\'identité valide', 'Coordonnées à jour', 'Un compte adapté à votre profil'],
      submit: 'Envoyer la demande',
      secondary: 'Voir les offres',
      messageLabel: 'Message',
      messagePlaceholder: 'Ajoutez un détail ou une précision si nécessaire',
      success: 'Votre demande a bien été envoyée. Nous vous recontactons rapidement.',
      error: 'Votre demande n\'a pas pu être envoyée. Veuillez réessayer.',
      loading: 'Envoi...',
    },
    en: {
      title: 'Become a client',
      subtitle: 'Fill out the form below to request the opening of an account with Amen Bank.',
      intro: 'Your request is processed quickly and we will contact you as soon as your file is received.',
      formTitle: 'Application form',
      fields: [
        { label: 'Full name', placeholder: 'Enter your full name', name: 'fullName' },
        { label: 'Email', placeholder: 'Enter your email address', name: 'email' },
        { label: 'Phone', placeholder: 'Enter your phone number', name: 'phone' },
        { label: 'Account type', placeholder: 'Retail, youth, business...', name: 'accountType' },
      ],
      notesHeading: 'What you will need',
      notes: ['Valid identity document', 'Up-to-date contact details', 'A product suited to your profile'],
      submit: 'Submit request',
      secondary: 'View offers',
      messageLabel: 'Message',
      messagePlaceholder: 'Add any additional details if needed',
      success: 'Your request has been sent successfully. We will get back to you shortly.',
      error: 'Your request could not be sent. Please try again.',
      loading: 'Sending...',
    },
    ar: {
      title: 'كن عميلًا',
      subtitle: 'املأ النموذج أدناه لطلب فتح حساب لدى بنك آمن.',
      intro: 'سيتم معالجة طلبك بسرعة وسنتواصل معك بمجرد استلام ملفك.',
      formTitle: 'نموذج الطلب',
      fields: [
        { label: 'الاسم الكامل', placeholder: 'أدخل اسمك الكامل', name: 'fullName' },
        { label: 'البريد الإلكتروني', placeholder: 'أدخل بريدك الإلكتروني', name: 'email' },
        { label: 'الهاتف', placeholder: 'أدخل رقم هاتفك', name: 'phone' },
        { label: 'نوع الحساب', placeholder: 'فردي، شاب، شركة...', name: 'accountType' },
      ],
      notesHeading: 'ما ستحتاجه',
      notes: ['وثيقة هوية صالحة', 'بيانات اتصال محدثة', 'منتج مناسب لملفك'],
      submit: 'إرسال الطلب',
      secondary: 'عرض العروض',
      messageLabel: 'ملاحظات',
      messagePlaceholder: 'أضف أي تفاصيل إضافية إذا لزم الأمر',
      success: 'تم إرسال طلبك بنجاح. سنعاود الاتصال بك قريبًا.',
      error: 'تعذر إرسال طلبك. يُرجى المحاولة مرة أخرى.',
      loading: 'جارٍ الإرسال...',
    },
  };

  const page = content[lang];

  return <DevenirClientForm lang={lang} page={page} />;
}