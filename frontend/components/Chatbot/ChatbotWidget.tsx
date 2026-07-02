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
import { usePathname } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatSource {
  text?: string;
  relevance?: number;
  [key: string]: unknown;
}

interface ChatApiResponse {
  status: string;
  message: string;
  language: string;
  sources: ChatSource[];
  confidence: number;
  timestamp: string;
}

// Base URL of the FastAPI chatbot backend (chatbot/main.py).
// Configure via NEXT_PUBLIC_CHATBOT_API_URL in .env.local; falls back to local dev default.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

const greetingMap: Record<Language, string> = {
  fr: "Bonjour ! Je suis l'assistant bancaire d'Amen Bank. Posez-moi vos questions sur Amen First Bank, vos comptes, cartes ou crédits.",
  ar: 'أهلا! أنا المساعد تاع أمين بنك. اسألني على Amen First Bank، الكومبتات، الكارطات وإلا القروض.',
  en: "Hello! I'm Amen Bank's banking assistant. Ask me anything about Amen First Bank, accounts, cards or loans.",
};

const getInitialMessages = (lang: Language): Message[] => [
  { id: '1', role: 'bot', content: greetingMap[lang], timestamp: new Date() },
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
    suggestions: string;
  }
> = {
  fr: { title: 'Assistant Bancaire', status: 'En ligne', placeholder: 'Tapez votre message…', typing: "L'assistant tape…", error: 'Impossible de se connecter au service. Veuillez réessayer.', retry: 'Réessayer', sendAria: 'Envoyer', openAria: 'Ouvrir le chat', closeAria: 'Fermer le chat', maximizeAria: 'Agrandir', minimizeAria: 'Réduire', suggestions: 'Questions fréquentes' },
  ar: { title: 'المساعد البنكي', status: 'حاضر', placeholder: 'اكتب سؤالك…', typing: 'المساعد يكتب…', error: 'ما تقدرش تكمل. عاود المحاولة.', retry: 'عاود', sendAria: 'ابعث', openAria: 'حل المحادثة', closeAria: 'اغلق المحادثة', maximizeAria: 'كبّر', minimizeAria: 'صغّر', suggestions: 'أسئلة متداولة' },
  en: { title: 'Banking Assistant', status: 'Online', placeholder: 'Type your message…', typing: 'Assistant is typing…', error: 'Unable to connect to the service. Please try again.', retry: 'Try Again', sendAria: 'Send', openAria: 'Open chat', closeAria: 'Close chat', maximizeAria: 'Maximize', minimizeAria: 'Minimize', suggestions: 'Common questions' },
};

const quickReplies: Record<Language, string[]> = {
  fr: ['Qu\'est-ce qu\'Amen First Bank ?', 'Comment ouvrir un compte ?', 'Comment retirer de l\'argent ?', 'Crédit auto ou logement ?', 'Contacter le CRC'],
  ar: ['آش هو Amen First Bank؟', 'كيفاش نفتح كومبت؟', 'كيفاش نسحب فلوس؟', 'كريدي سيارة وإلا سكن؟', 'كيفاش نكلم CRC؟'],
  en: ['What is Amen First Bank?', 'How to open an account?', 'How to withdraw money?', 'Auto or housing loan?', 'Contact the CRC'],
};

/**
 * Calls the FastAPI /chat RAG endpoint (see chatbot/main.py::chat).
 * Falls back to throwing so the caller can show the retry UI.
 */
async function fetchBotResponse(
  message: string,
  lang: Language,
  conversationId: string
): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language: lang,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const errBody = await response.json();
      detail = errBody?.detail || detail;
    } catch {
      // ignore parse failure, keep default detail
    }
    throw new Error(detail);
  }

  return response.json();
}

export default function ChatbotWidget() {
  const { lang: currentLang, isRTL } = useLang();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(currentLang));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLangRef = useRef(currentLang);
  const conversationIdRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const ui = uiMap[currentLang];

  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setIsMaximized(true);
    };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMaximized]);

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
      setLastFailedMessage(null);
      setIsLoading(true);

      try {
        const data = await fetchBotResponse(trimmed, currentLang, conversationIdRef.current);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error('Chatbot request failed:', err);
        setError(ui.error);
        setLastFailedMessage(trimmed);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, currentLang, ui.error]
  );

  const handleSendMessage = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleRetry = useCallback(() => {
    if (!lastFailedMessage) return;
    const toRetry = lastFailedMessage;
    setError(null);
    setLastFailedMessage(null);
    sendMessage(toRetry);
  }, [lastFailedMessage, sendMessage]);

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

  const close = () => {
    setIsOpen(false);
    setIsMaximized(false);
  };

  const minimize = () => {
    setIsMaximized(false);
  };

  const renderHeader = (variant: 'drawer' | 'maximized') => (
    <div
      className="flex items-center shrink-0 justify-between"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: variant === 'drawer' ? '1rem 1.25rem' : '1.25rem 2rem',
        gap: '1rem',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}
    >
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`} style={{ gap: '0.75rem' }}>
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
          <h3 id="chat-title" className="text-base font-bold" style={{ color: '#0f172a' }}>{ui.title}</h3>
          <p className="text-xs font-medium" style={{ color: '#22c55e' }}>{ui.status}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {variant === 'drawer' ? (
          <button
            onClick={() => setIsMaximized(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={ui.maximizeAria}
          >
            <Maximize2 className="w-4 h-4" style={{ color: '#64748b' }} />
          </button>
        ) : (
          <button
            onClick={minimize}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={ui.minimizeAria}
          >
            <Minimize2 className="w-4 h-4" style={{ color: '#64748b' }} />
          </button>
        )}
        <button
          onClick={close}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={ui.closeAria}
        >
          <X className="w-4 h-4" style={{ color: '#64748b' }} />
        </button>
      </div>
    </div>
  );

  const renderMessages = (compact?: boolean) => (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        background: '#f8fafc',
        padding: compact ? '1.5rem' : '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
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
              onClick={handleRetry}
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
  );

  const renderQuickReplies = () => {
    if (!showQuickReplies) return null;
    return (
      <div style={{ paddingBottom: '1rem', textAlign: isRTL ? 'right' : 'left' }}>
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
    );
  };

  const renderInput = () => (
    <div
      className="shrink-0"
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '1.25rem 1.5rem'
      }}
    >
      {renderQuickReplies()}
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
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <input
          ref={inputRef}
          id="chat-input"
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
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  // Hide the widget entirely if we are on the FAQ page (it embeds its own chat entry point)
  if (pathname.includes('/amengpt')) return null;

  return (
    <>
      {/* ── FAB Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 z-50 w-14 h-14 flex items-center justify-center text-white rounded-2xl border-none cursor-pointer transition-all hover:scale-105 shadow-lg"
          style={{ background: '#006B3C', right: isRTL ? 'auto' : '1.5rem', left: isRTL ? '1.5rem' : 'auto' }}
          aria-label={ui.openAria}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* ── Drawer (compact) ── */}
      {isOpen && !isMaximized && (
        <div
          className="fixed z-50 bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            width: '24rem',
            height: '36rem',
            bottom: '6rem',
            right: isRTL ? 'auto' : '1.5rem',
            left: isRTL ? '1.5rem' : 'auto'
          }}
          role="dialog"
          aria-labelledby="chat-title"
        >
          {renderHeader('drawer')}
          {renderMessages(true)}
          {renderInput()}
        </div>
      )}

      {/* ── Maximized (overlay) ── */}
      {isOpen && isMaximized && (
        <>
          <div
            className="fixed inset-0 z-50 animate-fadeIn"
            onClick={close}
            style={{ background: 'rgba(15, 23, 42, 0.4)' }}
            aria-hidden="true"
          />
          <div
            className="fixed z-50 bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }}
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