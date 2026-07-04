'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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

  // Securely check admin status via API because cookie is httpOnly
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/status');
        if (!isMounted) return;
        const data = await res.json();
        setIsAdmin(data.isAdmin === true);
      } catch {
        if (isMounted) setIsAdmin(false);
      }
    };

    checkAdmin();

    const handleRouteChange = () => checkAdmin();
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [pathname]);

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

  const isAdminRoute = /^\/(fr|en|ar)\/admin(\/|$)/.test(pathname);

  // Dynamic routing for the admin pill
  const adminTargetHref = pathname.includes('acces-information')
    ? `/${currentLang}/admin/acces-information`
    : pathname.includes('press')
      ? `/${currentLang}/admin/press`
      : `/${currentLang}/admin/acces-information`;

  const navLinks = [
    { label: currentLang === 'fr' ? 'Accueil' : currentLang === 'ar' ? 'الرئيسية' : 'Home', href: `/${currentLang}/` },
    { label: currentLang === 'fr' ? 'Devenir client' : currentLang === 'ar' ? 'انضم إلينا' : 'Become a client', href: `/${currentLang}/devenir-client` },
    { label: currentLang === 'fr' ? 'Particuliers' : currentLang === 'ar' ? 'للأفراد' : 'Retail', href: `/${currentLang}/particuliers` },
    { label: currentLang === 'fr' ? 'Entreprises' : currentLang === 'ar' ? 'للشركات' : 'Business', href: `/${currentLang}/entreprises` },
    { label: currentLang === 'fr' ? 'Actualités' : currentLang === 'ar' ? 'الأخبار' : 'News', href: `/${currentLang}/actualites` },
    { label: currentLang === 'fr' ? "Accès à l'information" : currentLang === 'ar' ? 'الوصول إلى المعلومات' : 'Access to information', href: `/${currentLang}/acces-information` },
    { label: currentLang === 'fr' ? 'Notre Identité' : currentLang === 'ar' ? 'هويتنا' : 'About Us', href: `/${currentLang}/notre-identite` },
    { label: currentLang === 'fr' ? 'Agences' : currentLang === 'ar' ? 'الفروع' : 'Branches', href: `/${currentLang}/agencies` },
  ];

  // Admin nav — minimal, just the admin section links
  const adminNavLinks = [
    { label: currentLang === 'fr' ? "Accès à l'information" : currentLang === 'ar' ? 'الوصول إلى المعلومات' : 'Access to information', href: `/${currentLang}/admin/acces-information` },
    { label: currentLang === 'fr' ? 'Presse' : currentLang === 'ar' ? 'الصحافة' : 'Press', href: `/${currentLang}/admin/press` },
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

  const activeNavLinks = isAdminRoute ? adminNavLinks : navLinks;

  return (
    <header
      className="header"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="banner"
    >
      <nav
        className={`container header-nav ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div className="header-left" style={{   display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
          <Link
            href={`/${currentLang}/`}
            className={`header-logo ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Image
              src="/favicon.ico"
              alt="Amen Bank"
              width={32}
              height={32}
              className="select-none"
            />
            <div className={`flex flex-col leading-tight ${isRTL ? 'items-end' : ''}`}>
              <span className="text-base font-bold tracking-tight text-ink">
                Amen Bank
              </span>
              <span className="text-[0.625rem] text-ink-muted tracking-wide uppercase">
                {logoSubtitle}
              </span>
            </div>
          </Link>

          {/* Admin badge next to logo — only on admin routes */}
          {isAdminRoute && (
            <span style={{
              marginLeft: '12px',
              padding: '2px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              background: '#FEF3C7',
              color: '#92400E',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Admin
            </span>
          )}
        </div>

        {/* ── Desktop Navigation ── */}
        <div
          className={`header-nav-links ${isRTL ? 'flex-row-reverse' : ''}`}
          role="menubar"
        >
          {activeNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header-nav-link whitespace-nowrap ${
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
        <div
          className={`header-right ${isRTL ? 'flex-row-reverse' : ''}`}
          style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', marginLeft: 'auto' }}
        >

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

          {/* CTA Button — Desktop, hidden on admin routes */}
          {!isAdminRoute && (
            <Link
              href={`/${currentLang}/devenir-client`}
              className="btn btn-dark hidden lg:inline-flex"
            >
              {ctaLabel}
            </Link>
          )}

          {/* Admin / User View Context Switcher */}
          {isAdmin && (
            <Link
              href={isAdminRoute ? `/${currentLang}/` : adminTargetHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 500,
                border: isAdminRoute ? '1px solid #003DA5' : 'none',
                background: isAdminRoute ? '#ffffff' : '#003DA5',
                color: isAdminRoute ? '#003DA5' : '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                marginLeft: isRTL ? '0' : '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (isAdminRoute) e.currentTarget.style.background = 'rgba(0, 61, 165, 0.1)';
                else e.currentTarget.style.background = '#002d8a';
              }}
              onMouseLeave={e => {
                if (isAdminRoute) e.currentTarget.style.background = '#ffffff';
                else e.currentTarget.style.background = '#003DA5';
              }}
            >
              {isAdminRoute
                ? (currentLang === 'fr' ? 'Vue utilisateur' : currentLang === 'ar' ? 'عرض المستخدم' : 'User View')
                : (currentLang === 'fr' ? 'Admin' : currentLang === 'ar' ? 'إدارة' : 'Admin')}
            </Link>
          )}

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
            {activeNavLinks.map((link) => (
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