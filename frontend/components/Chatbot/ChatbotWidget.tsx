'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Loader,
  Minimize2,
  Maximize2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useLang } from '@/hooks/useLang';

/* ════════════════════════════════════════════
   Types & Data
   ════════════════════════════════════════════ */

type Language = 'fr' | 'ar' | 'en';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const greetingMap: Record<Language, string> = {
  fr: "Bonjour ! Je suis l'assistant bancaire d'Amen Bank. Comment puis-je vous aider ?",
  ar: 'مرحبا! أنا مساعد الخدمات المصرفية في أمين بنك. كيف يمكنني مساعدتك؟',
  en: "Hello! I'm Amen Bank's banking assistant. How can I help you?",
};

const getInitialMessages = (lang: Language): Message[] => [
  {
    id: '1',
    role: 'bot',
    content: greetingMap[lang],
    timestamp: new Date(),
  },
];

const uiMap: Record<
  Language,
  {
    title: string;
    status: string;
    placeholder: string;
    typing: string;
    error: string;
    retry: string;
    sendAria: string;
    openAria: string;
    closeAria: string;
    maximizeAria: string;
    minimizeAria: string;
  }
> = {
  fr: {
    title: 'Assistant Bancaire',
    status: 'En ligne',
    placeholder: 'Tapez votre message…',
    typing: "L'assistant tape…",
    error: 'Impossible de se connecter au service. Veuillez réessayer.',
    retry: 'Réessayer',
    sendAria: 'Envoyer',
    openAria: 'Ouvrir le chat',
    closeAria: 'Fermer le chat',
    maximizeAria: 'Agrandir',
    minimizeAria: 'Réduire',
  },
  ar: {
    title: 'المساعد المصرفي',
    status: 'متصل',
    placeholder: 'اكتب رسالتك…',
    typing: 'المساعد يكتب…',
    error: 'تعذر الاتصال بالخدمة. يرجى المحاولة مرة أخرى.',
    retry: 'حاول مرة أخرى',
    sendAria: 'إرسال',
    openAria: 'فتح المحادثة',
    closeAria: 'إغلاق المحادثة',
    maximizeAria: 'تكبير',
    minimizeAria: 'تصغير',
  },
  en: {
    title: 'Banking Assistant',
    status: 'Online',
    placeholder: 'Type your message…',
    typing: 'Assistant is typing…',
    error: 'Unable to connect to the service. Please try again.',
    retry: 'Try Again',
    sendAria: 'Send',
    openAria: 'Open chat',
    closeAria: 'Close chat',
    maximizeAria: 'Maximize',
    minimizeAria: 'Minimize',
  },
};

const botResponses: Record<Language, Record<string, string>> = {
  fr: {
    compte:
      "Vous pouvez ouvrir un compte Amen Bank en ligne via Amen First Bank ou en visitant l'une de nos 164 agences.",
    carte:
      'Amen Bank propose des cartes de débit et crédit avec paiement sans contact et cashback automatique.',
    crédit:
      "Nos crédits ont des taux compétitifs. Utilisez notre simulateur pour obtenir une estimation.",
    taux:
      "Les taux d'intérêt varient selon le type de produit et les conditions du marché.",
    agence:
      'Nous avons 164 agences dans 14 régions. Consultez notre localisateur pour trouver la plus proche.',
    contact:
      'Vous pouvez nous joindre au +216 71 833 517 ou par email à amenbank@amenbank.com.tn',
    default:
      "Je ne comprends pas votre demande. Veuillez la reformuler ou contactez nos conseillers au +216 71 833 517.",
  },
  ar: {
    حساب:
      'يمكنك فتح حساب بأمين بنك عبر الإنترنت عبر Amen First Bank أو بزيارة أحد فروعنا الـ 164.',
    بطاقة:
      'تقدم أمين بنك بطاقات خصم وائتمان مع دفع بدون تلامس واسترجاع نقدي تلقائي.',
    قرض:
      'لدينا قروض بأسعار تنافسية. استخدم محاكينا للحصول على تقدير.',
    سعر:
      'تختلف أسعار الفائدة حسب نوع المنتج وشروط السوق.',
    فرع:
      'لدينا 164 فرعا في 14 منطقة. استخدم محدد المواقع لإيجاد الأقرب.',
    اتصل:
      'يمكنك التواصل معنا على +216 71 833 517 أو عبر البريد الإلكتروني amenbank@amenbank.com.tn',
    default:
      'لا أفهم طلبك. يرجى إعادة صياغته أو الاتصال بمستشارينا على +216 71 833 517.',
  },
  en: {
    account:
      'You can open an Amen Bank account online via Amen First Bank or by visiting one of our 164 branches.',
    card:
      'Amen Bank offers debit and credit cards with contactless payment and auto cashback.',
    loan:
      'Our loans have competitive rates. Use our simulator to get an estimate.',
    rate:
      'Interest rates vary depending on the product type and market conditions.',
    branch:
      'We have 164 branches across 14 regions. Use our locator to find the nearest one.',
    contact:
      'You can reach us at +216 71 833 517 or by email at amenbank@amenbank.com.tn',
    default:
      "I don't understand your request. Please rephrase it or contact our advisors at +216 71 833 517.",
  },
};

/* ════════════════════════════════════════════
   Component
   ════════════════════════════════════════════ */

export default function ChatbotWidget() {
  const { lang: currentLang, isRTL } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() =>
    getInitialMessages(currentLang)
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLangRef = useRef(currentLang);

  const ui = uiMap[currentLang];

  /* ── Listen for open-chatbot event (from FAQ, etc.) ── */
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setIsMaximized(true);
    };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  /* ── Auto-scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ── Focus input when opened ── */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMaximized]);

  /* ── Reset messages on language change ── */
  useEffect(() => {
    if (prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;
      setMessages(getInitialMessages(currentLang));
    }
  }, [currentLang]);

  /* ── Send message ── */
  const handleSendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

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

    /* Simulated bot response (replace with real API call) */
    setTimeout(() => {
      try {
        const lowerInput = trimmed.toLowerCase();
        const responses = botResponses[currentLang];
        const response =
          Object.entries(responses).find(([key]) =>
            lowerInput.includes(key)
          )?.[1] ?? responses.default;

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
  }, [input, isLoading, currentLang, ui.error]);

  /* ── Keyboard handler ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ── Close / minimize ── */
  const close = () => {
    setIsOpen(false);
    setIsMaximized(false);
  };

  const minimize = () => {
    setIsMaximized(false);
  };

  /* ════════════════════════════════════════════
     Shared sub-renders (used by both drawer & maximized)
     ════════════════════════════════════════════ */

  const renderHeader = (variant: 'drawer' | 'maximized') => (
    <div
      className={`bg-secondary flex items-center justify-between shrink-0 ${
        variant === 'drawer' ? 'px-4 py-3' : 'px-6 py-4'
      }`}
    >
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div className={isRTL ? 'text-right' : ''}>
          <h3
            id="chat-title"
            className={`font-semibold text-white ${
              variant === 'drawer' ? 'text-small' : 'text-base'
            }`}
          >
            {ui.title}
          </h3>
          <p className="text-xs text-white/70">{ui.status}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {variant === 'drawer' ? (
          <button
            onClick={() => setIsMaximized(true)}
            className="p-1.5 rounded hover:bg-white/15 text-white transition-colors"
            aria-label={ui.maximizeAria}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={minimize}
            className="p-1.5 rounded hover:bg-white/15 text-white transition-colors"
            aria-label={ui.minimizeAria}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={close}
          className="p-1.5 rounded hover:bg-white/15 text-white transition-colors"
          aria-label={ui.closeAria}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderMessages = (compact?: boolean) => (
    <div
      className="flex-1 overflow-y-auto bg-surface-alt"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      <div className={`space-y-4 ${compact ? 'p-4' : 'p-6'}`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${
              message.role === 'user'
                ? isRTL
                  ? 'flex-row-reverse'
                  : 'flex-row'
                : isRTL
                  ? 'flex-row-reverse'
                  : 'flex-row'
            } ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot avatar */}
            {message.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-[0.625rem] font-bold shrink-0">
                AB
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-secondary text-white rounded-br-sm'
                  : 'bg-border text-ink rounded-bl-sm'
              }`}
            >
              <p className={`leading-relaxed ${compact ? 'text-sm' : 'text-small'}`}>
                {message.content}
              </p>
              <p
                className={`text-[0.625rem] mt-1 ${
                  message.role === 'user'
                    ? 'text-white/60'
                    : 'text-ink-muted'
                }`}
              >
                {message.timestamp.toLocaleTimeString(
                  currentLang === 'ar' ? 'ar-TN' : 'fr-TN',
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div
            className={`flex items-end gap-2 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-[0.625rem] font-bold shrink-0">
              AB
            </div>
            <div className="bg-border rounded-lg rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span className="text-sm">{ui.typing}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div
            className={`flex items-start gap-3 p-3 rounded-lg bg-error/5 border border-error/20 ${
              isRTL ? 'flex-row-reverse text-right' : ''
            }`}
          >
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  handleSendMessage();
                }}
                className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors mt-1 bg-transparent border-none cursor-pointer p-0"
              >
                {ui.retry}
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="p-3 border-t border-border bg-surface shrink-0">
      <div
        className={`flex items-center gap-2 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ui.placeholder}
          disabled={isLoading}
          className="input-field border-border! flex-1 py-2.5! text-sm!"
          aria-label="Type your message"
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-white border-none cursor-pointer transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary-dark"
          aria-label={ui.sendAria}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════
     Render
     ════════════════════════════════════════════ */

  return (
    <>
      {/* ── FAB Button — secondary solid, no shadow, no gradient ── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className={`fixed bottom-6 z-50 w-14 h-14 flex items-center justify-center bg-secondary text-white rounded-lg border-none cursor-pointer transition-colors hover:bg-secondary-dark ${
            isRTL ? 'left-6' : 'right-6'
          }`}
          aria-label={ui.openAria}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* ── Drawer (compact mode) ── */}
      {isOpen && !isMaximized && (
        <div
          className={`fixed bottom-24 z-50 w-88 h-128 bg-surface border border-border rounded-lg shadow-dropdown flex flex-col overflow-hidden ${
            isRTL ? 'left-6' : 'right-6'
          }`}
          role="dialog"
          aria-labelledby="chat-title"
        >
          {renderHeader('drawer')}
          {renderMessages(true)}
          {renderInput()}
        </div>
      )}

      {/* ── Maximized (overlay mode — triggered by FAQ) ── */}
      {isOpen && isMaximized && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-ink/40 animate-fadeIn"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className={`fixed z-50 bg-surface border border-border rounded-lg shadow-modal flex flex-col overflow-hidden ${
              isRTL
                ? 'left-4 right-4 top-4 bottom-4 sm:left-8 sm:right-8 sm:top-8 sm:bottom-8'
                : 'left-4 right-4 top-4 bottom-4 sm:left-8 sm:right-8 sm:top-8 sm:bottom-8'
            }`}
            role="dialog"
            aria-labelledby="chat-title"
          >
            {renderHeader('maximized')}
            {renderMessages(false)}
            {renderInput()}
          </div>
        </>
      )}
    </>
  );
}