import type { Metadata } from 'next';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: SiteLanguage }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getLocalizedMetadata('site', lang);
}

export default function LanguageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}