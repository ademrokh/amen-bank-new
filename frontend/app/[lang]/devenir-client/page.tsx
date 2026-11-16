import DevenirClientForm from '@/components/DevenirClientForm';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: SiteLanguage }> }) {
  const { lang } = await params;
  return getLocalizedMetadata('becomeClient', lang);
}

type Language = 'fr' | 'en' | 'ar';

type PageContent = {
  title: string;
  subtitle: string;
  intro: string;
  formTitle: string;
  fields: Array<{ label: string; placeholder: string; name: string }>;
  customerTypeLabel: string;
  customerTypePlaceholder: string;
  customerTypes: Array<{ value: string; label: string }>;
  accountTypeLabel: string;
  accountTypePlaceholder: string;
  accountTypes: Array<{ value: string; label: string }>;
  productTypeLabel: string;
  productTypePlaceholder: string;
  productTypes: Array<{ value: string; label: string }>;
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
      ],
      customerTypeLabel: 'Type de clientèle',
      customerTypePlaceholder: 'Sélectionnez une catégorie',
      customerTypes: [
        { value: 'young', label: 'Jeune' },
        { value: 'individual', label: 'Particulier' },
        { value: 'business', label: 'Entreprise' },
      ],
      accountTypeLabel: 'Type de compte',
      accountTypePlaceholder: 'Sélectionnez un type de compte',
      accountTypes: [
        { value: 'savings', label: 'Épargne' },
        { value: 'deposit', label: 'Dépôt' },
      ],
      productTypeLabel: 'Produit',
      productTypePlaceholder: 'Sélectionnez un produit',
      productTypes: [
        { value: 'sesame', label: 'Sesame' },
        { value: 'el-amen', label: 'El Amen' },
        { value: 'technological', label: 'Technologique' },
      ],
      notesHeading: 'Ce dont vous aurez besoin',
      notes: ['Pièce d\'identité valide', 'Coordonnées à jour', 'Un compte adapté à votre profil'],
      submit: 'Préparer la demande',
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
      ],
      customerTypeLabel: 'Customer category',
      customerTypePlaceholder: 'Select a customer category',
      customerTypes: [
        { value: 'young', label: 'Youth' },
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
      ],
      accountTypeLabel: 'Account type',
      accountTypePlaceholder: 'Select an account type',
      accountTypes: [
        { value: 'savings', label: 'Savings' },
        { value: 'deposit', label: 'Deposit' },
      ],
      productTypeLabel: 'Product',
      productTypePlaceholder: 'Select a product',
      productTypes: [
        { value: 'sesame', label: 'Sesame' },
        { value: 'el-amen', label: 'El Amen' },
        { value: 'technological', label: 'Technological' },
      ],
      notesHeading: 'What you will need',
      notes: ['Valid identity document', 'Up-to-date contact details', 'A product suited to your profile'],
      submit: 'Prepare request',
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
      ],
      customerTypeLabel: 'فئة العميل',
      customerTypePlaceholder: 'اختر فئة العميل',
      customerTypes: [
        { value: 'young', label: 'الشباب' },
        { value: 'individual', label: 'الأفراد' },
        { value: 'business', label: 'المؤسسات' },
      ],
      accountTypeLabel: 'نوع الحساب',
      accountTypePlaceholder: 'اختر نوع الحساب',
      accountTypes: [
        { value: 'savings', label: 'ادخار' },
        { value: 'deposit', label: 'وديعة' },
      ],
      productTypeLabel: 'المنتج',
      productTypePlaceholder: 'اختر منتجًا',
      productTypes: [
        { value: 'sesame', label: 'Sesame' },
        { value: 'el-amen', label: 'El Amen' },
        { value: 'technological', label: 'Technologique' },
      ],
      notesHeading: 'ما ستحتاجه',
      notes: ['وثيقة هوية صالحة', 'بيانات اتصال محدثة', 'منتج مناسب لملفك'],
      submit: 'تحضير الطلب',
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