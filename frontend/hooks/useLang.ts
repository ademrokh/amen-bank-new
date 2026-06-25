'use client';

import { usePathname } from 'next/navigation';

type Language = 'fr' | 'ar' | 'en';

export function useLang(): { lang: Language; isRTL: boolean } {
  const pathname = usePathname();
  
  let lang: Language = 'fr';
  if (pathname) {
    const seg = pathname.split('/')[1];
    if (seg === 'fr' || seg === 'ar' || seg === 'en') {
      lang = seg as Language;
    }
  }
  
  return {
    lang,
    isRTL: lang === 'ar',
  };
}