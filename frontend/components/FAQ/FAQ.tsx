'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

interface FAQItem {
  id: string;
  category_fr: string;
  category_ar: string;
  category_en: string;
  question_fr: string;
  question_ar: string;
  question_en: string;
  answer_fr: string;
  answer_ar: string;
  answer_en: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'q1',
    category_fr: 'Particuliers',
    category_ar: 'للأفراد',
    category_en: 'Retail',
    question_fr: "Comment ouvrir un compte Amen Bank ?",
    question_ar: 'كيف أفتح حساب بأمين بنك؟',
    question_en: 'How do I open an Amen Bank account?',
    answer_fr: "L'ouverture d'un compte Amen Bank est simple et rapide. Vous pouvez le faire en ligne via notre plateforme Amen First Bank ou en visitant l'une de nos 164 agences. Vous aurez besoin d'une pièce d'identité valide et d'une adresse de contact.",
    answer_ar: 'فتح حساب بأمين بنك بسيط وسريع. يمكنك القيام به عبر الإنترنت من خلال منصتنا Amen First Bank أو بزيارة أحد فروعنا 164. ستحتاج إلى بطاقة هوية سارية وعنوان اتصال.',
    answer_en: "Opening an Amen Bank account is simple and fast. You can do it online through our Amen First Bank platform or by visiting one of our 164 branches. You'll need a valid ID and a contact address.",
  },
  {
    id: 'q2',
    category_fr: 'Particuliers',
    category_ar: 'للأفراد',
    category_en: 'Retail',
    question_fr: 'Quels sont les frais bancaires ?',
    question_ar: 'ما هي الرسوم البنكية؟',
    question_en: 'What are the banking fees?',
    answer_fr: "Les frais bancaires d'Amen Bank sont parmi les plus compétitifs du marché. Ils varient selon le type de compte et les services utilisés. Pour une liste complète et détaillée des frais, consultez notre barème disponible en agence ou sur le site web.",
    answer_ar: 'الرسوم البنكية لأمين بنك من بين الأكثر تنافسية في السوق. تختلف حسب نوع الحساب والخدمات المستخدمة. للحصول على قائمة كاملة وتفصيلية بالرسوم، يرجى مراجعة رسالتنا المتاحة في الفرع أو على موقع الويب.',
    answer_en: "Amen Bank's banking fees are among the most competitive on the market. They vary depending on the type of account and services used. For a complete list of fees, consult our schedule available at any branch or on our website.",
  },
  {
    id: 'q3',
    category_fr: 'Particuliers',
    category_ar: 'للأفراد',
    category_en: 'Retail',
    question_fr: 'Comment accéder à Amen First Bank ?',
    question_ar: 'كيف يمكنني الوصول إلى Amen First Bank؟',
    question_en: 'How do I access Amen First Bank?',
    answer_fr: "Amen First Bank est notre plateforme de banque digitale accessible 24h/24. Vous pouvez y accéder via notre application mobile ou notre site web en utilisant vos identifiants de connexion sécurisés.",
    answer_ar: 'Amen First Bank هي منصتنا للخدمات المصرفية الرقمية المتاحة 24 ساعة. يمكنك الوصول إليها عبر تطبيقنا للهاتف المحمول أو موقعنا على الويب باستخدام بيانات اعتمادك الآمنة.',
    answer_en: 'Amen First Bank is our digital banking platform accessible 24/7. You can access it through our mobile app or website using your secure login credentials.',
  },
  {
    id: 'q4',
    category_fr: 'Entreprises',
    category_ar: 'للشركات',
    category_en: 'Business',
    question_fr: 'Quels services bancaires pour les entreprises ?',
    question_ar: 'ما هي الخدمات المصرفية للشركات؟',
    question_en: 'What banking services do you offer for businesses?',
    answer_fr: "Nous offrons une gamme complète de services pour les entreprises : comptes professionnels, financements, crédits commerciaux, gestion de trésorerie, paiements internationaux, et bien d'autres solutions adaptées à vos besoins.",
    answer_ar: 'نحن نقدم مجموعة شاملة من الخدمات للشركات: الحسابات المهنية والتمويل والائتمانات التجارية وإدارة الأموال والمدفوعات الدولية والعديد من الحلول الأخرى المكيفة مع احتياجاتك.',
    answer_en: 'We offer a comprehensive range of business services: professional accounts, financing, commercial credits, cash management, international payments, and many other solutions tailored to your needs.',
  },
  {
    id: 'q5',
    category_fr: 'Sécurité',
    category_ar: 'الأمان',
    category_en: 'Security',
    question_fr: 'Comment mes données sont-elles protégées ?',
    question_ar: 'كيف تتم حماية بياناتي؟',
    question_en: 'How are my data protected?',
    answer_fr: 'Vos données sont protégées par les normes de sécurité les plus strictes. Nous utilisons le chiffrement SSL, l\'authentification multifactorielle et conformons aux standards PCI DSS pour garantir la sécurité de vos transactions.',
    answer_ar: 'يتم حماية بيانات باستخدام معايير الأمان الأكثر صرامة. نستخدم تشفير SSL والمصادقة متعددة العوامل ونمتثل لمعايير PCI DSS لضمان أمان معاملاتك.',
    answer_en: 'Your data is protected by the strictest security standards. We use SSL encryption, multi-factor authentication, and comply with PCI DSS standards to ensure transaction security.',
  },
  {
    id: 'q6',
    category_fr: 'Épargne',
    category_ar: 'الادخار',
    category_en: 'Savings',
    question_fr: "Quels sont les fonds d'investissement disponibles ?",
    question_ar: 'ما هي صناديق الاستثمار المتاحة؟',
    question_en: 'What investment funds are available?',
    answer_fr: 'Nous proposons trois types de SICAV : un fonds équilibré pour une approche modérée, un fonds de croissance pour les investisseurs dynamiques, et un fonds conservateur pour la sécurité. Chaque fonds est géré par des experts en placements.',
    answer_ar: 'نحن نقدم ثلاثة أنواع من صناديق الاستثمار: صندوق متوازن للنهج المعتدل وصندوق نمو للمستثمرين الديناميين وصندوق محافظ للأمان. يتم إدارة كل صندوق من قبل خبراء الاستثمار.',
    answer_en: 'We offer three types of investment funds: a balanced fund for a moderate approach, a growth fund for dynamic investors, and a conservative fund for safety. Each fund is managed by investment experts.',
  },
];

function getFAQContent(item: FAQItem, lang: Language) {
  return {
    category: lang === 'fr' ? item.category_fr : lang === 'ar' ? item.category_ar : item.category_en,
    question: lang === 'fr' ? item.question_fr : lang === 'ar' ? item.question_ar : item.question_en,
    answer:   lang === 'fr' ? item.answer_fr   : lang === 'ar' ? item.answer_ar   : item.answer_en,
  };
}

export default function FAQ() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Extract current language
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  // Get unique categories
  const categories = Array.from(
    new Set(faqItems.map((item) => getFAQContent(item, currentLang).category))
  );

  // Filter FAQs based on search and category
  const filteredFAQs = faqItems.filter((item) => {
    const content = getFAQContent(item, currentLang);
    const matchesSearch =
      content.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || content.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const ui = {
    fr: {
      pageTitle: 'Questions Fréquemment Posées',
      pageDescription: 'Trouvez les réponses à vos questions sur nos services bancaires',
      searchPlaceholder: 'Rechercher une question...',
      all: 'Tous',
      nothingFound: 'Aucune question trouvée. Essayez une autre recherche.',
      chatbotCTA: 'Vous ne trouvez pas la réponse ?',
      chatbotDesc: 'Contactez notre chatbot IA pour une assistance immédiate 24h/24',
      launchChatbot: 'Lancer le Chatbot',
    },
    ar: {
      pageTitle: 'الأسئلة الشائعة',
      pageDescription: 'ابحث عن إجابات لأسئلتك حول خدماتنا المصرفية',
      searchPlaceholder: 'ابحث عن سؤال...',
      all: 'الكل',
      nothingFound: 'لم يتم العثور على أي سؤال. جرب بحثا آخر.',
      chatbotCTA: 'لا تجد الجواب؟',
      chatbotDesc: 'اتصل بروبوتنا الحواري بالذكاء الاصطناعي للحصول على مساعدة فورية 24/7',
      launchChatbot: 'إطلاق روبوت الحوار',
    },
    en: {
      pageTitle: 'Frequently Asked Questions',
      pageDescription: 'Find answers to your questions about our banking services',
      searchPlaceholder: 'Search a question...',
      all: 'All',
      nothingFound: 'No questions found. Try another search.',
      chatbotCTA: "Can't find the answer?",
      chatbotDesc: 'Contact our AI chatbot for immediate 24/7 assistance',
      launchChatbot: 'Launch Chatbot',
    },
  }[currentLang];

  return (
    <section
      className="py-20 bg-linear-to-b from-white to-slate-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{ui.pageTitle}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{ui.pageDescription}</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-6 h-6 text-slate-400 pointer-events-none`}
            />
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 ${isRTL ? 'pr-6 pl-14' : 'pl-6 pr-14'} bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all outline-none`}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeCategory === null
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-900'
            }`}
          >
            {ui.all}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-12">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((item) => {
                const content = getFAQContent(item, currentLang);
                const isExpanded = expandedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={`w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${item.id}`}
                    >
                      <div className="grow">
                        <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                          {content.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{content.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-slate-600 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isRTL ? 'mr-4' : 'ml-4'}`}
                      />
                    </button>
                    {isExpanded && (
                      <div
                        id={`faq-answer-${item.id}`}
                        role="region"
                        className="px-6 py-4 bg-linear-to-b from-slate-50 to-white border-t border-slate-200"
                      >
                        <p className="text-slate-700 leading-relaxed">{content.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-lg">{ui.nothingFound}</p>
            </div>
          )}
        </div>

        {/* Chatbot CTA */}
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-cyan-800 rounded-2xl p-12 text-center text-white shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4">{ui.chatbotCTA}</h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">{ui.chatbotDesc}</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <MessageCircle className="w-5 h-5" />
            {ui.launchChatbot}
          </button>
        </div>
      </div>
    </section>
  );
}