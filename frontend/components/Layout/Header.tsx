'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function Header() {
  const { lang: currentLang, isRTL } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
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
    { label: currentLang === 'fr' ? 'Accès à l’information' : currentLang === 'ar' ? 'الوصول إلى المعلومات' : 'Access to information', href: `/${currentLang}/acces-information` },
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
      className="header"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="banner"
    >
      <nav
        className={`container header-nav ${isRTL ? 'flex-row-reverse' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <Link
          href={`/${currentLang}/`}
          className={`header-logo ${isRTL ? 'flex-row-reverse' : ''}`}
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
          className={`header-nav-links ${isRTL ? 'flex-row-reverse' : ''}`}
          role="menubar"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header-nav-link ${
                isLinkActive(link.href) 
                  ? 'text-ink bg-surface-alt' 
                  : 'text-ink-secondary hover:text-ink hover:bg-surface-alt'
              }`}
              role="menuitem"
              aria-current={isLinkActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right Section ── */}
        <div className={`header-right ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="header-language-button"
              aria-label={`Select language, current: ${currentLang}`}
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="menu"
            >
              <span className="uppercase">{currentLang}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={`header-language-dropdown ${isRTL ? 'right-0' : 'left-0'}`}
                  role="menu"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`header-language-option ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      } ${
                        currentLang === lang.code
                          ? 'header-language-option-active'
                          : ''
                      }`}
                      role="menuitem"
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && (
                        <span className={`${isRTL ? 'mr-auto' : 'ml-auto'}`} aria-hidden="true">
                          <Check className="w-4 h-4 text-primary" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA Button — Desktop */}
          <Link
            href={`/${currentLang}/devenir-client`}
            className="btn btn-dark hidden lg:inline-flex"
          >
            {ctaLabel}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="header-mobile-toggle lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Navigation Menu ── */}
      {isMenuOpen && (
        <div
          className="header-mobile-menu lg:hidden"
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="header-mobile-menu-content container">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`header-mobile-menu-link ${
                  isRTL ? 'text-right' : 'text-left'
                } ${
                  isLinkActive(link.href)
                    ? 'text-primary font-semibold bg-primary-subtle'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-alt'
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isLinkActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}