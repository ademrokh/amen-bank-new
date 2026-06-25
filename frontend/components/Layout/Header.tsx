'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Header() {
  const { lang: currentLang, isRTL } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇹🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const switchLanguage = (lang: Language) => {
    const [pathOnly, query = ''] = pathname.split('?');
    const localePattern = /^\/(fr|en|ar)(\/|$)/;
    let newPath = pathOnly;

    if (localePattern.test(newPath)) {
      newPath = newPath.replace(localePattern, `/${lang}$2`);
    } else if (newPath === '/') {
      newPath = `/${lang}`;
    } else {
      newPath = `/${lang}${newPath}`;
    }

    router.push(`${newPath}${query ? `?${query}` : ''}`);
  };

  const navLinks = [
    { label: currentLang === 'fr' ? 'Accueil' : currentLang === 'ar' ? 'الرئيسية' : 'Home', href: `/${currentLang}/` },
    { label: currentLang === 'fr' ? 'Devenir client' : currentLang === 'ar' ? 'انضم إلينا' : 'Become a client', href: `/${currentLang}/devenir-client` },
    { label: currentLang === 'fr' ? 'Particuliers' : currentLang === 'ar' ? 'للأفراد' : 'Retail', href: `/${currentLang}/particuliers` },
    { label: currentLang === 'fr' ? 'Entreprises' : currentLang === 'ar' ? 'للشركات' : 'Business', href: `/${currentLang}/entreprises` },
    { label: currentLang === 'fr' ? 'Actualités' : currentLang === 'ar' ? 'الأخبار' : 'News', href: `/${currentLang}/actualites` },
    { label: currentLang === 'fr' ? 'Notre Identité' : currentLang === 'ar' ? 'هويتنا' : 'About Us', href: `/${currentLang}/notre-identite` },
    { label: currentLang === 'fr' ? 'Agences' : currentLang === 'ar' ? 'الفروع' : 'Branches', href: `/${currentLang}/agencies` },
  ];

  const ctaLabel =
    currentLang === 'fr' ? 'Ouvrir un compte' :
    currentLang === 'ar' ? 'فتح حساب' :
    'Open Account';

  const logoSubtitle =
    currentLang === 'fr' ? 'Depuis 1980' :
    currentLang === 'ar' ? 'منذ 1980' :
    'Since 1980';

  const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

  const isLinkActive = (href: string) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-surface border-b border-border"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="banner"
    >
      <nav
        className={`container flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── Logo: wordmark only, no icon block ── */}
        <Link
          href={`/${currentLang}/`}
          className={`flex items-center gap-2.5 no-underline ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span className="text-2xl font-bold text-primary leading-none select-none">
            A
          </span>
          <div className={`flex flex-col leading-tight ${isRTL ? 'items-end' : ''}`}>
            <span className="text-base font-bold tracking-tight text-ink">
              Amen Bank
            </span>
            <span className="text-[0.625rem] text-ink-muted tracking-wide uppercase">
              {logoSubtitle}
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <div
          className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          role="menubar"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isLinkActive(link.href) ? 'text-ink font-semibold' : ''}`}
              role="menuitem"
              aria-current={isLinkActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right Section: Language + CTA + Mobile toggle ── */}
        <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language Selector — text-only, no box */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 text-small font-medium text-ink-secondary hover:text-ink bg-transparent border-none cursor-pointer p-0 transition-colors"
              aria-label={`Select language, current: ${currentLang}`}
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="menu"
            >
              <span className="uppercase">{currentLang}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {isLangDropdownOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={`absolute top-full mt-2 z-50 bg-surface border border-border rounded-lg py-1 min-w-40 shadow-dropdown ${isRTL ? 'right-0' : 'left-0'}`}
                  role="menu"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-small bg-transparent border-none cursor-pointer transition-colors hover:bg-surface-alt ${
                        isRTL
                          ? 'text-right flex-row-reverse'
                          : 'text-left'
                      } ${
                        currentLang === lang.code
                          ? 'text-ink font-semibold'
                          : 'text-ink-secondary'
                      }`}
                      role="menuitem"
                    >
                      <span className="text-base leading-none" aria-hidden="true">
                        {lang.flag}
                      </span>
                      <span>{lang.label}</span>
                      {currentLang === lang.code && (
                        <span
                          className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-primary text-sm`}
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA Button — Desktop: solid dark, tight radius */}
          <Link
            href={`/${currentLang}/devenir-client`}
            className="btn btn-dark hidden lg:inline-flex"
          >
            {ctaLabel}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-ink border-none bg-transparent cursor-pointer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Navigation Menu ── */}
      {isMenuOpen && (
        <div
          className="lg:hidden border-t border-border bg-surface animate-fadeIn"
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 text-small no-underline transition-colors border-b border-border last:border-b-0 ${
                  isRTL ? 'text-right' : 'text-left'
                } ${
                  isLinkActive(link.href)
                    ? `text-primary font-semibold ${
                        isRTL
                          ? 'border-r-2 border-r-primary pr-3'
                          : 'border-l-2 border-l-primary pl-3'
                      }`
                    : 'text-ink-secondary hover:text-ink'
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isLinkActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 px-4 pb-2">
              <Link
                href={`/${currentLang}/devenir-client`}
                className="btn btn-primary btn-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}