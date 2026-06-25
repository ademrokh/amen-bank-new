import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Primary (Green) ── */
        'primary-50': '#f0fdf4',
        'primary-100': '#dcfce7',
        'primary-200': '#bbf7d0',
        primary: '#006B3C',
        'primary-dark': '#004d2b',

        /* ── Secondary (Blue) ── */
        'secondary-50': '#eff6ff',
        'secondary-100': '#dbeafe',
        secondary: '#003DA5',
        'secondary-dark': '#002a73',

        /* ── Accent (Gold) ── */
        'accent-50': '#fffbeb',
        accent: '#E8A000',

        /* ── Semantic ── */
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0ea5e9',

        /* ── Neutral (N26 palette) ── */
        ink: '#0f172a',
        'ink-secondary': '#64748b',
        'ink-muted': '#94a3b8',
        border: '#e2e8f0',
        surface: '#ffffff',
        'surface-alt': '#f8fafc',

        /* ── Slate scale (kept for utility classes) ── */
        'slate-50': '#f8fafc',
        'slate-100': '#f1f5f9',
        'slate-200': '#e2e8f0',
        'slate-300': '#cbd5e1',
        'slate-400': '#94a3b8',
        'slate-500': '#64748b',
        'slate-600': '#475569',
        'slate-700': '#334155',
        'slate-800': '#1e293b',
        'slate-900': '#0f172a',
      },

      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },

      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.03em' }],
        'h1': ['3rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h3': ['1.5rem', { lineHeight: '1.35', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h4': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.6875rem', { lineHeight: '1.4', fontWeight: '700', letterSpacing: '0.1em' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },

      /* Shadows: only for dropdowns/modals — never at rest on cards/buttons */
      boxShadow: {
        'dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        underlineIn: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },

      animation: {
        fadeIn: 'fadeIn 0.5s ease',
        slideInUp: 'slideInUp 0.5s ease',
        slideInDown: 'slideInDown 0.5s ease',
        underlineIn: 'underlineIn 0.2s ease',
      },

      spacing: {
        '128': '32rem',
        '144': '36rem',
        '150': '37.5rem',
      },
    },
  },

  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        /* ── Container ── */
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          maxWidth: '80rem',
          '@media (min-width: 640px)': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@media (min-width: 1024px)': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
        },

        /* ── Section Label (uppercase, no pill) ── */
        '.section-label': {
          fontSize: '0.6875rem',
          fontWeight: '700',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme('colors.primary'),
          marginBottom: '0.75rem',
        },
        '.section-label-secondary': {
          color: theme('colors.secondary'),
        },

        /* ── Buttons ── */
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          borderRadius: '0.375rem',
          padding: '0.75rem 1.75rem',
          fontSize: '1rem',
          lineHeight: '1.5',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          fontFamily: 'inherit',
          textDecoration: 'none',
        },

        '.btn-primary': {
          background: theme('colors.primary'),
          color: '#ffffff',
          '&:hover': {
            background: theme('colors.primary-dark'),
          },
        },

        '.btn-secondary': {
          background: theme('colors.secondary'),
          color: '#ffffff',
          '&:hover': {
            background: theme('colors.secondary-dark'),
          },
        },

        '.btn-outline': {
          background: 'transparent',
          border: '1px solid ' + theme('colors.slate-300'),
          color: theme('colors.ink'),
          '&:hover': {
            borderColor: theme('colors.slate-400'),
          },
        },

        '.btn-outline-white': {
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.7)',
          },
        },

        '.btn-ghost': {
          background: 'transparent',
          border: 'none',
          color: theme('colors.primary'),
          padding: '0.5rem 0',
          fontWeight: '600',
          '&:hover': {
            color: theme('colors.primary-dark'),
          },
        },

        '.btn-dark': {
          background: '#1f2937',
          color: '#ffffff',
          '&:hover': {
            background: '#111827',
          },
        },

        '.btn-white': {
          background: '#ffffff',
          color: theme('colors.primary-dark'),
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: theme('colors.slate-50'),
          },
        },

        '.btn-full': {
          width: '100%',
        },

        '.btn-lg': {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
        },

        /* ── Cards ── */
        '.card': {
          background: '#ffffff',
          border: '1px solid ' + theme('colors.border'),
          borderRadius: '0.5rem',
          padding: '2rem',
          transition: 'border-color 0.2s ease',
        },
        '.card:hover': {
          borderColor: theme('colors.slate-300'),
        },

        '.card-stripe-green': {
          borderTop: '2px solid ' + theme('colors.primary'),
        },
        '.card-stripe-blue': {
          borderTop: '2px solid ' + theme('colors.secondary'),
        },
        '.card-stripe-accent': {
          borderTop: '2px solid ' + theme('colors.accent'),
        },

        /* ── Feature Icon ── */
        '.feature-icon': {
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme('colors.primary-50'),
          border: '1px solid ' + theme('colors.border'),
          borderRadius: '0.5rem',
          color: theme('colors.primary'),
          flexShrink: '0',
        },

        /* ── Nav Link (underline slide-in) ── */
        '.nav-link': {
          position: 'relative',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: theme('colors.ink-secondary'),
          textDecoration: 'none',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: theme('colors.ink'),
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            width: '100%',
            height: '1px',
            background: theme('colors.ink'),
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.2s ease',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
          },
        },

        /* ── Glass Panel (hero right-side widget) ── */
        '.glass-panel': {
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '2rem',
        },

        /* ── Form Input ── */
        '.input-field': {
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          lineHeight: '1.5',
          border: '1px solid ' + theme('colors.border'),
          borderRadius: '0.5rem',
          background: '#ffffff',
          color: theme('colors.ink'),
          outline: 'none',
          transition: 'border-color 0.2s ease',
          '&::placeholder': {
            color: theme('colors.ink-muted'),
          },
          '&:focus': {
            borderColor: theme('colors.primary'),
          },
        },

        /* ── Section Header ── */
        '.section-header': {
          textAlign: 'center',
          marginBottom: '3rem',
        },
        '.section-header h1': {
          fontSize: '2.25rem',
          fontWeight: '700',
          color: theme('colors.ink'),
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
          lineHeight: '1.6',
          '@media (min-width: 768px)': {
            fontSize: '3rem',
          },
        },
        '.section-header p': {
          fontSize: '1.125rem',
          color: theme('colors.ink-secondary'),
          maxWidth: '42rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6',
        },

        /* ── FAQ Accordion Item ── */
        '.faq-item': {
          border: '1px solid ' + theme('colors.border'),
          borderRadius: '0.5rem',
          overflow: 'hidden',
          transition: 'border-color 0.2s ease',
        },
        '.faq-item-open': {
          borderColor: theme('colors.primary'),
        },
        '.faq-answer': {
          background: theme('colors.surface-alt'),
          padding: '1.5rem 2rem',
        },
        '.faq-chevron': {
          transition: 'transform 0.2s ease',
        },
        '.faq-chevron-open': {
          transform: 'rotate(180deg)',
        },

        /* ── Currency Tag ── */
        '.currency-tag': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          background: '#ffffff',
          border: '1px solid ' + theme('colors.border'),
          borderRadius: '0.375rem',
          color: theme('colors.ink-secondary'),
        },

        /* ── Stats Divider (hero dark section) ── */
        '.stats-divider': {
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          '&:last-child': {
            borderRight: 'none',
          },
        },
      });
    }),
  ],
};

export default config;