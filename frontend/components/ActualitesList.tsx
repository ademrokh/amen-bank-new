'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Landmark,
  TrendingUp,
  Wallet,
  LineChart,
  Leaf,
  CreditCard,
  Home,
  Smartphone,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

type Language = 'fr' | 'ar' | 'en';

const ICON_MAP = {
  governance: Landmark,
  results: TrendingUp,
  profit: Wallet,
  markets: LineChart,
  esg: Leaf,
  card: CreditCard,
  home: Home,
  mobile: Smartphone,
  approval: CheckCircle2,
  report: FileText,
} as const;

type ArticleIcon = keyof typeof ICON_MAP;

export type Article = {
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  icon: ArticleIcon;
};

const GREEN_CATEGORIES = ['Expansion', 'توسع', 'RSE', 'المسؤولية المجتمعية', 'CSR'];

export default function ActualitesList({
  lang,
  isRTL,
  readMore,
  closeLabel,
  articles,
}: {
  lang: Language;
  isRTL: boolean;
  readMore: string;
  closeLabel: string;
  articles: Article[];
}) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
        {articles.map((article, idx) => {
          const isGreen = GREEN_CATEGORIES.includes(article.category);
          const catColor = isGreen ? '#006B3C' : '#003DA5';
          const catBg = isGreen ? '#ecfdf5' : '#eff6ff';
          const Icon = ICON_MAP[article.icon];

          return (
            <div
              key={idx}
              className="card cursor-pointer"
              onClick={() => setActiveArticle(article)}
            >
              <div style={{ display: 'flex', gap: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                {/* Icon */}
                <div
                  style={{ 
                    flexShrink: 0, 
                    width: '4rem', 
                    height: '4rem', 
                    borderRadius: '0.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: catBg, 
                    border: `1px solid ${catColor}1a` 
                  }}
                >
                  <Icon size={28} style={{ color: catColor }} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {article.date}
                    </span>
                    <span
                      style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: catColor }}
                    >
                      #{article.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#64748b', marginBottom: '1.5rem' }}>
                    {article.excerpt}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveArticle(article);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: '#003DA5', background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    {readMore}
                    <ArrowRight style={{ width: '1rem', height: '1rem', transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          ARTICLE MODAL
          ════════════════════════════════════════════ */}
      {activeArticle && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{ 
              background: '#ffffff', 
              borderRadius: '1rem', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
              width: '100%', 
              maxWidth: '48rem', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              position: 'relative' 
            }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <button
              onClick={() => setActiveArticle(null)}
              style={{ position: 'absolute', top: '2rem', padding: '0.5rem', borderRadius: '0.5rem', zIndex: 10, color: '#94a3b8', background: '#ffffff', right: isRTL ? 'auto' : '2rem', left: isRTL ? '2rem' : 'auto' }}
              aria-label={closeLabel}
            >
              <X size={24} />
            </button>

            {/* Explicit heavy padding to ensure it's not cramped */}
            <div style={{ padding: '4rem 3rem' }}>
              {/* Icon + meta */}
              {(() => {
                const isGreen = GREEN_CATEGORIES.includes(activeArticle.category);
                const catColor = isGreen ? '#006B3C' : '#003DA5';
                const catBg = isGreen ? '#ecfdf5' : '#eff6ff';
                const Icon = ICON_MAP[activeArticle.icon];
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div
                      style={{ flexShrink: 0, width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: catBg, border: `1px solid ${catColor}1a` }}
                    >
                      <Icon size={24} style={{ color: catColor }} strokeWidth={1.75} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: catColor, marginBottom: '0.25rem' }}>
                        #{activeArticle.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {activeArticle.date}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Upgraded Title: Larger, bolder, tighter spacing, with a border separator */}
              <h2 style={{ 
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
                fontWeight: 800, 
                color: '#0f172a', 
                lineHeight: 1.2, 
                letterSpacing: '-0.025em',
                marginBottom: '2.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #e2e8f0'
              }}>
                {activeArticle.title}
              </h2>

              {/* Heavy gap between paragraphs, large text size, and tall line height */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeArticle.body.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#475569', margin: 0 }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}