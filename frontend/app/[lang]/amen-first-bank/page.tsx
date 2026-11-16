import { AmenFirstBank } from '@/components/AmenFirstBank';
import { getLocalizedMetadata, type SiteLanguage } from '@/lib/locale-metadata';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: SiteLanguage }> }) {
  const { lang } = await params;
  return getLocalizedMetadata('amenFirstBank', lang);
}

export default function AmenFirstBankPage() {
  return <AmenFirstBank />;
}