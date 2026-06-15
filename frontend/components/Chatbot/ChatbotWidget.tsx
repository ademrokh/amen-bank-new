'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader, AlertCircle } from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content:
        'Bonjour! Je suis l\'assistant bancaire d\'Amen Bank. Comment puis-je vous aider ?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract current language
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update initial greeting based on language
  useEffect(() => {
    const greetingMap: Record<Language, string> = {
      fr: 'Bonjour! Je suis l\'assistant bancaire d\'Amen Bank. Comment puis-je vous aider ?',
      ar: 'مرحبا! أنا مساعد الخدمات المصرفية في أمين بنك. كيف يمكنني مساعدتك؟',
      en: 'Hello! I\'m Amen Bank\'s banking assistant. How can I help you?',
    };

    if (messages.length === 1 && !messages[0].content.includes('Bonjour')) {
      setMessages([
        {
          id: '1',
          role: 'bot',
          content: greetingMap[currentLang],
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentLang]);

  const placeholders: Record<Language, string> = {
    fr: 'Tapez votre message...',
    ar: 'اكتب رسالتك...',
    en: 'Type your message...',
  };

  const sendButtonLabels: Record<Language, string> = {
    fr: 'Envoyer',
    ar: 'إرسال',
    en: 'Send',
  };

  const tryAgainLabel: Record<Language, string> = {
    fr: 'Réessayer',
    ar: 'حاول مرة أخرى',
    en: 'Try Again',
  };

  const errorMessages: Record<Language, string> = {
    fr: 'Oups! Impossible de se connecter au service. Veuillez réessayer plus tard.',
    ar: 'عذرا! تعذر الاتصال بالخدمة. يرجى المحاولة لاحقا.',
    en: 'Oops! Unable to connect to the service. Please try again later.',
  };

  const typingIndicator: Record<Language, string> = {
    fr: 'L\'assistant tape...',
    ar: 'المساعد يكتب...',
    en: 'Assistant is typing...',
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    // Simulate API call (will be replaced with actual backend call)
    setTimeout(() => {
      try {
        // TODO: Replace with actual API call to /chat endpoint
        const botResponses: Record<Language, Record<string, string>> = {
          fr: {
            'comment': 'Amen Bank propose des services bancaires modernes et sécurisés.',
            'compte': 'Vous pouvez ouvrir un compte Amen Bank en ligne ou en visitant une agence.',
            'taux': 'Les taux d\'intérêt varient selon le type de compte et les conditions actuelles.',
            'default': 'Merci pour votre question! Pour plus d\'informations, consultez notre page FAQ ou contactez nos conseillers au +216 71 833 517.',
          },
          ar: {
            'حساب': 'يمكنك فتح حساب بأمين بنك عبر الإنترنت أو بزيارة أحد فروعنا.',
            'خدمة': 'توفر أمين بنك خدمات مصرفية حديثة وآمنة.',
            'سعر': 'تختلف أسعار الفائدة حسب نوع الحساب والشروط الحالية.',
            'default': 'شكرا لسؤالك! للمزيد من المعلومات، يرجى مراجعة صفحة الأسئلة الشائعة أو الاتصال بمستشارينا على +216 71 833 517.',
          },
          en: {
            'account': 'You can open an Amen Bank account online or by visiting one of our branches.',
            'service': 'Amen Bank offers modern and secure banking services.',
            'rate': 'Interest rates vary depending on the type of account and current conditions.',
            'default': 'Thank you for your question! For more information, please check our FAQ page or contact our advisors at +216 71 833 517.',
          },
        };

        const lowerInput = input.toLowerCase();
        let response: string;

        if (currentLang === 'fr') {
          response = Object.entries(botResponses.fr).find(([key]) =>
            lowerInput.includes(key)
          )?.[1] || botResponses.fr.default;
        } else if (currentLang === 'ar') {
          response = Object.entries(botResponses.ar).find(([key]) =>
            lowerInput.includes(key)
          )?.[1] || botResponses.ar.default;
        } else {
          response = Object.entries(botResponses.en).find(([key]) =>
            lowerInput.includes(key)
          )?.[1] || botResponses.en.default;
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        setError(errorMessages[currentLang]);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 w-14 h-14 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-full shadow-2xl hover:shadow-blue-900/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        aria-controls="chat-drawer"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div
          id="chat-drawer"
          className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-40 w-96 h-[600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideInUp`}
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
          }}
          role="dialog"
          aria-labelledby="chat-title"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className={`${isRTL ? 'text-right' : ''}`}>
                <h3 id="chat-title" className="font-bold text-lg">
                  {currentLang === 'fr' ? 'Assistant Bancaire' : currentLang === 'ar' ? 'المساعد المصرفي' : 'Banking Assistant'}
                </h3>
                <p className="text-sm text-blue-100">
                  {currentLang === 'fr'
                    ? 'En ligne'
                    : currentLang === 'ar'
                    ? 'متصل'
                    : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white" role="log" aria-label="Chat messages" aria-live="polite" aria-atomic="false">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : ''} gap-3`}
              >
                {message.role === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    AB
                  </div>
                )}
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-900 text-white rounded-br-none'
                      : 'bg-slate-200 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-blue-200' : 'text-slate-600'}`}>
                    {message.timestamp.toLocaleTimeString(currentLang === 'ar' ? 'ar-TN' : 'fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  AB
                </div>
                <div className="bg-slate-200 text-slate-900 px-4 py-3 rounded-lg rounded-bl-none max-w-xs">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{typingIndicator[currentLang]}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-red-600 font-semibold mt-2 hover:text-red-700"
                  >
                    {tryAgainLabel[currentLang]}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <label htmlFor="chat-input" className="sr-only">Message</label>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholders[currentLang]}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 bg-slate-100 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{sendButtonLabels[currentLang]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
