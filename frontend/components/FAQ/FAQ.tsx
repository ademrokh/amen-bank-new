'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

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
    question_fr: 'Comment ouvrir un compte Amen Bank ?',
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
    answer_fr: "Vos données sont protégées par les normes de sécurité les plus strictes. Nous utilisons le chiffrement SSL, l'authentification multifactorielle et conformons aux standards PCI DSS pour garantir la sécurité de vos transactions.",
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
    category:
      lang === 'fr'
        ? item.category_fr
        : lang === 'ar'
          ? item.category_ar
          : item.category_en,
    question:
      lang === 'fr'
        ? item.question_fr
        : lang === 'ar'
          ? item.question_ar
          : item.question_en,
    answer:
      lang === 'fr'
        ? item.answer_fr
        : lang === 'ar'
          ? item.answer_ar
          : item.answer_en,
  };
}

export default function FAQ() {
  const { lang: currentLang, isRTL } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* Unique categories in display order */
  const categories = Array.from(
    new Set(faqItems.map((item) => getFAQContent(item, currentLang).category))
  );

  /* Filter by search + category */
  const filteredFAQs = faqItems.filter((item) => {
    const c = getFAQContent(item, currentLang);
    const matchesSearch =
      c.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**
   * Opens the chatbot widget in maximized/overview mode.
   * The ChatbotWidget (file #11) listens for this custom event
   * and sets itself to open + maximized state.
   */
  const openChatbot = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'));
  };

  const ui = {
    fr: {
      pageTitle: 'Questions Fréquemment Posées',
      pageDescription:
        'Trouvez les réponses à vos questions sur nos services bancaires',
      searchPlaceholder: 'Rechercher une question...',
      all: 'Tous',
      nothingFound: 'Aucune question trouvée. Essayez une autre recherche.',
      chatbotCTA: 'Vous ne trouvez pas la réponse ?',
      chatbotDesc:
        'Contactez notre chatbot IA pour une assistance immédiate 24h/24',
      launchChatbot: 'Lancer le Chatbot',
    },
    ar: {
      pageTitle: 'الأسئلة الشائعة',
      pageDescription: 'ابحث عن إجابات لأسئلتك حول خدماتنا المصرفية',
      searchPlaceholder: 'ابحث عن سؤال...',
      all: 'الكل',
      nothingFound: 'لم يتم العثور على أي سؤال. جرب بحثا آخر.',
      chatbotCTA: 'لا تجد الجواب؟',
      chatbotDesc:
        'اتصل بروبوتنا الحواري بالذكاء الاصطناعي للحصول على مساعدة فورية 24/7',
      launchChatbot: 'إطلاق روبوت الحوار',
    },
    en: {
      pageTitle: 'Frequently Asked Questions',
      pageDescription:
        'Find answers to your questions about our banking services',
      searchPlaceholder: 'Search a question...',
      all: 'All',
      nothingFound: 'No questions found. Try another search.',
      chatbotCTA: "Can't find the answer?",
      chatbotDesc:
        'Contact our AI chatbot for immediate 24/7 assistance',
      launchChatbot: 'Launch Chatbot',
    },
  }[currentLang];

  return (
    <section className="bg-surface py-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* ── Header: Label → Headline → Sub ── */}
        <div className="section-header">
          <h1>{ui.pageTitle}</h1>
          <p>{ui.pageDescription}</p>
        </div>

        {/* ── Search ── */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`input-field ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none ${
                isRTL ? 'right-4' : 'left-4'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Category Filters ── */}
        <div className={`flex flex-wrap gap-2 justify-center mb-12`}>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-small font-medium rounded-lg border transition-colors ${
              activeCategory === null
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-ink-secondary border-border hover:border-slate-300'
            }`}
          >
            {ui.all}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-small font-medium rounded-lg border transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-ink-secondary border-border hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ── Accordion ── */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-3">
              {filteredFAQs.map((item) => {
                const c = getFAQContent(item, currentLang);
                const isOpen = expandedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                  >
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={`w-full flex items-start gap-4 p-5 bg-transparent border-none cursor-pointer text-left transition-colors ${
                        isRTL ? 'text-right flex-row-reverse' : ''
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        {/* Category: uppercase 0.6875rem, secondary color */}
                        <span className="section-label section-label-secondary mb-1! block!">
                          {c.category}
                        </span>
                        <h3 className="text-base font-semibold text-ink leading-snug">
                          {c.question}
                        </h3>
                      </div>
                      {/* Chevron: right-aligned, rotates 180deg on open */}
                      <ChevronDown
                        className={`faq-chevron w-5 h-5 text-ink-muted shrink-0 mt-1 ${
                          isOpen ? 'faq-chevron-open' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${item.id}`}
                        role="region"
                        className="faq-answer text-small text-ink-secondary leading-relaxed"
                      >
                        {c.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-ink-muted">{ui.nothingFound}</p>
            </div>
          )}
        </div>

        {/* ── Chatbot CTA — flat #0f172a, opens chatbot maximized ── */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-slate-900 rounded-lg p-10 sm:p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-white/6 border border-white/10 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-h2 text-white mb-3">{ui.chatbotCTA}</h3>
            <p className="text-ink-muted mb-8 max-w-xl mx-auto leading-relaxed">
              {ui.chatbotDesc}
            </p>
            <button
              onClick={openChatbot}
              className="btn btn-white btn-lg"
            >
              <MessageCircle className="w-5 h-5" />
              {ui.launchChatbot}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}