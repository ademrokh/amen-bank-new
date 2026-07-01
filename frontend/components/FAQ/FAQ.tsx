'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Loader, Send, AlertCircle } from 'lucide-react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const greetingMap: Record<Language, string> = {
  fr: "Bonjour ! Je suis l'assistant bancaire d'Amen Bank. Posez-moi vos questions sur Amen First Bank, vos comptes, cartes ou crédits.",
  ar: 'أهلا! أنا المساعد تاع أمين بنك. اسألني على Amen First Bank، الكومبتات، الكارطات وإلا القروض.',
  en: "Hello! I'm Amen Bank's banking assistant. Ask me anything about Amen First Bank, accounts, cards or loans.",
};

const getInitialMessages = (lang: Language): Message[] => [
  { id: '1', role: 'bot', content: greetingMap[lang], timestamp: new Date() },
];

const uiMap: Record<Language, { title: string; status: string; placeholder: string; typing: string; error: string; retry: string; sendAria: string; suggestions: string; }> = {
  fr: { title: 'Assistant Bancaire', status: 'En ligne', placeholder: 'Tapez votre message…', typing: "L'assistant tape…", error: 'Impossible de se connecter au service. Veuillez réessayer.', retry: 'Réessayer', sendAria: 'Envoyer', suggestions: 'Questions fréquentes' },
  ar: { title: 'المساعد البنكي', status: 'حاضر', placeholder: 'اكتب سؤالك…', typing: 'المساعد يكتب…', error: 'ما تقدرش تكمل. عاود المحاولة.', retry: 'عاود', sendAria: 'ابعث', suggestions: 'أسئلة متداولة' },
  en: { title: 'Banking Assistant', status: 'Online', placeholder: 'Type your message…', typing: 'Assistant is typing…', error: 'Unable to connect to the service. Please try again.', retry: 'Try Again', sendAria: 'Send', suggestions: 'Common questions' },
};

const quickReplies: Record<Language, string[]> = {
  fr: ['Qu\'est-ce qu\'Amen First Bank ?', 'Comment ouvrir un compte ?', 'Comment retirer de l\'argent ?', 'Crédit auto ou logement ?', 'Contacter le CRC'],
  ar: ['آش هو Amen First Bank؟', 'كيفاش نفتح كومبت؟', 'كيفاش نسحب فلوس؟', 'كريدي سيارة وإلا سكن؟', 'كيفاش نكلم CRC؟'],
  en: ['What is Amen First Bank?', 'How to open an account?', 'How to withdraw money?', 'Auto or housing loan?', 'Contact the CRC'],
};

const responsePairs: Record<Language, Array<[string, string]>> = {
  fr: [
    ['amen first', 'Absolument ! Avec Amen First Bank vous pouvez ouvrir un compte de dépôt ou un compte épargne.'],
    ["qu'est-ce", 'Amen First Bank (AFB) est l\'agence en ligne d\'Amen Bank, disponible 7j/7 et 24h/24. Vous pouvez y ouvrir un compte dépôt ou épargne et bénéficier de tarifs réduits.'],
    ['avantage', 'En tant que client Amen First Bank, vous bénéficiez :\n• Tarification avantageuse (moins de 50 % des tarifs en agence classique, pouvant aller jusqu\'à la gratuité totale).\n• Disponibilité de l\'agence AFB 7j/7 et 24h/24.'],
    ['privilège', 'En tant que client Amen First Bank, vous bénéficiez :\n• Tarification avantageuse (moins de 50 % des tarifs en agence classique, pouvant aller jusqu\'à la gratuité totale).\n• Disponibilité de l\'agence AFB 7j/7 et 24h/24.'],
    ['retirer', 'Vous pouvez retirer de l\'argent :\n• En utilisant votre carte dans les espaces libre-service ou tout DAB bancaire (compte dépôt), ou uniquement aux DAB Amen Bank (compte épargne).\n• En vous rendant dans n\'importe quelle agence Amen Bank.'],
    ['retrait', 'Vous pouvez retirer de l\'argent :\n• En utilisant votre carte dans les espaces libre-service ou tout DAB bancaire (compte dépôt), ou uniquement aux DAB Amen Bank (compte épargne).\n• En vous rendant dans n\'importe quelle agence Amen Bank.'],
    ['dab', 'Utilisez votre carte dans les espaces libre-service ou tout DAB bancaire (compte dépôt), ou uniquement aux DAB Amen Bank (compte épargne).'],
    ['déposer', 'Vous pouvez déposer de l\'argent :\n• Dans n\'importe quelle agence du réseau Amen Bank.\n• Dans les espaces libre-service.'],
    ['dépôt', 'Vous pouvez déposer de l\'argent :\n• Dans n\'importe quelle agence du réseau Amen Bank.\n• Dans les espaces libre-service.'],
    ['chargé', 'Vous pouvez contacter votre chargé clientèle par téléphone, visioconférence (sur rendez-vous), email ou par courrier.'],
    ['conseiller', 'Vous pouvez contacter votre conseiller par téléphone, visioconférence (sur rendez-vous), email ou par courrier.'],
    ['ouvrir', 'Pour ouvrir un compte en ligne :\n• Connectez-vous sur www.amenfirstbank.com.tn\n• Remplissez le formulaire électronique.\n• Téléchargez vos pièces justificatives (convention, spécimen, fiche KYC).\n• Remplissez, signez et scannez les documents.\n• Joignez-les via le site et validez votre demande.'],
    ['ouverture', 'Pour ouvrir un compte en ligne :\n• Connectez-vous sur www.amenfirstbank.com.tn\n• Remplissez le formulaire électronique.\n• Téléchargez vos pièces justificatives (convention, spécimen, fiche KYC).\n• Remplissez, signez et scannez les documents.\n• Joignez-les via le site et validez votre demande.'],
    ['salaire', 'Oui, vous pouvez domicilier votre salaire sur le compte dépôt après son ouverture.'],
    ['domicili', 'Oui, vous pouvez domicilier votre salaire sur le compte dépôt après son ouverture.'],
    ['crédit auto', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Auto, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['automobile', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Auto, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['voiture', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Auto, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['logement', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Logement, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['immobilier', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Logement, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['maison', 'Oui, avec un compte dépôt AFB vous pouvez prétendre à un crédit Logement, sans plafond mais dans la limite de votre capacité de remboursement.'],
    ['crc', 'Pour contacter le CRC :\n• Téléphone : 71 148 888\n• Email : crc@amenbank.com.tn'],
    ['contact', 'Vous pouvez nous joindre au +216 71 833 517 ou par email à amenbank@amenbank.com.tn\nPour le CRC : 71 148 888 | crc@amenbank.com.tn'],
    ['compte', 'Vous pouvez ouvrir un compte Amen Bank en ligne via Amen First Bank ou en visitant l\'une de nos 164 agences.'],
    ['carte', 'Amen Bank propose des cartes de débit et crédit avec paiement sans contact et cashback automatique.'],
    ['crédit', 'Nos crédits ont des taux compétitifs. Précisez le type (auto, logement…) pour plus de détails, ou utilisez notre simulateur en ligne.'],
    ['taux', 'Les taux d\'intérêt varient selon le type de produit et les conditions du marché. Contactez-nous pour une simulation personnalisée.'],
    ['agence', 'Nous avons 164 agences dans 14 régions. Consultez notre localisateur pour trouver la plus proche.'],
    ['__default__', 'Je ne comprends pas votre demande. Veuillez la reformuler ou contactez-nous au +216 71 833 517.'],
  ],
  ar: [
    ['amen first',  'إيه! مع Amen First Bank تنجم تفتح كومبت دپو وإلا كومبت توفير.'],
    ['آش هو',       'Amen First Bank هي agence en ligne تاع أمين بنك، حاضرة 7/7 و24/24. تنجم تفتح فيها كومبت دپو وإلا كومبت توفير، بـprix أرخص بكثير من agence عادية.'],
    ['شنيّة',       'Amen First Bank هي agence en ligne تاع أمين بنك، حاضرة 7/7 و24/24. تنجم تفتح فيها كومبت دپو وإلا كومبت توفير، بـprix أرخص بكثير من agence عادية.'],
    ['فائدة',  'مع Amen First Bank تستافد من:\n• Prix avantageuse — أقل من 50% من tarifs تاع agence عادية، وتنجم توصل للخدمة بالصح بالمجان.\n• Agence AFB متوفرة 7 أيام/7 و24 ساعة/24.'],
    ['ميزة',   'مع Amen First Bank تستافد من:\n• Prix avantageuse — أقل من 50% من tarifs تاع agence عادية، وتنجم توصل للخدمة بالصح بالمجان.\n• Agence AFB متوفرة 7 أيام/7 و24 ساعة/24.'],
    ['فضل',    'مع Amen First Bank تستافد من:\n• Prix avantageuse — أقل من 50% من tarifs تاع agence عادية، وتنجم توصل للخدمة بالصح بالمجان.\n• Agence AFB متوفرة 7 أيام/7 و24 ساعة/24.'],
    ['نسحب',  'تنجم تسحب فلوس:\n• بكارطتك في espaces libre-service وإلا في أي DAB bancaire (كومبت دپو)، غير في DAB تاع أمين بنك (كومبت توفير).\n• وإلا تمشي لأي أقانسي تاع أمين بنك.'],
    ['سحب',   'تنجم تسحب فلوس:\n• بكارطتك في espaces libre-service وإلا في أي DAB bancaire (كومبت دپو)، غير في DAB تاع أمين بنك (كومبت توفير).\n• وإلا تمشي لأي أقانسي تاع أمين بنك.'],
    ['دب',    'تنجم تستعمل كارطتك في espaces libre-service وإلا في أي DAB bancaire (كومبت دپو)، غير في DAB تاع أمين بنك (كومبت توفير).'],
    ['نودّع', 'تنجم توّدع فلوس:\n• في أي أقانسي من réseau أمين بنك.\n• وإلا في espaces libre-service.'],
    ['إيداع', 'تنجم توّدع فلوس:\n• في أي أقانسي من réseau أمين بنك.\n• وإلا في espaces libre-service.'],
    ['مسؤول', 'تنجم تكلم chargé clientèle تاعك بالتيليفون، visioconférence (بـrendez-vous)، إيميل، وإلا بـcourrier.'],
    ['موظف',  'تنجم تكلم chargé clientèle تاعك بالتيليفون، visioconférence (بـrendez-vous)، إيميل، وإلا بـcourrier.'],
    ['فتح كومبت', 'باش تفتح كومبت أونلاين:\n• دخل على www.amenfirstbank.com.tn\n• ملّا le formulaire الإلكتروني.\n• حمّل pièces justificatives تاعك (convention، spécimen، fiche KYC).\n• عمّر، وقّع، وصوّر الوثائق.\n• علّقهم في الموقع وصادق على la demande.'],
    ['نفتح',     'باش تفتح كومبت أونلاين:\n• دخل على www.amenfirstbank.com.tn\n• ملّا le formulaire الإلكتروني.\n• حمّل pièces justificatives تاعك (convention، spécimen، fiche KYC).\n• عمّر، وقّع، وصوّر الوثائق.\n• علّقهم في الموقع وصادق على la demande.'],
    ['راتب', 'إيه، تنجم تسجّل راتب تاعك في كومبت دپو بعد ما يتفتح.'],
    ['سيارة',  'إيه، مع كومبت دپو AFB تنجم تطلب crédit Auto، بلا plafond أمّا في حدود قدرة السداد تاعك.'],
    ['أوتو',   'إيه، مع كومبت دپو AFB تنجم تطلب crédit Auto، بلا plafond أمّا في حدود قدرة السداد تاعك.'],
    ['سكن',  'إيه، مع كومبت دپو AFB تنجم تطلب crédit Logement، بلا plafond أمّا في حدود قدرة السداد تاعك.'],
    ['دار',  'إيه، مع كومبت دپو AFB تنجم تطلب crédit Logement، بلا plafond أمّا في حدود قدرة السداد تاعك.'],
    ['crc',     'باش تكلم CRC:\n• تيليفون: 71 148 888\n• إيميل: crc@amenbank.com.tn'],
    ['نكلمكم', 'تنجم تكلمنا على +216 71 833 517 وإلا على إيميل: amenbank@amenbank.com.tn\nللـ CRC: 71 148 888 | crc@amenbank.com.tn'],
    ['اتصل',   'تنجم تكلمنا على +216 71 833 517 وإلا على إيميل: amenbank@amenbank.com.tn\nللـ CRC: 71 148 888 | crc@amenbank.com.tn'],
    ['نكلم',   'تنجم تكلم chargé clientèle تاعك بالتيليفون، visioconférence (بـrendez-vous)، إيميل، وإلا بـcourrier.'],
    ['حساب',   'تنجم تفتح كومبت في أمين بنك أونلاين مع Amen First Bank وإلا تجي لأي أقانسي من الـ 164.'],
    ['كومبت',  'تنجم تفتح كومبت في أمين بنك أونلاين مع Amen First Bank وإلا تجي لأي أقانسي من الـ 164.'],
    ['كارطة',  'أمين بنك تعطيك cartes débit وcrédit بـpaiement sans contact وcashback تلقائي.'],
    ['كارطو',  'أمين بنك تعطيك cartes débit وcrédit بـpaiement sans contact وcashback تلقائي.'],
    ['قرض',    'عندنا قروض بأسعار تنافسية. قولي نوع القرض (سيارة، سكن…) باش نعطيك أكثر تفاصيل.'],
    ['كريدي',  'عندنا قروض بأسعار تنافسية. قولي نوع القرض (سيارة، سكن…) باش نعطيك أكثر تفاصيل.'],
    ['أقانسي', 'عندنا 164 أقانسي في 14 منطقة. استعمل le localisateur باش تلقى الأقرب منك.'],
    ['فرع',    'عندنا 164 أقانسي في 14 منطقة. استعمل le localisateur باش تلقى الأقرب منك.'],
    ['__default__', 'ما فهمتش باش تقصد. عاود صياغة السؤال وإلا كلمنا على +216 71 833 517.'],
  ],
  en: [
    ['amen first', 'Absolutely! With Amen First Bank you can open either a deposit account or a savings account.'],
    ['what is', 'Amen First Bank (AFB) is Amen Bank\'s fully online branch, available 7 days a week 24/7. You can open a deposit or savings account and enjoy reduced fees.'],
    ['advantage', 'As an Amen First Bank client you benefit from:\n• Advantageous pricing (less than 50% of standard branch fees, potentially completely free).\n• Access to the AFB branch 7 days/7 and 24h/24.'],
    ['benefit', 'As an Amen First Bank client you benefit from:\n• Advantageous pricing (less than 50% of standard branch fees, potentially completely free).\n• Access to the AFB branch 7 days/7 and 24h/24.'],
    ['perk', 'As an Amen First Bank client you benefit from:\n• Advantageous pricing (less than 50% of standard branch fees, potentially completely free).\n• Access to the AFB branch 7 days/7 and 24h/24.'],
    ['withdraw', 'You can withdraw money:\n• Using your card at self-service spaces or any bank ATM (deposit account), or only at Amen Bank ATMs (savings account).\n• By visiting any Amen Bank branch.'],
    ['atm', 'You can withdraw money:\n• Using your card at self-service spaces or any bank ATM (deposit account), or only at Amen Bank ATMs (savings account).\n• By visiting any Amen Bank branch.'],
    ['deposit money', 'You can deposit money:\n• At any branch of the Amen Bank network.\n• At self-service spaces.'],
    ['put money', 'You can deposit money:\n• At any branch of the Amen Bank network.\n• At self-service spaces.'],
    ['account manager', 'You can contact your account manager by phone, video conference (by appointment), email, or mail.'],
    ['manager', 'You can contact your account manager by phone, video conference (by appointment), email, or mail.'],
    ['advisor', 'You can contact your advisor by phone, video conference (by appointment), email, or mail.'],
    ['open', 'To open an account online:\n• Visit www.amenfirstbank.com.tn\n• Fill in the electronic form.\n• Upload your supporting documents (agreement, specimen, KYC form).\n• Fill, sign and scan the documents.\n• Attach them via the site and validate your request.'],
    ['register', 'To open an account online:\n• Visit www.amenfirstbank.com.tn\n• Fill in the electronic form.\n• Upload your supporting documents (agreement, specimen, KYC form).\n• Fill, sign and scan the documents.\n• Attach them via the site and validate your request.'],
    ['salary', 'Yes, you can have your salary deposited to the deposit account after it is opened.'],
    ['paycheck', 'Yes, you can have your salary deposited to the deposit account after it is opened.'],
    ['auto loan', 'Yes, with an AFB deposit account you can apply for an Auto loan, with no ceiling but within your repayment capacity.'],
    ['car loan', 'Yes, with an AFB deposit account you can apply for an Auto loan, with no ceiling but within your repayment capacity.'],
    ['vehicle', 'Yes, with an AFB deposit account you can apply for an Auto loan, with no ceiling but within your repayment capacity.'],
    ['housing', 'Yes, with an AFB deposit account you can apply for a Housing loan, with no ceiling but within your repayment capacity.'],
    ['mortgage', 'Yes, with an AFB deposit account you can apply for a Housing loan, with no ceiling but within your repayment capacity.'],
    ['home loan', 'Yes, with an AFB deposit account you can apply for a Housing loan, with no ceiling but within your repayment capacity.'],
    ['crc', 'To contact the CRC:\n• Phone: 71 148 888\n• Email: crc@amenbank.com.tn'],
    ['contact', 'You can reach us at +216 71 833 517 or by email at amenbank@amenbank.com.tn\nFor the CRC: 71 148 888 | crc@amenbank.com.tn'],
    ['account', 'You can open an Amen Bank account online via Amen First Bank or by visiting one of our 164 branches.'],
    ['card', 'Amen Bank offers debit and credit cards with contactless payment and auto cashback.'],
    ['loan', 'Our loans have competitive rates. Specify the type (auto, housing…) for more details, or use our online simulator.'],
    ['rate', 'Interest rates vary depending on the product type and market conditions. Contact us for a personalised simulation.'],
    ['branch', 'We have 164 branches across 14 regions. Use our locator to find the nearest one.'],
    ['__default__', "I don't understand your request. Please rephrase it or contact our advisors at +216 71 833 517."],
  ],
};

function getBotResponse(input: string, lang: Language): string {
  const lower = input.toLowerCase();
  const pairs = responsePairs[lang];
  const found = pairs.find(([key]) => key !== '__default__' && lower.includes(key));
  if (found) return found[1];
  return pairs.find(([key]) => key === '__default__')![1];
}

export default function FAQ() {
  const { lang: currentLang, isRTL } = useLang();
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(currentLang));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLangRef = useRef(currentLang);

  const ui = uiMap[currentLang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;
      setMessages(getInitialMessages(currentLang));
      setShowQuickReplies(true);
    }
  }, [currentLang]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowQuickReplies(false);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setError(null);
      setIsLoading(true);

      setTimeout(() => {
        try {
          const response = getBotResponse(trimmed, currentLang);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        } catch {
          setError(ui.error);
        } finally {
          setIsLoading(false);
        }
      }, 800);
    },
    [isLoading, currentLang, ui.error]
  );

  const handleSendMessage = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleQuickReply = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="section" style={{ background: '#f0f2f5', padding: '4rem 1rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="section-header">
          <h1 style={{ color: '#0f172a' }}>{ui.title}</h1>
          <p style={{ color: '#64748b' }}>{ui.status}</p>
        </div>

        {/* Chat Window Container - Increased to max-w-6xl and 85vh height */}
        <div 
          className="max-w-6xl mx-auto bg-white shadow-2xl flex flex-col overflow-hidden"
          style={{ 
            height: '85vh', 
            minHeight: '700px',
            borderRadius: '1.5rem',
            border: '1px solid #e2e8f0',
            padding: '1rem'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center shrink-0"
            style={{ 
              background: '#ffffff', 
              borderBottom: '1px solid #e2e8f0', 
              padding: '1rem 1.5rem', 
              gap: '1rem',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#003DA5' }}>
                <MessageCircle className="w-5 h-5" style={{ color: '#ffffff' }} />
              </div>
              <span 
                className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white" 
                style={{ background: '#22c55e' }}
              ></span>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="text-base font-bold" style={{ color: '#0f172a' }}>{ui.title}</h3>
              <p className="text-xs font-medium" style={{ color: '#22c55e' }}>{ui.status}</p>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{ 
              background: '#f8fafc', 
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-end"
                style={{ 
                  gap: '0.5rem', 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: isRTL ? 'row-reverse' : 'row'
                }}
              >
                {message.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0" style={{ background: '#003DA5', color: '#ffffff' }}>
                    AB
                  </div>
                )}
                
                {/* Message Bubble - Scaled Down */}
                <div
                  className="rounded-2xl"
                  style={
                    message.role === 'user' 
                      ? { 
                          maxWidth: '60%', 
                          padding: '0.75rem 1.25rem', 
                          background: '#006B3C', 
                          color: '#ffffff', 
                          boxShadow: '0 4px 12px rgba(0, 107, 60, 0.2)',
                          borderBottomRightRadius: '0.375rem'
                        } 
                      : { 
                          maxWidth: '60%', 
                          padding: '0.75rem 1.25rem', 
                          background: '#ffffff', 
                          color: '#0f172a', 
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                          border: '1px solid #f1f5f9',
                          borderBottomLeftRadius: '0.375rem'
                        }
                  }
                >
                  <p className="whitespace-pre-line" style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0, color: message.role === 'user' ? '#ffffff' : '#0f172a' }}>
                    {message.content}
                  </p>
                  <p
                    className="font-medium"
                    style={{ 
                      fontSize: '0.65rem', 
                      marginTop: '0.5rem', 
                      color: message.role === 'user' ? 'rgba(255, 255, 255, 0.85)' : '#94a3b8', 
                      textAlign: message.role === 'user' ? 'right' : 'left' 
                    }}
                  >
                    {message.timestamp.toLocaleTimeString(
                      currentLang === 'ar' ? 'ar-TN' : 'fr-TN',
                      { hour: '2-digit', minute: '2-digit' }
                    )}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end" style={{ gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0" style={{ background: '#003DA5', color: '#ffffff' }}>
                  AB
                </div>
                <div className="bg-white rounded-2xl" style={{ padding: '0.75rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', borderBottomLeftRadius: '0.375rem' }}>
                  <div className="flex items-center" style={{ gap: '0.5rem', color: '#94a3b8' }}>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-medium">{ui.typing}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start rounded-xl" style={{ gap: '0.75rem', padding: '1rem', background: '#fef2f2', border: '1px solid rgb(220 38 38 / 0.2)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      handleSendMessage();
                    }}
                    className="text-sm font-semibold transition-colors mt-2 bg-transparent border-none cursor-pointer p-0"
                    style={{ color: '#003DA5' }}
                  >
                    {ui.retry}
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div 
            className="shrink-0"
            style={{ 
              background: '#ffffff', 
              borderTop: '1px solid #e2e8f0', 
              padding: '1.25rem 1.5rem'
            }}
          >
            {showQuickReplies && (
              <div style={{ paddingBottom: '1.25rem', textAlign: isRTL ? 'right' : 'left' }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                  {ui.suggestions}
                </p>
                <div className="flex flex-wrap" style={{ gap: '0.5rem', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                  {quickReplies[currentLang].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickReply(q)}
                      className="text-xs rounded-full border transition-all bg-white cursor-pointer hover:bg-slate-50"
                      style={{ borderColor: '#cbd5e1', color: '#334155', fontWeight: 500, padding: '0.5rem 1rem' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div 
              className="flex items-center rounded-2xl"
              style={{ 
                background: '#f1f5f9', 
                border: '1px solid #e2e8f0', 
                padding: '0.375rem', 
                gap: '0.5rem', 
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={ui.placeholder}
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:outline-none"
                style={{ color: '#0f172a', fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white border-none cursor-pointer transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: '#006B3C' }}
                aria-label={ui.sendAria}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}