import { Careers } from '@/components/Careers';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Carrières - Amen Bank',
  description: 'Rejoignez notre équipe et construisez votre carrière chez Amen Bank.',
};

export default function CareersPage() {
  return <Careers />;
}