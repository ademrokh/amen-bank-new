'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'fr' | 'ar' | 'en';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Extract current language from pathname
  let currentLang: Language = 'fr';
  if (pathname) {
    const langFromPath = pathname.split('/')[1];
    if (langFromPath === 'fr' || langFromPath === 'ar' || langFromPath === 'en') {
      currentLang = langFromPath as Language;
    }
  }

  const isRTL = currentLang === 'ar';

  const languages = [
    { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
    { code: 'ar' as Language, label: 'العربية', flag: '🇹🇳' },
    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  ];

  const switchLanguage = (lang: Language) => {
    const newPath = pathname.replace(`/${currentLang}/`, `/${lang}/`);
    router.push(newPath);
  };

  const navLinks = [
    { label: currentLang === 'fr' ? 'Accueil'    : currentLang === 'ar' ? 'الرئيسية'       : 'Home',     href: `/${currentLang}/` },
    { label: currentLang === 'fr' ? 'Particuliers': currentLang === 'ar' ? 'للأفراد'        : 'Retail',   href: `/${currentLang}/particuliers` },
    { label: currentLang === 'fr' ? 'Entreprises' : currentLang === 'ar' ? 'للشركات'        : 'Business', href: `/${currentLang}/entreprises` },
    { label: currentLang === 'fr' ? 'Agences'     : currentLang === 'ar' ? 'الفروع'         : 'Branches', href: `/${currentLang}/reseau-agences` },
    { label: currentLang === 'fr' ? 'FAQ'         : currentLang === 'ar' ? 'الأسئلة الشائعة': 'FAQ',      href: `/${currentLang}/faq` },
  ];

  const ctaLabel =
    currentLang === 'fr' ? 'Ouvrir un compte' :
    currentLang === 'ar' ? 'فتح حساب' :
    'Open Account';

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100 transition-all duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="banner"
    >
      <nav
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href={`/${currentLang}/`} className="flex items-center gap-3 shrink-0 group">
          <div className="w-12 h-12 bg-linear-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:shadow-xl transition-shadow">
            A
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-lg text-gray-900">Amen Bank</p>
            <p className="text-xs text-gray-500">Since 1980</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`hidden lg:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          role="menubar"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors group"
              role="menuitem"
            >
              {link.label}
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-linear-to-r from-blue-900 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Right Section: Language + CTA + Mobile toggle */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm"
              aria-label={`Select language, current: ${currentLang}`}
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="menu"
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {isLangDropdownOpen && (
              <div
                className={`absolute top-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-40 border border-gray-100 ${isRTL ? 'right-0' : 'left-0'}`}
                role="menu"
              >
                {languages.map((lang, idx) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      switchLanguage(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 font-medium text-sm
                      ${currentLang === lang.code ? 'bg-blue-50 text-blue-900' : 'text-gray-700'}
                      ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                      ${idx !== languages.length - 1 ? 'border-b border-gray-100' : ''}`}
                    role="menuitem"
                    aria-current={currentLang === lang.code ? 'true' : 'false'}
                  >
                    <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {currentLang === lang.code && (
                      <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-blue-900`} aria-hidden="true">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button — Desktop */}
          <Link
            href={`/${currentLang}/devenir-client`}
            className="hidden md:block px-4 py-2 bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm"
          >
            {ctaLabel}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden bg-linear-to-b from-white to-gray-50 border-t border-gray-100"
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 font-medium text-sm border-transparent hover:border-blue-900
                  ${isRTL ? 'border-r-4 border-l-0 text-right' : 'border-l-4'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href={`/${currentLang}/devenir-client`}
                className="block w-full text-center bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md"
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