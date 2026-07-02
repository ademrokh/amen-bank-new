import { notFound } from 'next/navigation';
import AccessInformationContent from '@/components/AccessInformation/AccessInformationContent';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Accès à l’information - Amen Bank',
  description: 'Informations sur le droit d’accès à l’information, la procédure de demande et les documents publiés par Amen Bank.',
};

export default async function AccessInformationPage({ params }: { params: Promise<{ lang: Language }> }) {
  const { lang } = await params;

  if (!['fr', 'en', 'ar'].includes(lang)) {
    notFound();
  }

  return <AccessInformationContent lang={lang} />;
}
