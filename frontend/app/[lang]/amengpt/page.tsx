import { FAQ } from '@/components/FAQ';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: SiteLanguage }> }) {
  const { lang } = await params;
  return getLocalizedMetadata('faq', lang);
}

export default function FAQPage() {
  return <FAQ />;
}