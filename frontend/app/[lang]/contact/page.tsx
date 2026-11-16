import { Contact } from '@/components/Contact';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: SiteLanguage }> }) {
  const { lang } = await params;
  return getLocalizedMetadata('contact', lang);
}

export default function ContactPage() {
  return <Contact />;
}