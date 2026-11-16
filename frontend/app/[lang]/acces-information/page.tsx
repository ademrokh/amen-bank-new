import { notFound } from 'next/navigation';
import AccessInformationContent from '@/components/AccessInformation/AccessInformationContent';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: SiteLanguage }> }) {
  const { lang } = await params;
  return getLocalizedMetadata('accessInformation', lang);
}

export default async function AccessInformationPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;

  if (!['fr', 'en', 'ar'].includes(lang)) {
    notFound();
  }

  return <AccessInformationContent lang={lang} />;
}
